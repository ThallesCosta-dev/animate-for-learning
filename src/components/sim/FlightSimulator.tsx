import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useProgress } from "@/hooks/use-progress";
import { Slider } from "@/components/Slider";

// Tamanho lógico da cena; o Phaser escala para o tamanho real do contêiner.
const LARGURA = 800;
const ALTURA = 480;
const CHAO = ALTURA - 52;
const ZONA_POUSO = { x0: LARGURA * 0.68, x1: LARGURA * 0.92 };

interface Controles {
  esquerda: boolean;
  direita: boolean;
  freio: boolean;
  acelerar: boolean;
  /** Vento em km/h: negativo = de frente (contra o voo), positivo = de cauda. */
  vento: number;
  reiniciar: boolean;
}

// Simulador de voo em Phaser, carregado só no cliente (Phaser usa APIs de navegador).
export function FlightSimulator() {
  const hostRef = useRef<HTMLDivElement>(null);
  const controlesRef = useRef<Controles>({
    esquerda: false,
    direita: false,
    freio: false,
    acelerar: false,
    vento: 0,
    reiniciar: false,
  });
  const [vento, setVento] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const { state } = useProgress();
  controlesRef.current.vento = vento;

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;
    let cancelado = false;
    const controles = controlesRef.current;

    import("phaser").then((Phaser) => {
      if (cancelado || !hostRef.current) return;

      class Cena extends Phaser.Scene {
        piloto!: Phaser.GameObjects.Ellipse;
        corpo!: Phaser.GameObjects.Arc;
        velX = 0; // velocidade "no ar" (px/s)
        velY = 0;
        angulo = 6;
        pousado = false;
        termicas: number[] = [];
        nuvens: Phaser.GameObjects.Container[] = [];
        textoHud!: Phaser.GameObjects.Text;
        textoAviso!: Phaser.GameObjects.Text;
        ventoGfx!: Phaser.GameObjects.Graphics;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        teclaW!: Phaser.Input.Keyboard.Key;
        teclaS!: Phaser.Input.Keyboard.Key;
        tempo = 0;

        create() {
          // céu
          const g = this.add.graphics();
          g.fillGradientStyle(0x7db8e8, 0x7db8e8, 0xe8f4fc, 0xe8f4fc, 1);
          g.fillRect(0, 0, LARGURA, ALTURA);

          // montanhas ao fundo
          const fundo = this.add.graphics();
          fundo.fillStyle(0x9fb4c6, 1);
          fundo.fillTriangle(
            0,
            ALTURA - 40,
            LARGURA * 0.18,
            ALTURA - 210,
            LARGURA * 0.4,
            ALTURA - 40,
          );
          fundo.fillStyle(0x8aa2b7, 1);
          fundo.fillTriangle(
            LARGURA * 0.3,
            ALTURA - 40,
            LARGURA * 0.52,
            ALTURA - 170,
            LARGURA * 0.74,
            ALTURA - 40,
          );

          // nuvens decorativas acima das térmicas
          const xs = [LARGURA * 0.3, LARGURA * 0.55, LARGURA * 0.82];
          for (const x of xs) {
            const c = this.add.container(x, 70);
            c.add(this.add.ellipse(0, 0, 90, 34, 0xffffff, 0.95));
            c.add(this.add.ellipse(-22, -10, 44, 34, 0xffffff, 0.95));
            c.add(this.add.ellipse(18, -12, 52, 38, 0xffffff, 0.95));
            this.nuvens.push(c);
          }

          // solo e morro da decolagem
          const solo = this.add.graphics();
          solo.fillStyle(0x6e9a5a, 1);
          solo.fillRect(0, ALTURA - 40, LARGURA, 40);
          solo.fillStyle(0x8aa875, 1);
          solo.fillTriangle(
            0,
            ALTURA - 40,
            LARGURA * 0.22,
            ALTURA - 160,
            LARGURA * 0.44,
            ALTURA - 40,
          );

          // área de pouso
          const pouso = this.add.graphics();
          pouso.fillStyle(0xf4e9b0, 1);
          pouso.fillRect(ZONA_POUSO.x0, ALTURA - 44, ZONA_POUSO.x1 - ZONA_POUSO.x0, 8);
          pouso.lineStyle(2, 0xa06a10, 1);
          pouso.strokeRect(ZONA_POUSO.x0, ALTURA - 44, ZONA_POUSO.x1 - ZONA_POUSO.x0, 8);
          this.add
            .text((ZONA_POUSO.x0 + ZONA_POUSO.x1) / 2, ALTURA - 30, "POUSO", {
              fontSize: "13px",
              color: "#5a3c08",
              fontStyle: "bold",
            })
            .setOrigin(0.5, 0);

          // térmicas (colunas com marca visual sutil)
          for (const x of xs) {
            this.termicas.push(x);
            this.add.rectangle(x, (ALTURA - 40 + 90) / 2, 92, ALTURA - 40 - 90, 0xf08c28, 0.1);
            this.add.circle(x, ALTURA / 2, 46, 0xf08c28, 0.12);
            this.add
              .text(x, ALTURA - 62, "térmica", { fontSize: "11px", color: "#8a4a10" })
              .setOrigin(0.5, 0);
          }

          // setas de vento (redesenhadas a cada quadro)
          this.ventoGfx = this.add.graphics();

          // piloto (asa + corpo)
          this.piloto = this.add.ellipse(80, 120, 34, 14, 0x28405a);
          this.corpo = this.add.circle(80, 138, 5, 0x334155);

          const teclado = this.input.keyboard!;
          this.cursors = teclado.createCursorKeys();
          this.teclaW = teclado.addKey("W");
          this.teclaS = teclado.addKey("S");
          // Só captura as setas (impede a rolagem da página) enquanto o cursor está sobre o jogo.
          this.input.on("gameout", () => {
            teclado.enabled = false;
            teclado.clearCaptures();
          });
          this.input.on("gameover", () => {
            teclado.enabled = true;
            teclado.addCapture(["UP", "DOWN", "LEFT", "RIGHT", "W", "S"]);
          });

          this.textoHud = this.add.text(10, 8, "", {
            fontSize: "14px",
            color: "#1a2a3a",
            fontStyle: "bold",
          });
          this.textoAviso = this.add
            .text(LARGURA / 2, 40, "", {
              fontSize: "16px",
              color: "#a03028",
              fontStyle: "bold",
              align: "center",
              wordWrap: { width: LARGURA - 40 },
            })
            .setOrigin(0.5, 0);

          this.input.on("pointerdown", () => {
            if (this.pousado) this.reiniciar();
          });
        }

        reiniciar() {
          this.piloto.setPosition(80, 120);
          this.angulo = 6;
          this.velX = 0;
          this.velY = 0;
          this.pousado = false;
          this.textoAviso.setText("");
        }

        pousar(emEstol: boolean, ventoPx: number) {
          this.pousado = true;
          this.piloto.y = CHAO;
          const velSolo = this.velX + ventoPx;
          const naZona = this.piloto.x >= ZONA_POUSO.x0 && this.piloto.x <= ZONA_POUSO.x1;
          const suave = !emEstol && this.velX >= 30 && velSolo <= 70;
          let msg: string;
          if (emEstol)
            msg = "⚠️ Pouso duro: a asa estolou. Solte os freios antes de chegar ao chão.";
          else if (this.velX < 30)
            msg = "⚠️ Pouso duro: chegou devagar demais, sem energia para o flare.";
          else if (velSolo > 70)
            msg =
              "⚠️ Pouso rápido demais: com vento de cauda o solo passa correndo. Pouse contra o vento.";
          else if (!naZona)
            msg =
              "🙂 Pouso suave, mas fora da área de pouso. Planeje o planeio até a faixa amarela.";
          else msg = "✅ Bom pouso, na área certa! Toque ou clique para voar de novo.";
          if (!suave || !naZona) msg += "\nToque ou clique para recomeçar.";
          this.textoAviso.setText(msg);
          this.velX = 0;
          this.velY = 0;
        }

        override update(_: number, delta: number) {
          const dt = Math.min(0.05, delta / 1000);
          this.tempo += dt;

          if (controles.reiniciar) {
            controles.reiniciar = false;
            this.reiniciar();
          }

          // vento: px/s, positivo empurra para a direita (cauda)
          const ventoPx = controles.vento * 1.6;
          this.desenharVento(ventoPx);
          for (const n of this.nuvens) n.x += ventoPx * 0.15 * dt;
          for (const n of this.nuvens) {
            if (n.x > LARGURA + 60) n.x = -60;
            if (n.x < -60) n.x = LARGURA + 60;
          }

          if (this.pousado) return;

          const esquerda = this.cursors.left.isDown || controles.esquerda;
          const direita = this.cursors.right.isDown || controles.direita;
          const freio = this.cursors.down.isDown || this.teclaS.isDown || controles.freio;
          const acelerar = this.cursors.up.isDown || this.teclaW.isDown || controles.acelerar;

          // ângulo de ataque didático
          if (freio) this.angulo = Math.min(24, this.angulo + 30 * dt);
          else if (acelerar) this.angulo = Math.max(2, this.angulo - 30 * dt);
          else this.angulo += (6 - this.angulo) * dt * 0.6;

          // modelo simplificado: sustentação cresce com ângulo até o estol (~15°)
          const cl =
            this.angulo <= 15
              ? 0.25 + this.angulo * 0.08
              : Math.max(0.3, 1.45 - (this.angulo - 15) * 0.5);
          const emEstol = this.angulo > 15;

          // velocidade no ar: mais ângulo = mais devagar; setas ajustam
          const alvoVel = 90 - this.angulo * 3;
          this.velX += (alvoVel - this.velX) * dt * 0.8;
          if (esquerda) this.velX -= 180 * dt;
          if (direita) this.velX += 180 * dt;
          this.velX = Math.max(15, Math.min(100, this.velX));

          // taxa de descida: menor com mais sustentação; térmica empurra para cima
          let sink = 60 - cl * 40;
          if (emEstol) sink = 160; // estol: cai rápido
          const naTermica = this.termicas.some((tx) => Math.abs(this.piloto.x - tx) < 46);
          if (naTermica) sink -= 130;
          this.velY += (sink - this.velY) * dt * 0.8;

          const velSolo = this.velX + ventoPx;
          this.piloto.x += velSolo * dt;
          this.piloto.y += this.velY * dt;

          // limites do mundo
          this.piloto.x = Math.max(15, Math.min(LARGURA - 15, this.piloto.x));
          if (this.piloto.y < 20) this.piloto.y = 20;

          if (this.piloto.y >= CHAO) {
            this.pousar(emEstol, ventoPx);
          } else {
            this.textoAviso.setText(
              emEstol ? "⚠️ ESTOL — solte os freios!" : naTermica ? "⬆️ Térmica! Subindo…" : "",
            );
          }

          this.corpo.setPosition(this.piloto.x, this.piloto.y + 18);
          this.piloto.setRotation((-this.angulo * Math.PI) / 180 / 3);
          this.piloto.setFillStyle(emEstol ? 0xa03028 : 0x28405a);

          const alturaM = Math.max(0, Math.round((CHAO - this.piloto.y) * 2));
          const velArKmh = Math.round(this.velX * 0.4);
          const velSoloKmh = Math.round(velSolo * 0.4);
          this.textoHud.setText(
            `Altitude: ${alturaM} m   No ar: ${velArKmh} km/h   No solo: ${velSoloKmh} km/h   Ângulo: ${Math.round(this.angulo)}°   Vento: ${controles.vento > 0 ? "+" : ""}${controles.vento} km/h`,
          );
        }

        desenharVento(ventoPx: number) {
          const g = this.ventoGfx;
          g.clear();
          if (Math.abs(ventoPx) < 1) return;
          const sentido = Math.sign(ventoPx);
          g.lineStyle(2, 0x3c5a7a, 0.45);
          for (let i = 0; i < 4; i++) {
            const y = 110 + i * 70;
            const desloc = ((this.tempo * Math.abs(ventoPx) * 0.6 + i * 60) % 140) * sentido;
            const x = (sentido > 0 ? 20 : LARGURA - 20) + desloc;
            g.lineBetween(x, y, x + 26 * sentido, y);
            g.lineBetween(x + 26 * sentido, y, x + 18 * sentido, y - 5);
            g.lineBetween(x + 26 * sentido, y, x + 18 * sentido, y + 5);
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#dceefb",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: LARGURA,
          height: ALTURA,
        },
        scene: Cena,
      }) as unknown as typeof game;
      setCarregando(false);
    });

    return () => {
      cancelado = true;
      game?.destroy(true);
    };
  }, []);

  const segurar =
    (tecla: keyof Pick<Controles, "esquerda" | "direita" | "freio" | "acelerar">) =>
    (ativo: boolean) =>
    (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      controlesRef.current[tecla] = ativo;
    };

  const BotaoToque = ({
    tecla,
    children,
    rotulo,
  }: {
    tecla: "esquerda" | "direita" | "freio" | "acelerar";
    children: string;
    rotulo: string;
  }) => {
    const set = segurar(tecla);
    return (
      <button
        type="button"
        aria-label={rotulo}
        onPointerDown={set(true)}
        onPointerUp={set(false)}
        onPointerLeave={set(false)}
        onPointerCancel={set(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="touch-none select-none rounded-xl bg-secondary px-4 py-3 text-lg font-bold text-secondary-foreground active:bg-primary active:text-primary-foreground"
      >
        {children}
      </button>
    );
  };

  return (
    <div>
      <div
        ref={hostRef}
        className="relative w-full overflow-hidden rounded-xl border border-border bg-skyblue/30"
        style={{ aspectRatio: `${LARGURA} / ${ALTURA}` }}
        role="application"
        aria-label="Simulador de voo de parapente: setas ou botões na tela direcionam o voo; ↓/S freia e ↑/W acelera"
      >
        {carregando && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Carregando simulador…
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Slider
          label="Vento (− de frente / + de cauda)"
          value={vento}
          min={-25}
          max={25}
          unit="km/h"
          onChange={setVento}
        />
        <button
          type="button"
          onClick={() => {
            controlesRef.current.reiniciar = true;
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Recomeçar
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Controles de toque">
        <BotaoToque tecla="esquerda" rotulo="Mais devagar / para a esquerda">
          ◀ Esquerda
        </BotaoToque>
        <BotaoToque tecla="direita" rotulo="Mais rápido / para a direita">
          Direita ▶
        </BotaoToque>
        <BotaoToque tecla="freio" rotulo="Frear (aumenta o ângulo de ataque)">
          ▼ Frear
        </BotaoToque>
        <BotaoToque tecla="acelerar" rotulo="Acelerar (diminui o ângulo de ataque)">
          ▲ Acelerar
        </BotaoToque>
      </div>

      <div className="mt-3 rounded-xl bg-accent/60 p-4 text-sm">
        <p className="font-semibold">Como jogar</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-foreground/90">
          <li>← e → (ou os botões): ajustam o deslocamento horizontal.</li>
          <li>↓ ou S (ou "Frear"): aumenta o ângulo de ataque — cuidado com o estol!</li>
          <li>↑ ou W (ou "Acelerar"): diminui o ângulo e ganha velocidade.</li>
          <li>Voe pelas colunas laranjas (térmicas) para ganhar altitude.</li>
          <li>
            Mude o vento e repare na diferença entre velocidade no ar e no solo. Pouse na faixa
            amarela, contra o vento, com velocidade e sem estol.
          </li>
        </ul>
        {state.reduceMotion && (
          <p className="mt-2 text-muted-foreground" role="status">
            Sua preferência de movimento reduzido está ativa. O simulador é um jogo e tem movimento
            contínuo por natureza; ele só roda enquanto esta página está aberta.
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Simulação extremamente simplificada, apenas para fins educacionais. Não representa o
        comportamento real de uma asa nem substitui instrução prática.
      </p>
    </div>
  );
}

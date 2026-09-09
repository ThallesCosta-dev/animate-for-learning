import { useEffect, useRef } from "react";
import { useProgress } from "@/hooks/use-progress";

// Simulador de voo em Phaser, carregado só no cliente (Phaser usa APIs de navegador).
export function FlightSimulator() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { state } = useProgress();

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;
    let cancelado = false;

    import("phaser").then((Phaser) => {
      if (cancelado || !hostRef.current) return;

      const largura = hostRef.current.clientWidth;
      const altura = 480;

      class Cena extends Phaser.Scene {
        piloto!: Phaser.GameObjects.Ellipse & { body: Phaser.Physics.Arcade.Body };
        velX = 0;
        velY = 0;
        angulo = 6;
        termicas: Phaser.GameObjects.Arc[] = [];
        textoHud!: Phaser.GameObjects.Text;
        textoAviso!: Phaser.GameObjects.Text;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        teclaUp!: Phaser.Input.Keyboard.Key;
        teclaDown!: Phaser.Input.Keyboard.Key;
        toqueDir = 0; // -1 esq, +1 dir
        toqueFreio = 0;

        create() {
          // céu
          const g = this.add.graphics();
          g.fillGradientStyle(0x7db8e8, 0x7db8e8, 0xe8f4fc, 0xe8f4fc, 1);
          g.fillRect(0, 0, largura, altura);

          // solo
          const solo = this.add.graphics();
          solo.fillStyle(0x6e9a5a, 1);
          solo.fillRect(0, altura - 40, largura, 40);
          solo.fillStyle(0x8aa875, 1);
          solo.fillTriangle(0, altura - 40, largura * 0.25, altura - 160, largura * 0.5, altura - 40);

          // térmicas (colunas invisíveis com marca visual sutil)
          for (const x of [largura * 0.3, largura * 0.62, largura * 0.85]) {
            const zona = this.add.circle(x, altura / 2, 46, 0xf08c28, 0.12);
            this.termicas.push(zona);
          }

          // piloto (parapente simplificado)
          this.piloto = this.add.ellipse(80, 120, 30, 14, 0x28405a) as typeof this.piloto;
          this.physics.add.existing(this.piloto);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.teclaUp = this.input.keyboard!.addKey("W");
          this.teclaDown = this.input.keyboard!.addKey("S");

          this.textoHud = this.add.text(10, 8, "", {
            fontSize: "14px",
            color: "#1a2a3a",
            fontStyle: "bold",
          });
          this.textoAviso = this.add.text(largura / 2, 40, "", {
            fontSize: "16px",
            color: "#a03028",
            fontStyle: "bold",
          }).setOrigin(0.5, 0);

          // controles de toque
          const zonaEsq = this.add.rectangle(largura * 0.25, altura - 20, largura / 2, 40, 0xffffff, 0.001).setInteractive();
          const zonaDir = this.add.rectangle(largura * 0.75, altura - 20, largura / 2, 40, 0xffffff, 0.001).setInteractive();
          zonaEsq.on("pointerdown", () => (this.toqueDir = -1));
          zonaDir.on("pointerdown", () => (this.toqueDir = 1));
          this.input.on("pointerup", () => (this.toqueDir = 0));
        }

        override update(_: number, delta: number) {
          const dt = delta / 1000;
          const esquerda = this.cursors.left?.isDown || this.toqueDir === -1;
          const direita = this.cursors.right?.isDown || this.toqueDir === 1;
          const freio = this.cursors.down?.isDown || this.teclaDown.isDown;
          const acelerar = this.cursors.up?.isDown || this.teclaUp.isDown;

          // ângulo de ataque didático
          if (freio) this.angulo = Math.min(24, this.angulo + 30 * dt);
          else if (acelerar) this.angulo = Math.max(2, this.angulo - 30 * dt);
          else this.angulo += (6 - this.angulo) * dt * 0.6;

          // modelo simplificado: sustentação cresce com ângulo até o estol (~15°)
          const cl = this.angulo <= 15 ? 0.25 + this.angulo * 0.08 : Math.max(0.3, 1.45 - (this.angulo - 15) * 0.5);
          const emEstol = this.angulo > 15;

          // velocidade horizontal
          const alvoVel = 90 - this.angulo * 3;
          this.velX += (alvoVel - this.velX) * dt * 0.8;
          if (esquerda) this.velX -= 60 * dt * 3;
          if (direita) this.velX += 60 * dt * 3;

          // taxa de descida: menor com mais sustentação; térmica empurra para cima
          let sink = 60 - cl * 40;
          if (emEstol) sink = 160; // estol: cai rápido
          const naTermica = this.termicas.some(
            (t) => Math.abs(this.piloto.x - t.x) < 46
          );
          if (naTermica) sink -= 130;

          this.velY += (sink - this.velY) * dt * 0.8;

          this.piloto.x += this.velX * dt;
          this.piloto.y += this.velY * dt;

          // limites do mundo
          if (this.piloto.x < 15) this.piloto.x = 15;
          if (this.piloto.x > largura - 15) this.piloto.x = largura - 15;
          if (this.piloto.y < 20) this.piloto.y = 20;

          // pouso / chão
          if (this.piloto.y > altura - 52) {
            this.piloto.y = altura - 52;
            this.textoAviso.setText(
              emEstol || this.velX < 30
                ? "⚠️ Pouso duro! Estolou ou chegou devagar demais. Toque para recomeçar."
                : "✅ Bom pouso! Toque para voar de novo."
            );
            this.velX = 0;
            this.velY = 0;
            this.input.once("pointerdown", () => {
              this.piloto.x = 80;
              this.piloto.y = 120;
              this.angulo = 6;
              this.textoAviso.setText("");
            });
          } else {
            this.textoAviso.setText(emEstol ? "⚠️ ESTOL — solte os freios!" : naTermica ? "⬆️ Térmica! Subindo…" : "");
          }

          const alturaM = Math.max(0, Math.round((altura - 52 - this.piloto.y) * 2));
          const velKmh = Math.round(this.velX * 0.4);
          this.textoHud.setText(
            `Altitude: ${alturaM} m   Velocidade: ${velKmh} km/h   Ângulo: ${Math.round(this.angulo)}°`
          );

          // visual da asa muda com o ângulo
          this.piloto.setFillStyle(emEstol ? 0xa03028 : 0x28405a);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: largura,
        height: altura,
        backgroundColor: "#dceefb",
        physics: { default: "arcade" },
        scene: Cena,
      }) as unknown as typeof game;
    });

    return () => {
      cancelado = true;
      game?.destroy(true);
    };
  }, []);

  return (
    <div>
      <div
        ref={hostRef}
        className="w-full overflow-hidden rounded-xl border border-border"
        role="application"
        aria-label="Simulador de voo de parapente: use as setas do teclado para voar, W e S controlam o ângulo"
      />
      <div className="mt-3 rounded-xl bg-accent/60 p-4 text-sm">
        <p className="font-semibold">Como jogar</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-foreground/90">
          <li>← e → : direcionar o voo (ou toque nos lados da tela)</li>
          <li>↓ ou S: frear (aumenta o ângulo de ataque — cuidado com o estol!)</li>
          <li>↑ ou W: acelerar (diminui o ângulo)</li>
          <li>Voe pelas colunas laranjas (térmicas) para ganhar altitude.</li>
          <li>Pouse suave: chegue com velocidade e sem estol.</li>
        </ul>
        {state.reduceMotion && (
          <p className="mt-2 text-muted-foreground" role="status">
            Sua preferência de movimento reduzido está ativa; o simulador tem movimento constante
            por natureza — pause quando quiser fechando esta página.
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

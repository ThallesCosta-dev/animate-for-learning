import { createFileRoute } from "@tanstack/react-router";
import { Lesson } from "@/components/Lesson";
import { WingParts } from "@/components/aero/WingParts";
import { AirfoilLab } from "@/components/aero/AirfoilLab";
import { LiftDragChart } from "@/components/aero/LiftDragChart";
import { StallSim } from "@/components/aero/StallSim";
import { WingLoading } from "@/components/aero/WingLoading";
import { WindVectors } from "@/components/aero/WindVectors";
import { GlideSim } from "@/components/aero/GlideSim";
import { MODEL_DISCLAIMER } from "@/lib/config";

export const Route = createFileRoute("/aprender")({
  head: () => ({
    meta: [
      { title: "Aerodinâmica do parapente — Parapente Lab" },
      {
        name: "description",
        content:
          "Aprenda como a asa do parapente gera sustentação: ângulo de ataque, estol, carga alar, vento relativo e planeio, com animações interativas.",
      },
      { property: "og:title", content: "Aerodinâmica do parapente — Parapente Lab" },
      {
        property: "og:description",
        content:
          "Animações interativas para entender sustentação, arrasto, estol, carga alar, vento relativo e planeio no parapente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AprenderPage,
});

const NAV = [
  { id: "componentes", titulo: "1. Componentes" },
  { id: "perfil", titulo: "2. Perfil" },
  { id: "angulo", titulo: "3. Ângulo de ataque" },
  { id: "sustentacao-arrasto", titulo: "4. Sustentação e arrasto" },
  { id: "estol", titulo: "5. Estol" },
  { id: "carga-alar", titulo: "6. Carga alar" },
  { id: "vento-relativo", titulo: "7. Vento relativo" },
  { id: "planeio", titulo: "8. Planeio" },
];

function AprenderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Aerodinâmica do parapente</h1>
      <p className="mt-2 text-muted-foreground">
        Oito aulas interativas para entender por que a asa voa. Mexa nos controles de cada
        animação — aprender é experimentar.
      </p>

      <nav aria-label="Aulas de aerodinâmica" className="mt-6 flex flex-wrap gap-2">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            {n.titulo}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-10">
        <Lesson
          id="componentes"
          number="1"
          title="Componentes do parapente"
          pergunta="Você sabe apontar onde ficam os freios, os tirantes e o centro de gravidade?"
          explicacao={
            <>
              <p>
                O parapente é uma asa flexível de tecido, sustentada pelo ar que entra pelas
                aberturas do bordo de ataque e pela pressão interna. As <strong>linhas</strong>{" "}
                ligam a vela aos <strong>tirantes</strong>, que se unem aos mosquetões da selete.
              </p>
              <p>
                Os <strong>freios</strong> puxam o bordo de fuga e servem para virar e controlar a
                velocidade. O piloto fica suspenso abaixo da asa, e o conjunto forma um pêndulo —
                por isso a estabilidade.
              </p>
            </>
          }
          resumo={[
            "A vela é uma asa de tecido inflada pelo ar",
            "Linhas e tirantes transmitem as forças até o piloto",
            "Freios controlam direção e velocidade",
            "O conjunto piloto + asa funciona como um pêndulo estável",
          ]}
          quiz={{
            question: "Para que servem os freios do parapente?",
            options: [
              "Frear a asa até parar no ar",
              "Virar e controlar a velocidade, puxando o bordo de fuga",
              "Inflar a vela na decolagem",
              "Acionar o paraquedas reserva",
            ],
            answer: 1,
            explanation:
              "Os freios deformam o bordo de fuga: puxar um lado vira a asa; puxar os dois reduz a velocidade (e aumenta o ângulo de ataque).",
          }}
        >
          <WingParts />
        </Lesson>

        <Lesson
          id="perfil"
          number="2"
          title="Laboratório do perfil"
          pergunta="O que acontece com o ar quando ele encontra a asa?"
          explicacao={
            <>
              <p>
                O corte transversal da asa — o <strong>perfil</strong> — é desenhado para que o ar
                que passa por cima percorra um caminho mais longo, criando uma região de menor
                pressão no dorso. O resultado é uma força para cima: a <strong>sustentação</strong>.
              </p>
              <p>
                Ao mesmo tempo, o ar resiste ao avanço — isso é o <strong>arrasto</strong>. Toda
                asa vive do equilíbrio entre essas duas forças.
              </p>
            </>
          }
          resumo={[
            "O perfil da asa cria diferença de pressão entre dorso e intradorso",
            "Sustentação aponta para cima; arrasto resiste ao avanço",
            "O formato do perfil é o coração da aerodinâmica",
          ]}
          nota={MODEL_DISCLAIMER}
        >
          <AirfoilLab />
        </Lesson>

        <Lesson
          id="angulo"
          number="3"
          title="Ângulo de ataque"
          pergunta="Por que 'puxar os freios' muda tanto o comportamento da asa?"
          explicacao={
            <>
              <p>
                O <strong>ângulo de ataque</strong> é o ângulo entre a corda da asa e o vento
                relativo. Ao aumentá-lo (por exemplo, puxando os freios), a sustentação cresce —
                até um limite.
              </p>
              <p>
                No laboratório acima, aumente o ângulo e observe: a sustentação sobe, mas o
                arrasto também. E passando de certo ponto… vem o estol (próxima aula).
              </p>
            </>
          }
          resumo ={[
            "Ângulo de ataque = ângulo entre a asa e o vento relativo",
            "Mais ângulo → mais sustentação e mais arrasto (até o limite)",
            "Os freios são o principal controle do ângulo de ataque",
          ]}
          nota={MODEL_DISCLAIMER}
        >
          <AirfoilLab />
        </Lesson>

        <Lesson
          id="sustentacao-arrasto"
          number="4"
          title="Sustentação e arrasto"
          pergunta="Por que voar mais rápido segura melhor a asa — mas também gasta mais energia?"
          explicacao={
            <>
              <p>
                A sustentação cresce com o <strong>quadrado da velocidade</strong>: dobrar a
                velocidade quadruplica a sustentação. O arrasto também cresce com a velocidade —
                e é o preço pago por voar rápido.
              </p>
              <p>
                No gráfico, mova o marcador de velocidade e mude o ângulo de ataque para ver as
                duas curvas se comportando juntas.
              </p>
            </>
          }
          resumo={[
            "Sustentação e arrasto crescem com o quadrado da velocidade",
            "Cada ângulo de ataque gera um par sustentação/arrasto diferente",
            "O piloto escolhe o ponto de voo conforme o objetivo: planar, subir ou penetrar o vento",
          ]}
          nota={MODEL_DISCLAIMER}
        >
          <LiftDragChart />
        </Lesson>

        <Lesson
          id="estol"
          number="5"
          title="Estol"
          pergunta="O que acontece quando o ar 'não consegue mais acompanhar' a asa?"
          explicacao={
            <>
              <p>
                Acima de certo ângulo de ataque, o fluxo de ar se <strong>descola</strong> do dorso
                da asa, formando turbulência. A sustentação despenca e o nariz da asa cai: é o{" "}
                <strong>estol</strong>.
              </p>
              <p>
                No parapente, o estol acontece ao puxar os freios além do limite, geralmente em
                velocidade baixa. A recuperação didática: soltar os freios para a asa voltar a
                voar.
              </p>
            </>
          }
          resumo={[
            "Estol = separação do fluxo por ângulo de ataque excessivo",
            "A sustentação cai bruscamente no estol",
            "Recuperação didática: soltar os freios para recuperar velocidade",
          ]}
          nota={MODEL_DISCLAIMER}
          quiz={{
            question: "O estol ocorre quando…",
            options: [
              "A velocidade está alta demais",
              "O ângulo de ataque passa do limite e o fluxo se descola",
              "O vento de cauda aumenta",
              "A asa voa em térmica forte",
            ],
            answer: 1,
            explanation:
              "O estol depende do ângulo de ataque, não da velocidade em si — mas velocidade baixa com freios puxados é o caminho mais comum até ele.",
          }}
        >
          <StallSim />
        </Lesson>

        <Lesson
          id="carga-alar"
          number="6"
          title="Peso e carga alar"
          pergunta="Dois pilotos voam a mesma asa, mas um pesa 30 kg a mais. O que muda?"
          explicacao={
            <>
              <p>
                A <strong>carga alar</strong> é o peso total dividido pela área da asa (kg/m²).
                Quanto maior a carga, maiores as velocidades de voo e mais rápidas as respostas —
                e também maior a velocidade de estol.
              </p>
              <p>
                Compare os dois pilotos na simulação e veja como o mais pesado voa mais rápido e
                desce mais.
              </p>
            </>
          }
          resumo={[
            "Carga alar = peso total ÷ área da asa",
            "Mais carga alar → mais velocidade e mais agilidade, mas estol em velocidade maior",
            "Cada asa tem uma faixa de peso certificada — voar dentro dela é questão de segurança",
          ]}
          nota="Valores ilustrativos. Este exemplo NÃO serve para escolher uma asa real — consulte a faixa de peso certificada pelo fabricante e seu instrutor."
        >
          <WingLoading />
        </Lesson>

        <Lesson
          id="vento-relativo"
          number="7"
          title="Vento relativo e vento real"
          pergunta="Se a asa voa a 38 km/h e o vento sopra a 15 km/h contra, quão rápido você avança no chão?"
          explicacao={
            <>
              <p>
                A asa só 'sente' o ar: a <strong>velocidade no ar</strong> é o que gera
                sustentação. Mas o ar inteiro pode estar se movendo sobre o solo — esse é o vento.
              </p>
              <p>
                A <strong>velocidade no solo</strong> é a soma vetorial das duas. Contra o vento
                você avança menos; a favor, mais. É por isso que aterrissagens são feitas contra o
                vento.
              </p>
            </>
          }
          resumo={[
            "Velocidade no ar é o que sustenta a asa",
            "Velocidade no solo = velocidade no ar + vento (soma vetorial)",
            "Contra o vento avança-se menos; com vento de cauda, mais",
          ]}
          nota={MODEL_DISCLAIMER}
        >
          <WindVectors />
        </Lesson>

        <Lesson
          id="planeio"
          number="8"
          title="Planeio"
          pergunta="Quanto mais longe a asa desliza para cada metro de descida, melhor — como medir isso?"
          explicacao={
            <>
              <p>
                A <strong>razão de planeio</strong> indica quantos metros a asa avança na
                horizontal para cada metro que perde de altura. Uma razão 9 significa 9 metros à
                frente por metro de descida.
              </p>
              <p>
                O vento muda tudo: com vento de frente, o planeio sobre o solo encolhe; com vento
                de cauda, estica. Teste na simulação.
              </p>
            </>
          }
          resumo={[
            "Razão de planeio = distância horizontal ÷ altura perdida",
            "Vento de frente reduz o alcance sobre o solo; vento de cauda aumenta",
            "Planeio define se você alcança a área de pouso — planeje sempre com margem",
          ]}
          nota={MODEL_DISCLAIMER}
        >
          <GlideSim />
        </Lesson>
      </div>
    </div>
  );
}

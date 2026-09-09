import { createFileRoute } from "@tanstack/react-router";
import { Lesson } from "@/components/Lesson";
import { ThermalSim } from "@/components/meteo/ThermalSim";
import { ThermalLifecycle } from "@/components/meteo/ThermalLifecycle";
import { MountainWind } from "@/components/meteo/MountainWind";
import { ValleyBreeze } from "@/components/meteo/ValleyBreeze";
import { Clouds } from "@/components/meteo/Clouds";

export const Route = createFileRoute("/meteorologia")({
  head: () => ({
    meta: [
      { title: "Meteorologia para parapente — Parapente Lab" },
      {
        name: "description",
        content:
          "Entenda térmicas, brisas de vale, vento e relevo e nuvens: animações interativas de meteorologia aplicada ao voo de parapente.",
      },
      { property: "og:title", content: "Meteorologia para parapente — Parapente Lab" },
      {
        property: "og:description",
        content:
          "Térmicas, ciclo de vida, vento e relevo, brisa de vale e nuvens explicados com animações interativas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MeteorologiaPage,
});

function MeteorologiaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Meteorologia do voo</h1>
      <p className="mt-2 text-muted-foreground">
        O parapente não tem motor: voar é ler o ar. Seis aulas para entender de onde vem a
        sustentação que a natureza oferece — e quando o céu está dizendo "hoje não".
      </p>

      <div className="mt-8 space-y-10">
        <Lesson
          id="meteo-fundamentos"
          number="1"
          title="Fundamentos do ar"
          pergunta="Por que o ar esquenta, sobe e forma vento?"
          explicacao={
            <>
              <p>
                O sol aquece o solo de forma desigual — rocha esquenta mais que floresta, que
                esquenta mais que água. O ar em contato com o solo quente esquenta, fica menos
                denso e <strong>sobe</strong>; o ar mais frio desce para ocupar o lugar. Esse
                movimento é a <strong>convecção</strong>.
              </p>
              <p>
                Na simulação da próxima aula você verá isso acontecendo. O essencial aqui: quase
                todo vento e toda térmica começam com diferenças de temperatura.
              </p>
            </>
          }
          resumo={[
            "O sol aquece o solo; o solo aquece o ar",
            "Ar quente é menos denso e sobe; ar frio desce",
            "Diferenças de temperatura criam ventos e térmicas",
          ]}
        >
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            👇 Aplique estes fundamentos na simulação da próxima aula: escolha o terreno, o
            horário e veja a térmica nascer.
          </p>
        </Lesson>

        <Lesson
          id="termica"
          number="2"
          title="Térmicas"
          pergunta="De onde vem a 'escada invisível' que leva o piloto para cima?"
          explicacao={
            <>
              <p>
                A <strong>térmica</strong> é uma coluna de ar quente ascendente. Ela nasce sobre
                superfícies que esquentam muito (rocha, solo seco, campos), ganha força no início
                da tarde e enfraquece com vento forte — que "picota" as bolhas antes que se
                organizem.
              </p>
              <p>
                Experimente na simulação: mude o terreno, o horário, o vento e a umidade, e veja
                quando a térmica fica forte a ponto de formar uma nuvem cumulus no topo.
              </p>
            </>
          }
          resumo={[
            "Térmica = ar quente subindo em coluna ou bolhas",
            "Terrenos secos e rochosos geram as melhores térmicas",
            "Vento forte desorganiza as térmicas; umidade ajuda a formar nuvens no topo",
          ]}
          quiz={{
            question: "Qual condição tende a gerar térmicas mais fortes?",
            options: [
              "Sobre a água, de manhã cedo",
              "Sobre rocha e solo seco, no início da tarde",
              "Com vento muito forte",
              "Em dias totalmente encobertos",
            ],
            answer: 1,
            explanation:
              "Superfícies secas e escuras aquecem mais, e o aquecimento máximo do solo ocorre no início da tarde — a combinação clássica das boas térmicas.",
          }}
        >
          <ThermalSim />
        </Lesson>

        <Lesson
          id="ciclo-termica"
          number="3"
          title="Ciclo de vida da térmica"
          pergunta="Uma térmica dura para sempre? O que acontece do nascimento ao fim?"
          explicacao={
            <>
              <p>
                Térmicas têm ciclo de vida: o solo aquece, a bolha de ar quente se acumula, se
                desprende, sobe, se organiza em coluna e pode formar um cumulus no topo. Depois,
                sem aquecimento, ela se dissolve.
              </p>
              <p>
                Use o Play e os controles de etapa para assistir o ciclo completo, na velocidade
                que preferir.
              </p>
            </>
          }
          resumo={[
            "A térmica nasce do aquecimento do solo e morre sem ele",
            "O cumulus marca o topo da térmica ativa",
            "A própria sombra da nuvem pode desligar a térmica que a criou",
          ]}
        >
          <ThermalLifecycle />
        </Lesson>

        <Lesson
          id="vento-relevo"
          number="4"
          title="Vento e relevo"
          pergunta="Por que pilotos falam tanto em 'barlavento' e 'sotavento'?"
          explicacao={
            <>
              <p>
                Quando o vento encontra uma montanha, é obrigado a subir pelo lado de{" "}
                <strong>barlavento</strong> — criando sustentação orográfica, usada para voar
                planando na encosta.
              </p>
              <p>
                Do outro lado, o <strong>sotavento</strong>, o ar desce e, com vento mais forte,
                forma o <strong>rotor</strong>: uma circulação turbulenta e perigosa. Aumente o
                vento na simulação e veja o rotor aparecer.
              </p>
            </>
          }
          resumo={[
            "Barlavento: vento sobe a encosta — sustentação orográfica",
            "Sotavento: ar desce e pode formar rotor turbulento",
            "Quanto mais forte o vento, mais perigoso o lado de sotavento",
          ]}
          quiz={{
            question: "O rotor se forma…",
            options: [
              "No topo da térmica",
              "No lado de barlavento, com vento fraco",
              "No lado de sotavento, com vento mais forte",
              "Somente à noite",
            ],
            answer: 2,
            explanation:
              "Com vento forte, o fluxo se separa na crista e recircula do lado de sotavento — região de forte turbulência que deve ser evitada.",
          }}
        >
          <MountainWind />
        </Lesson>

        <Lesson
          id="brisa"
          number="5"
          title="Brisa de vale e de montanha"
          pergunta="Por que o vento na rampa muda tanto entre de manhã cedo e o fim da tarde?"
          explicacao={
            <>
              <p>
                De dia, as encostas aquecem e o ar sobe pelo vale: é a <strong>brisa de vale</strong>{" "}
                (anabática), que muitas vezes torna a decolagem possível.
              </p>
              <p>
                À noite, as encostas esfriam e o ar frio, mais denso, desce: é a{" "}
                <strong>brisa de montanha</strong> (catabática). Alterne entre dia e noite na
                animação para comparar.
              </p>
            </>
          }
          resumo={[
            "Dia: encostas aquecem → brisa de vale sobe",
            "Noite: encostas esfriam → brisa de montanha desce",
            "A direção da brisa muda completamente as condições de decolagem e pouso",
          ]}
        >
          <ValleyBreeze />
        </Lesson>

        <Lesson
          id="nuvens"
          number="6"
          title="Nuvens"
          pergunta="O que cada tipo de nuvem está contando sobre o ar ao redor?"
          explicacao={
            <>
              <p>
                Nuvens são sinais visíveis de processos invisíveis: <strong>cumulus</strong> marca
                térmicas; <strong>stratus</strong> indica ar estável e fraco;{" "}
                <strong>cumulonimbus</strong> anuncia tempestade — perigo extremo.
              </p>
              <p>
                Clique em cada nuvem no quadro para ver como ela se forma, o que observar e quais
                riscos traz.
              </p>
            </>
          }
          resumo={[
            "Cumulus: marca térmicas; atenção se crescer rápido demais",
            "Stratus: ar estável, voo fraco, cuidado com teto baixo",
            "Cumulonimbus: tempestade — não voar e, se estiver no ar, pousar em local seguro",
          ]}
          quiz={{
            question: "Uma nuvem escura crescendo verticalmente com topo em bigorna indica…",
            options: [
              "Boa térmica para subir rápido",
              "Cumulonimbus: tempestade — afastar-se e pousar",
              "Stratus: dia fraco de voo",
              "Vento de cauda em altitude",
            ],
            answer: 1,
            explanation:
              "Cumulonimbus concentra correntes violentas, raios e granizo. A única decisão segura é manter distância e pousar o quanto antes.",
          }}
        >
          <Clouds />
        </Lesson>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Lesson } from "@/components/Lesson";
import { LessonNav } from "@/components/LessonNav";
import { Checklist } from "@/components/safety/Checklist";
import { Scenarios } from "@/components/safety/Scenarios";
import { Disclaimer } from "@/components/Disclaimer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/seguranca")({
  head: () =>
    seo({
      titulo: "Segurança no parapente",
      descricao:
        "Checklist pré-voo, fatores humanos e cenários de decisão: aprenda a pensar segurança antes, durante e depois do voo de parapente.",
      path: "/seguranca",
    }),
  component: SegurancaPage,
});

const NAV = [
  { id: "antes-voo", titulo: "1. Antes do voo" },
  { id: "durante-voo", titulo: "2. Durante o voo" },
  { id: "depois-voo", titulo: "3. Depois do voo" },
  { id: "checklist", titulo: "4. Checklist" },
  { id: "cenarios", titulo: "5. Cenários" },
];

function SegurancaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Segurança em primeiro lugar</h1>
      <p className="mt-2 text-muted-foreground">
        A maioria dos acidentes envolve decisões, não equipamentos. Estas aulas treinam o julgamento
        — antes, durante e depois do voo.
      </p>

      <div className="mt-6">
        <Disclaimer compact />
      </div>

      <LessonNav label="Aulas de segurança" itens={NAV} />

      <div className="mt-8 space-y-10">
        <Lesson
          id="antes-voo"
          number="1"
          title="Antes do voo"
          pergunta="Quais decisões de segurança acontecem ainda no chão?"
          explicacao={
            <>
              <p>
                A segurança começa em casa: estudar a previsão do tempo, conhecer o local, revisar o
                equipamento e definir um plano de voo com limites claros ("se o vento passar de X,
                eu não decolo").
              </p>
              <p>
                Na rampa: observe o vento por pelo menos alguns minutos, veja os outros pilotos,
                confira o checklist e pergunte a si mesmo se você está realmente bem para voar.
                Decidir <strong>não voar</strong> é sempre uma decisão válida.
              </p>
            </>
          }
          resumo={[
            "Planeje no chão: previsão, local, equipamento, limites pessoais",
            "Observe o vento antes de se comprometer",
            "Não voar é sempre uma opção legítima",
          ]}
        >
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            📝 Aplique agora: complete o{" "}
            <a href="#checklist" className="font-semibold text-primary underline">
              checklist interativo da aula 4
            </a>{" "}
            desta página.
          </p>
        </Lesson>

        <Lesson
          id="durante-voo"
          number="2"
          title="Durante o voo"
          pergunta="O que observar no ar para perceber problemas cedo?"
          explicacao={
            <>
              <p>
                No ar, mantenha atenção constante: mudanças de vento, nuvens crescendo rápido,
                outros pilotos e sempre — sempre — uma <strong>área de pouso ao alcance</strong>.
              </p>
              <p>
                Regra prática: se algo mudou desde o planejamento (vento, nuvens, seu próprio
                estado), considere pousar cedo. Chegar cedo demais ao pouso nunca foi motivo de
                acidente; tarde demais, sim.
              </p>
            </>
          }
          resumo={[
            "Monitore vento, nuvens e outros pilotos continuamente",
            "Mantenha sempre uma alternativa de pouso ao alcance",
            "Condição mudou? Pouse cedo, com margem",
          ]}
        >
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            🎮 Treine a tomada de decisão nos{" "}
            <a href="#cenarios" className="font-semibold text-primary underline">
              cenários da aula 5
            </a>{" "}
            e no simulador de voo.
          </p>
        </Lesson>

        <Lesson
          id="depois-voo"
          number="3"
          title="Depois do voo"
          pergunta="O voo terminou quando você pousa?"
          explicacao={
            <>
              <p>
                Não: o voo termina depois da revisão. Dobre a vela verificando danos, guarde o
                equipamento com cuidado e faça um pequeno <strong>debriefing</strong>: o que foi
                bem? O que eu faria diferente?
              </p>
              <p>
                Registrar os voos e aprender com os erros — seus e dos outros — é o que transforma
                experiência em segurança duradoura.
              </p>
            </>
          }
          resumo={[
            "Inspecione o equipamento ao guardar",
            "Faça um debriefing mental de cada voo",
            "Aprender com erros pequenos evita erros grandes",
          ]}
        >
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            💡 Dica: anote três aprendizados depois de cada sessão de estudo neste app.
          </p>
        </Lesson>

        <Lesson
          id="checklist"
          number="4"
          title="Checklist pré-voo"
          pergunta="Você consegue verificar tudo, sempre, sem esquecer nada?"
          explicacao={
            <>
              <p>
                Memória falha — principalmente sob pressa ou pressão social. O checklist existe para
                isso: uma rotina fixa que transforma verificação em hábito.
              </p>
              <p>
                Complete o checklist interativo abaixo. Seu progresso fica salvo neste navegador;
                use "Recomeçar" a cada nova sessão.
              </p>
            </>
          }
          resumo={[
            "Checklist transforma verificação em hábito",
            "Cubra equipamento, clima, local, plano e condição pessoal",
            "No voo real, siga o checklist do seu clube e do seu instrutor",
          ]}
        >
          <Checklist />
        </Lesson>

        <Lesson
          id="cenarios"
          number="5"
          title="Cenários de decisão"
          pergunta="O que você faria? Treine decisões difíceis aqui, sem risco."
          explicacao={
            <>
              <p>
                Boas decisões se treinam. Nos cenários abaixo, escolha sua resposta antes de ver a
                explicação — e perceba como a pressa e a pressão social tentam empurrar escolhas
                ruins.
              </p>
            </>
          }
          resumo={[
            "Decisões seguras se treinam antes de serem necessárias",
            "Pressa e pressão social são armadilhas clássicas",
            "Na dúvida, a escolha mais conservadora costuma ser a certa",
          ]}
          quiz={{
            question:
              "O vento aumentou além do previsto enquanto você preparava o equipamento. Você…",
            options: [
              "Decola rápido antes que piore",
              "Espera, reavalia e, se continuar forte, não voa",
              "Pede ajuda para segurar a vela e decola",
              "Voa só um pouquinho",
            ],
            answer: 1,
            explanation:
              "Condição diferente do planejado = reavaliar. Não voar é sempre uma decisão válida.",
          }}
        >
          <Scenarios />
        </Lesson>
      </div>
    </div>
  );
}

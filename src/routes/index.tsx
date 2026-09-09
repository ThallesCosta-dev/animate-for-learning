import { createFileRoute, Link } from "@tanstack/react-router";
import { APP_NAME, APP_SUBTITLE } from "@/lib/config";
import { Disclaimer } from "@/components/Disclaimer";
import { AREA_LABELS, LESSONS, type AreaKey } from "@/lib/lessons";
import heroImg from "@/assets/parapente-decolagem.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${APP_NAME} — Aprenda aerodinâmica, meteorologia e segurança no parapente` },
      {
        name: "description",
        content:
          "Aplicativo educacional interativo sobre parapente: aerodinâmica, meteorologia, segurança, simulador de voo e quiz. Conteúdo didático, não substitui instrutor.",
      },
      { property: "og:title", content: `${APP_NAME} — Aprenda a voar` },
      {
        property: "og:description",
        content:
          "Aprenda parapente de forma interativa: animações de aerodinâmica, meteorologia, segurança, simulador de voo e quiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const DESTAQUES = [
  {
    para: "/aprender",
    titulo: "🪂 Aerodinâmica",
    texto: "Veja a sustentação nascer: ângulo de ataque, estol, carga alar e vento relativo em animações interativas.",
  },
  {
    para: "/meteorologia",
    titulo: "🌤️ Meteorologia",
    texto: "Térmicas, brisas de vale, vento e relevo e nuvens — entenda o que o céu está dizendo.",
  },
  {
    para: "/seguranca",
    titulo: "🦺 Segurança",
    texto: "Checklist pré-voo e cenários de decisão: treine o julgamento antes de voar.",
  },
  {
    para: "/simulador",
    titulo: "🎮 Simulador de voo",
    texto: "Pilote um parapente virtual: explore térmicas, controle o ângulo e pouse suave.",
  },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-skyblue/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Aprenda antes de voar
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight md:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mt-2 text-lg font-medium text-foreground/80">{APP_SUBTITLE}</p>
            <p className="mt-4 max-w-md text-foreground/80">
              Entenda por que a asa voa, como ler o céu e como tomar decisões seguras — com
              animações, simulações e um quiz para testar seu conhecimento.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/aprender"
                className="rounded-xl bg-primary px-6 py-3 font-display font-bold text-primary-foreground shadow hover:opacity-90"
              >
                Começar a aprender
              </Link>
              <Link
                to="/simulador"
                className="rounded-xl border border-primary bg-card px-6 py-3 font-display font-bold text-primary hover:bg-accent"
              >
                Ir para o simulador
              </Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-border shadow-lg">
            <img
              src={heroImg.url}
              alt="Piloto de parapente decolando de uma encosta com a vela inflada acima"
              className="h-full max-h-[420px] w-full object-cover"
              loading="eager"
            />
            <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
              Foto real de decolagem de parapente (Wikimedia Commons, uso livre).
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Aviso */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Disclaimer />
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="font-display text-2xl font-bold">O que você vai aprender</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESTAQUES.map((d) => (
            <Link
              key={d.para}
              to={d.para}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold group-hover:text-primary">{d.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trilha de aulas */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-2xl font-bold">Trilha de aprendizado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {LESSONS.length} aulas interativas em 3 áreas. Seu progresso fica salvo neste
          navegador.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {(Object.keys(AREA_LABELS) as AreaKey[]).map((areaId) => {
            const aulas = LESSONS.filter((l) => l.area === areaId);
            return (
              <div key={areaId} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-bold text-primary">{AREA_LABELS[areaId]}</h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {aulas.map((a) => (
                    <li key={a.id} className="flex gap-2">
                      <span aria-hidden className="text-forest">•</span>
                      {a.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

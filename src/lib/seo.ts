import { APP_NAME, SITE_URL } from "@/lib/config";

interface SeoOpcoes {
  titulo: string;
  descricao: string;
  /** Caminho da rota, começando com "/". */
  path: string;
  /** Caminho da imagem de compartilhamento (absoluto no site). */
  imagem?: string;
}

const OG_IMAGE = "/og-parapente.jpg";

/** Gera meta tags e canonical consistentes para uma rota. */
export function seo({ titulo, descricao, path, imagem = OG_IMAGE }: SeoOpcoes) {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const imagemUrl = `${SITE_URL}${imagem}`;
  const tituloCompleto = titulo.includes(APP_NAME) ? titulo : `${titulo} — ${APP_NAME}`;
  return {
    meta: [
      { title: tituloCompleto },
      { name: "description", content: descricao },
      { property: "og:title", content: tituloCompleto },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: imagemUrl },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: tituloCompleto },
      { name: "twitter:description", content: descricao },
      { name: "twitter:image", content: imagemUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

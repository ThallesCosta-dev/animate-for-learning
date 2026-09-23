// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Phaser só roda no navegador (import() dentro de useEffect). Fora do ambiente
// "client" ele é trocado por um stub vazio para não inflar o bundle SSR em 7 MB.
const phaserStub = fileURLToPath(new URL("./src/lib/phaser-stub.ts", import.meta.url));
const phaserSomenteNoCliente: Plugin = {
  name: "parapente-lab:phaser-somente-no-cliente",
  enforce: "pre",
  resolveId(id, _importer, options) {
    if (id !== "phaser") return null;
    const ambiente = this.environment?.name;
    const servidor = options?.ssr === true || (ambiente !== undefined && ambiente !== "client");
    return servidor ? phaserStub : null;
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [phaserSomenteNoCliente],
});

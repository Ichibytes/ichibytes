/// <reference types='vitest' />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  const port = parseInt(env.VITE_PORT || '4200', 10);
  const host = env.VITE_HOST || 'localhost';

  return {
    root: import.meta.dirname,
    cacheDir: "../../node_modules/.vite/apps/admin",
    server: {
      port,
      host,
    },
    preview: {
      port,
      host,
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
    // Uncomment this if you are using workers.
    // worker: {
    //   plugins: () => [ nxViteTsPaths() ],
    // },
    build: {
      outDir: "../../dist/apps/admin",
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});

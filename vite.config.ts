import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { execSync } from "node:child_process";

// ビルドメタ（画面フッターに出してトラブルシュート性向上）
const COMMIT_SHA = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "dev";
  }
})();
const BUILD_TIME = new Date().toISOString();

export default defineConfig({
  // GH Pages サブパス時は BASE_PATH=/sonae-quest/ を渡す。
  // 既定は相対パス（Vercel/Cloudflare/zip配布/Pagesルートでも動作）
  base: process.env.BASE_PATH ?? "./",
  define: {
    __BUILD_COMMIT__: JSON.stringify(COMMIT_SHA),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "そなえクエスト",
        short_name: "そなえクエスト",
        description:
          "平常時に家族・子ども・地域・職場の防災行動が自然に増えるPWA",
        theme_color: "#0f766e",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "./",
        start_url: "./",
        lang: "ja",
        icons: [
          {
            src: "icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "sonae-html-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ request }) =>
              ["style", "script", "worker", "image", "font"].includes(
                request.destination,
              ),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "sonae-assets-cache",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2019",
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
const VERSION = "2.4.2";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "offline.html",
        "ShadowChatLogo.png"
      ],

      manifest: {
        id: `/shadowchat-${VERSION}`,
        start_url: `/?v=${VERSION}`,
        name: "ShadowChat",
        short_name: "ShadowChat",
        description: "Real-time chat app",
        start_url: "/",
        display: "standalone",
        background_color: "#1e1e1e",
        theme_color: "#1e1e1e",

        icons: [
          {
            src: "/ShadowChatLogo.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/ShadowChatLogo.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },

      workbox: {
        cacheId: `shadowchat-${VERSION}`,
        navigateFallback: "/offline.html",

        navigateFallbackDenylist: [
          /^\/api/,
          /^\/login$/,
          /\/assets\//
        ]
      }
    })
  ]
});

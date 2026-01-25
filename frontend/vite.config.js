import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["logo.png"],
    manifest: {
      name: "Chat App",
      short_name: "Chat",
      description: "Real-time MERN chat app",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#0d6efd",
      icons: [
        {
          src: "ShadowChatLogo.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "ShadowChatLogo.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  })
  ],
})

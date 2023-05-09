import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
    registerType: "autoUpdate",
      manifest: {
        name: "Open Video",
        display: "fullscreen",
        orientation: "natural",
        short_name: "Open Video",
        description: "Open Video using the browser.",
        theme_color: "#ffffff",
        launch_handler: {
          client_mode: "focus-existing",
        },
        categories: ["entertainment", "video"],
        file_handlers: [
          {
            action: "/",
            accept: {
              "video/mp4": [".mp4"],
              "video/webm": [".webm"],
              "video/ogg": [".ogv"],
              "video/x-msvideo": [".avi"],
              "video/x-matroska": [".mkv"],
              "video/x-m4v": [".m4v"],
              "video/x-mpeg": [".mpeg"],
              "video/x-mpeg2": [".mpg"],
            },
          },
        ],
        icons: [
          {
            src: "logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
};

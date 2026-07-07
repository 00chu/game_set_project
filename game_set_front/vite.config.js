import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages용 빌드 / AWS용 빌드
  base: mode === "github" ? "/game_set_project/" : "/",
}));

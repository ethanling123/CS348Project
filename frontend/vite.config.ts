import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": "${API_BASE_URL}",
            "/accounts": "${API_BASE_URL}",
        },
    },
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dns from "dns";

// const url = fullurl

let cPort = 24600;

export default ({ mode }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

    return defineConfig({
        plugins: [svgr(), react()],
        server: {
            port: cPort,
        },
        build: { minify: "es2020" },
    });
};

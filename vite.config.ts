import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(projectDir, "local-data.json");

const readBody = async (req: import("node:http").IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const json = (res: import("node:http").ServerResponse, status: number, value: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(value));
};

const localDataApi = (): Plugin => ({
  name: "me24x7-local-data-api",
  configureServer(server) {
    server.middlewares.use("/api/data", async (req, res) => {
      if (req.method === "GET") {
        try {
          const data = await fs.readFile(dataFile, "utf8");
          json(res, 200, JSON.parse(data));
        } catch {
          json(res, 404, { error: "No local shared data yet" });
        }
        return;
      }

      if (req.method === "PUT") {
        try {
          const body = await readBody(req);
          const parsed = JSON.parse(body);
          if (!Array.isArray(parsed.jobs) || !Array.isArray(parsed.inventory)) {
            json(res, 400, { error: "Invalid app data" });
            return;
          }
          await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2), "utf8");
          json(res, 200, { ok: true, updatedAt: new Date().toISOString() });
        } catch {
          json(res, 400, { error: "Could not save local data" });
        }
        return;
      }

      json(res, 405, { error: "Method not allowed" });
    });
  },
});

export default defineConfig({
  base: "./",
  plugins: [react(), localDataApi()],
});

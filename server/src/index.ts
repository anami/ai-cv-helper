import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";
import { PORT, UPLOAD_FOLDER, MAX_FILE_SIZE, CLIENT_DIST_PATH } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { uploadRoutes } from "./routes/upload.js";
import { chatRoutes } from "./routes/chat.js";

const app = Fastify({ logger: true });

// Ensure uploads directory exists
fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

// Plugins
await app.register(cors);
await app.register(multipart, { limits: { fileSize: MAX_FILE_SIZE } });

// API routes
await app.register(healthRoutes);
await app.register(uploadRoutes);
await app.register(chatRoutes);

// Serve client build in production
if (fs.existsSync(CLIENT_DIST_PATH)) {
  await app.register(fastifyStatic, {
    root: CLIENT_DIST_PATH,
    wildcard: false,
  });

  app.get("*", (_request, reply) => {
    return reply.sendFile("index.html");
  });
}

// Start
app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("=".repeat(60));
  console.log("CV Assistant Starting...");
  console.log("=".repeat(60));
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log("Make sure Ollama is running before using the app!");
  console.log("=".repeat(60));
});

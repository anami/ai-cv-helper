import type { FastifyInstance } from "fastify";
import { checkStatus } from "../services/ollama.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/api/check-ollama", async (_request, reply) => {
    const result = await checkStatus();
    if (result.status !== "running") {
      return reply.code(503).send(result);
    }
    return result;
  });
}

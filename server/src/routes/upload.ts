import type { FastifyInstance } from "fastify";
import { ALLOWED_EXTENSIONS } from "../config.js";
import { extractText } from "../services/fileParser.js";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/api/upload-cv", async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({ error: "No file provided" });
    }

    const filename = file.filename;
    if (!filename) {
      return reply.code(400).send({ error: "No file selected" });
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return reply
        .code(400)
        .send({ error: "Invalid file type. Please upload PDF, DOCX, or TXT" });
    }

    const buffer = await file.toBuffer();
    const text = await extractText(buffer, ext);

    return { text, filename };
  });
}

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = 8080;
export const OLLAMA_BASE_URL = "http://localhost:11434";
export const OLLAMA_TAGS_URL = `${OLLAMA_BASE_URL}/api/tags`;
export const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/api/generate`;

export const UPLOAD_FOLDER = path.resolve(__dirname, "../../uploads");
export const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
export const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "txt"]);

export const PROMPT_TEMPLATE_PATH = path.resolve(
  __dirname,
  "../../prompt_template.md"
);
export const PROMPT_INSTRUCTIONS_PATH = path.resolve(
  __dirname,
  "../../prompt_instructions.md"
);

export const CLIENT_DIST_PATH = path.resolve(__dirname, "../../client/dist");

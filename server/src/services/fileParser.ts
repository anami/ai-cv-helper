import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(
  buffer: Buffer,
  extension: string
): Promise<string> {
  switch (extension) {
    case "pdf": {
      const result = await pdfParse(buffer);
      return result.text;
    }
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    case "txt":
      return buffer.toString("utf-8");
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

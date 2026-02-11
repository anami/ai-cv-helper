import fs from "node:fs";
import { PROMPT_TEMPLATE_PATH, PROMPT_INSTRUCTIONS_PATH } from "../config.js";

interface JobContext {
  company?: string;
  role?: string;
  requirements?: string;
  freeText?: string;
}

function loadTemplate(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function parseInstructions(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let currentSection: string | null = null;
  let currentLines: string[] = [];

  for (const line of content.split("\n")) {
    if (line.startsWith("## When ")) {
      if (currentSection) {
        sections[currentSection] = currentLines.join("\n").trim();
      }
      currentSection = line.slice(3).trim();
      currentLines = [];
    } else if (currentSection && !line.startsWith("# ")) {
      currentLines.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentLines.join("\n").trim();
  }

  return sections;
}

function buildFallback(
  cvText: string,
  jobContext: JobContext,
  userMessage: string
): string {
  const parts = ["You are a professional CV and career assistant.", ""];

  if (cvText) {
    parts.push(`User's CV:\n${cvText}\n`);
  }

  if (jobContext) {
    parts.push("Job Context:");
    for (const [key, value] of Object.entries(jobContext)) {
      if (value) parts.push(`- ${key}: ${value}`);
    }
    parts.push("");
  }

  parts.push("Provide helpful, professional advice.");

  if (userMessage) {
    parts.push(`\nUser Query: ${userMessage}`);
  }

  return parts.join("\n");
}

export function buildSystemPrompt(
  cvText: string,
  jobContext: JobContext,
  userMessage: string
): string {
  const template = loadTemplate(PROMPT_TEMPLATE_PATH);
  const instructionsMd = loadTemplate(PROMPT_INSTRUCTIONS_PATH);

  if (!template || !instructionsMd) {
    return buildFallback(cvText, jobContext, userMessage);
  }

  const instructions = parseInstructions(instructionsMd);

  // Build CV section
  let cvSection = "";
  if (cvText) {
    cvSection = `## User's CV\n\n${cvText}`;
  }

  // Build job context section
  let jobSection = "";
  const hasJobContext =
    jobContext &&
    (jobContext.company ||
      jobContext.role ||
      jobContext.requirements ||
      jobContext.freeText);

  if (hasJobContext) {
    const jobParts = ["## Job Application Context\n"];
    if (jobContext.company) jobParts.push(`**Company:** ${jobContext.company}`);
    if (jobContext.role) jobParts.push(`**Role:** ${jobContext.role}`);
    if (jobContext.requirements)
      jobParts.push(`**Requirements:** ${jobContext.requirements}`);
    if (jobContext.freeText)
      jobParts.push(`**Additional Context:** ${jobContext.freeText}`);
    jobSection = jobParts.join("\n");
  }

  // Select appropriate instructions
  let selectedInstructions: string;
  if (cvText && hasJobContext) {
    selectedInstructions =
      instructions["CV and Job Context are both provided"] ?? "";
  } else if (cvText) {
    selectedInstructions = instructions["only CV is provided"] ?? "";
  } else if (hasJobContext) {
    selectedInstructions = instructions["only Job Context is provided"] ?? "";
  } else {
    selectedInstructions = instructions["no context is provided"] ?? "";
  }

  // Fill template
  let prompt = template.replace("{{CV_SECTION}}", cvSection);
  prompt = prompt.replace("{{JOB_CONTEXT_SECTION}}", jobSection);
  prompt = prompt.replace("{{INSTRUCTIONS}}", selectedInstructions);
  prompt = prompt.replace("{{USER_MESSAGE}}", userMessage);

  return prompt;
}

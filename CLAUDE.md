# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Assistant is a locally-running web application that uses Ollama for AI-powered CV improvement, cover letter writing, and job application assistance. All processing happens locally with no external data transmission.

**Stack:** Fastify (TypeScript) backend + Vite/React (TypeScript) frontend, managed as npm workspaces.

## Commands

```bash
# Install dependencies
npm install

# Development (Vite on :5173 + Fastify on :8080)
npm run dev

# Build client for production
npm run build -w client

# Production (serves client from Fastify on :8080)
npm start

# Or use the startup script
./start.sh
```

**Prerequisites:** Ollama must be running (`ollama serve`) with at least one model pulled (e.g., `ollama pull mistral`).

## Architecture

### Backend (`server/src/`)
- Fastify server on port 8080
- `index.ts` — Bootstrap, registers plugins (cors, multipart, static) and routes
- `config.ts` — Constants (URLs, paths, limits)
- `routes/health.ts` — `GET /api/check-ollama` — Checks Ollama status and available models
- `routes/upload.ts` — `POST /api/upload-cv` — File uploads (PDF, DOCX, TXT) with text extraction
- `routes/chat.ts` — `POST /api/chat` — Streams responses from Ollama via SSE (reply.hijack + raw.write)
- `services/ollama.ts` — Ollama API client (check status, stream generate)
- `services/fileParser.ts` — PDF (`pdf-parse`), DOCX (`mammoth`), TXT extraction
- `services/promptBuilder.ts` — Template loading + prompt assembly

### Frontend (`client/src/`)
- Vite + React + TypeScript + Tailwind v4
- `App.tsx` — Layout + state orchestration
- `hooks/` — `useOllamaStatus`, `useChat` (SSE streaming + abort), `useFileUpload`, `useResizable`
- `components/` — Header, CVPanel, ChatPanel, ChatMessage, JobPanel, TypingIndicator, DragHandle
- `services/api.ts` — Fetch wrappers with relative URLs (`/api/...`)
- Vite dev server proxies `/api` to `localhost:8080`

### Prompt System
Prompts are externalized to markdown files for easy editing without code changes:

- **`prompt_template.md`** — Main prompt structure with placeholders:
  - `{{CV_SECTION}}` — User's CV content
  - `{{JOB_CONTEXT_SECTION}}` — Job details (company, role, requirements)
  - `{{INSTRUCTIONS}}` — Context-specific instructions
  - `{{USER_MESSAGE}}` — User's query

- **`prompt_instructions.md`** — Instruction sets parsed by section headers:
  - `## When CV and Job Context are both provided` — Full personalized assistance
  - `## When only CV is provided` — Asks user to also provide job context
  - `## When only Job Context is provided` — Asks user to also upload CV
  - `## When no context is provided` — Asks user to provide both CV and job context

The assistant requires **both** a CV and job context before providing any assistance. The `buildSystemPrompt()` function in `server/src/services/promptBuilder.ts` loads these templates, parses instruction sections, and assembles the final prompt. A fallback function exists if templates are missing.

## Key Configuration

- `OLLAMA_GENERATE_URL` — Ollama generate endpoint (default: `http://localhost:11434/api/generate`)
- `UPLOAD_FOLDER` — Temporary storage for uploads (default: `uploads/`)
- `MAX_FILE_SIZE` — Max upload size (default: 16MB)

## Notable UI Features

- **Resizable side panels** — CV and Job Context panels can be dragged to resize (200px–600px)
- **Stop button** — Appears during generation, aborts the SSE stream and keeps partial output
- **Ollama warning** — Amber warning message posted to chat when Ollama is unreachable on startup
- **GitHub Pages** — Static landing page in `docs/index.html`

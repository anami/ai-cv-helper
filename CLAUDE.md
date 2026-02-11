# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Assistant is a locally-running Flask web application that uses Ollama for AI-powered CV improvement, cover letter writing, and job application assistance. All processing happens locally with no external data transmission.

## Commands

```bash
# Install dependencies
pip3 install -r requirements.txt

# Run the application
python3 app.py

# Or use the startup script
./start.sh
```

The server runs at `http://localhost:8080`.

**Prerequisites:** Ollama must be running (`ollama serve`) with at least one model pulled (e.g., `ollama pull mistral`).

## Architecture

### Backend (`app.py`)
- Flask server on port 8080
- `/api/check-ollama` - Checks Ollama status and available models via `localhost:11434/api/tags`
- `/api/upload-cv` - Handles file uploads (PDF, DOCX, TXT) and extracts text using PyPDF2 and python-docx
- `/api/chat` - Streams responses from Ollama using Server-Sent Events (SSE)

### Frontend (`index.html`)
- Single-file React application (uses CDN-loaded React and Babel)
- Communicates with Flask backend on `localhost:8080`

### Prompt System
Prompts are externalized to markdown files for easy editing without code changes:

- **`prompt_template.md`** - Main prompt structure with placeholders:
  - `{{CV_SECTION}}` - User's CV content
  - `{{JOB_CONTEXT_SECTION}}` - Job details (company, role, requirements)
  - `{{INSTRUCTIONS}}` - Context-specific instructions
  - `{{USER_MESSAGE}}` - User's query

- **`prompt_instructions.md`** - Instruction sets parsed by section headers:
  - `## When CV and Job Context are both provided`
  - `## When only CV is provided`
  - `## When only Job Context is provided`
  - `## When no context is provided`

The `build_system_prompt()` function in `app.py` loads these templates, parses instruction sections, and assembles the final prompt. A fallback function exists if templates are missing.

## Key Configuration

- `OLLAMA_API_URL` - Ollama generate endpoint (default: `http://localhost:11434/api/generate`)
- `UPLOAD_FOLDER` - Temporary storage for uploads (default: `uploads/`)
- `MAX_CONTENT_LENGTH` - Max upload size (default: 16MB)

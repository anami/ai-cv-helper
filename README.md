# CV Assistant - AI-Powered Career Helper

An intelligent, locally-running web application that helps you improve your CV, write cover letters, and answer job application questions using AI powered by Ollama.

## Features

✨ **Three Main Functions:**
- **CV Improvement**: Get AI-powered suggestions to enhance your CV
- **Cover Letter Writing**: Generate tailored cover letters for specific roles
- **Application Questions**: Get help answering common application questions

🔒 **Privacy-First:**
- Runs 100% locally on your machine
- No data sent to external servers
- Your CV and job applications stay private

💡 **Smart Input Options:**
- Upload CV files (PDF, DOCX, or TXT)
- Paste CV text directly
- Structured job context (company, role, requirements)
- Free-text job descriptions

## Prerequisites

Before you start, make sure you have:

1. **Node.js 20 or higher** installed
   - Windows/macOS/Linux: Download from [nodejs.org](https://nodejs.org/)
   - macOS: `brew install node`
   - Linux: See [NodeSource](https://github.com/nodesource/distributions)

2. **Ollama** installed and running
   - Download from [ollama.com](https://ollama.com)
   - After installation, pull a model: `ollama pull llama3.2` or `ollama pull mistral`
   - Start Ollama: `ollama serve` (or it may start automatically)

## Quick Start

### Using the startup script

1. Open Terminal in this folder
2. Run: `./start.sh`
3. Open your browser to `http://localhost:5173`

### Manual Start

```bash
# Install dependencies
npm install

# Start development servers (Vite on :5173 + Fastify on :8080)
npm run dev

# Or for production
npm run build && npm start
```

In development, open `http://localhost:5173`. In production, open `http://localhost:8080`.

## How to Use

### Step 1: Add Your CV
- Click "Upload CV" to upload a PDF, DOCX, or TXT file
- OR paste your CV text directly into the left panel

### Step 2: Add Job Context
Choose between two input modes:

**Structured Mode:**
- Company: The company you're applying to
- Role: The position title
- Requirements: Paste the job requirements

**Free Text Mode:**
- Paste the entire job description or any relevant context

### Step 3: Chat with the AI
Use the chat interface to ask questions like:
- "Help me improve my CV for this role"
- "Write a cover letter for this position"
- "How should I answer: Why do you want to work here?"
- "What are my key strengths based on my CV?"

## Recommended Ollama Models

For best results, use one of these models:

- **llama3.2** (3B) - Fast and efficient
- **llama3.1** (8B) - Good balance of speed and quality
- **mistral** (7B) - Excellent for professional writing
- **llama3.1:70b** - Best quality (requires more RAM)

Pull a model with:
```bash
ollama pull llama3.2
```

## Troubleshooting

### "Ollama is not running"
- Make sure Ollama is installed
- Start Ollama with `ollama serve` in a terminal
- Check if Ollama is running at `http://localhost:11434`

### "No models available"
- Pull a model: `ollama pull llama3.2`
- Verify with: `ollama list`

### Port 8080 already in use
- Edit `server/src/config.ts` and change the `PORT` constant

## File Structure

```
ai-cv-helper/
├── package.json              # npm workspaces root
├── tsconfig.base.json        # Shared TypeScript config
├── prompt_template.md        # Prompt template
├── prompt_instructions.md    # Prompt instruction sets
├── start.sh                  # Startup script
├── server/                   # Fastify backend (TypeScript)
│   ├── package.json
│   └── src/
│       ├── index.ts          # Server bootstrap
│       ├── config.ts         # Constants
│       ├── routes/           # API route handlers
│       └── services/         # Business logic
├── client/                   # Vite + React frontend (TypeScript)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx           # Main app component
│       ├── components/       # UI components
│       ├── hooks/            # React hooks
│       └── services/         # API client
└── README.md                 # This file
```

## System Requirements

- **RAM**: 8GB minimum (16GB recommended for larger models)
- **Storage**: 5-10GB for Ollama models
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Privacy & Security

- All processing happens locally on your machine
- No internet connection required (except for initial setup)
- Your CV and job applications never leave your computer
- No data is stored or logged by the application

## Tips for Best Results

1. **Be specific in your questions**: Instead of "improve my CV", try "improve the work experience section of my CV to highlight leadership skills"

2. **Provide context**: The more details you provide about the role and company, the better the AI can tailor its responses

3. **Iterate**: Start with general improvements, then ask follow-up questions to refine specific sections

4. **Use quick prompts**: Click the suggested prompts below the chat for common tasks

## License

This project is provided as-is for personal use. Feel free to modify and adapt it to your needs.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify Ollama is running and has models available
4. Check the terminal output for error messages

---

Built with ❤️ using Fastify, React, and Ollama

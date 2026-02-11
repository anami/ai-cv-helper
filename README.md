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

1. **Python 3.8 or higher** installed
   - Windows: Download from [python.org](https://www.python.org/downloads/)
   - macOS: `brew install python3` or download from python.org
   - Linux: Usually pre-installed, or `sudo apt install python3 python3-pip`

2. **Ollama** installed and running
   - Download from [ollama.com](https://ollama.com)
   - After installation, pull a model: `ollama pull llama3.2` or `ollama pull mistral`
   - Start Ollama: `ollama serve` (or it may start automatically)

## Quick Start

### Windows

1. Double-click `start.bat`
2. The script will install dependencies and start the server
3. Open your browser to `http://localhost:5000`

### macOS / Linux

1. Open Terminal in this folder
2. Run: `./start.sh`
3. Open your browser to `http://localhost:5000`

### Manual Start (All Platforms)

```bash
# Install dependencies
pip install -r requirements.txt

# Start the application
python app.py  # or python3 app.py on macOS/Linux
```

Then open `http://localhost:5000` in your browser.

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

### Port 5000 already in use
- Edit `app.py` and change the port number in the last line
- Change `port=5000` to another port like `port=5001`

### Dependencies installation fails
- Try upgrading pip: `pip install --upgrade pip`
- On macOS/Linux, use `pip3` instead of `pip`

## File Structure

```
cv-assistant-app/
├── app.py              # Flask backend server
├── index.html          # Frontend interface
├── requirements.txt    # Python dependencies
├── start.bat          # Windows startup script
├── start.sh           # macOS/Linux startup script
├── uploads/           # Temporary file storage (auto-created)
└── README.md          # This file
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

Built with ❤️ using Flask, React, and Ollama

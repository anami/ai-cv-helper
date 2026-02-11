#!/usr/bin/env python3
"""
CV Assistant - Flask Backend
Handles Ollama API integration for CV improvement, cover letters, and application questions
"""

from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import requests
import json
import os
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document
import io

app = Flask(__name__, static_folder='.')
CORS(app)

# Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
PROMPT_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), 'prompt_template.md')
PROMPT_INSTRUCTIONS_PATH = os.path.join(os.path.dirname(__file__), 'prompt_instructions.md')
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(file_stream):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = []
        for page in pdf_reader.pages:
            text.append(page.extract_text())
        return '\n'.join(text)
    except Exception as e:
        return f"Error reading PDF: {str(e)}"


def extract_text_from_docx(file_stream):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_stream)
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return '\n'.join(text)
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"


@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')


@app.route('/api/upload-cv', methods=['POST'])
def upload_cv():
    """Handle CV file upload and text extraction"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload PDF, DOCX, or TXT'}), 400
        
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        # Extract text based on file type
        if file_ext == 'pdf':
            text = extract_text_from_pdf(io.BytesIO(file.read()))
        elif file_ext == 'docx':
            text = extract_text_from_docx(io.BytesIO(file.read()))
        else:  # txt
            text = file.read().decode('utf-8')
        
        return jsonify({'text': text, 'filename': filename})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/check-ollama', methods=['GET'])
def check_ollama():
    """Check if Ollama is running and available"""
    try:
        response = requests.get('http://localhost:11434/api/tags', timeout=2)
        if response.status_code == 200:
            models = response.json().get('models', [])
            return jsonify({
                'status': 'running',
                'models': [model['name'] for model in models]
            })
        else:
            return jsonify({'status': 'error', 'message': 'Ollama not responding'}), 503
    except requests.exceptions.RequestException:
        return jsonify({
            'status': 'not_running',
            'message': 'Ollama is not running. Please start Ollama first.'
        }), 503


@app.route('/api/chat', methods=['POST'])
def chat():
    """Stream chat responses from Ollama"""
    try:
        data = request.json
        message = data.get('message', '')
        cv_text = data.get('cv_text', '')
        job_context = data.get('job_context', {})
        model = data.get('model', 'llama3.2')
        
        # Build the full prompt with CV, job context, and user message
        full_prompt = build_system_prompt(cv_text, job_context, message)
        
        # Stream response from Ollama
        def generate():
            try:
                response = requests.post(
                    OLLAMA_API_URL,
                    json={
                        'model': model,
                        'prompt': full_prompt,
                        'stream': True
                    },
                    stream=True,
                    timeout=120
                )
                
                for line in response.iter_lines():
                    if line:
                        json_response = json.loads(line)
                        if 'response' in json_response:
                            yield f"data: {json.dumps({'text': json_response['response']})}\n\n"
                        if json_response.get('done', False):
                            yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return Response(generate(), mimetype='text/event-stream')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def load_template(path):
    """Load a template file"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return None


def parse_instructions(instructions_content):
    """Parse instruction sections from the markdown file"""
    sections = {}
    current_section = None
    current_lines = []

    for line in instructions_content.split('\n'):
        if line.startswith('## When '):
            if current_section:
                sections[current_section] = '\n'.join(current_lines).strip()
            current_section = line[3:].strip()
            current_lines = []
        elif current_section and not line.startswith('# '):
            current_lines.append(line)

    if current_section:
        sections[current_section] = '\n'.join(current_lines).strip()

    return sections


def build_system_prompt(cv_text, job_context, user_message=''):
    """Build the system prompt with CV and job context using templates"""

    # Load templates
    template = load_template(PROMPT_TEMPLATE_PATH)
    instructions_md = load_template(PROMPT_INSTRUCTIONS_PATH)

    # Fallback if templates not found
    if not template or not instructions_md:
        return build_system_prompt_fallback(cv_text, job_context, user_message)

    # Parse instructions
    instructions = parse_instructions(instructions_md)

    # Build CV section
    cv_section = ""
    if cv_text:
        cv_section = f"## User's CV\n\n{cv_text}"

    # Build job context section
    job_section = ""
    if job_context:
        job_parts = ["## Job Application Context\n"]
        if job_context.get('company'):
            job_parts.append(f"**Company:** {job_context['company']}")
        if job_context.get('role'):
            job_parts.append(f"**Role:** {job_context['role']}")
        if job_context.get('requirements'):
            job_parts.append(f"**Requirements:** {job_context['requirements']}")
        if job_context.get('freeText'):
            job_parts.append(f"**Additional Context:** {job_context['freeText']}")
        job_section = '\n'.join(job_parts)

    # Select appropriate instructions
    if cv_text and job_context:
        selected_instructions = instructions.get('CV and Job Context are both provided', '')
    elif cv_text:
        selected_instructions = instructions.get('only CV is provided', '')
    elif job_context:
        selected_instructions = instructions.get('only Job Context is provided', '')
    else:
        selected_instructions = instructions.get('no context is provided', '')

    # Fill template
    prompt = template.replace('{{CV_SECTION}}', cv_section)
    prompt = prompt.replace('{{JOB_CONTEXT_SECTION}}', job_section)
    prompt = prompt.replace('{{INSTRUCTIONS}}', selected_instructions)
    prompt = prompt.replace('{{USER_MESSAGE}}', user_message)

    return prompt


def build_system_prompt_fallback(cv_text, job_context, user_message=''):
    """Fallback prompt builder if templates are not available"""
    prompt_parts = [
        "You are a professional CV and career assistant.",
        ""
    ]

    if cv_text:
        prompt_parts.append(f"User's CV:\n{cv_text}\n")

    if job_context:
        prompt_parts.append("Job Context:")
        for key, value in job_context.items():
            if value:
                prompt_parts.append(f"- {key}: {value}")
        prompt_parts.append("")

    prompt_parts.append("Provide helpful, professional advice.")

    if user_message:
        prompt_parts.append(f"\nUser Query: {user_message}")

    return '\n'.join(prompt_parts)


if __name__ == '__main__':
    print("=" * 60)
    print("CV Assistant Starting...")
    print("=" * 60)
    print("Server will start on: http://localhost:8080")
    print("Make sure Ollama is running before using the app!")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=8080)

from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import google.generativeai as genai
import os
from dotenv import load_dotenv  # Import dotenv to load environment variables

# Load environment variables from .env file
load_dotenv()

# Configure the API key from environment variables
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("API key for Generative AI is not set in the environment variables.")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.0-flash")

app = Flask(__name__)
CORS(app)

def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

def generate_summary(text, summary_type):
    if summary_type == "small":
        prompt = (
            f"Summarize the following text in a short bullet-point summary. "
            f"Use '•' for bullet points and ensure each point starts on a new line:\n\n{text}"
        )
    elif summary_type == "medium":
        prompt = (
            f"Provide a medium-length bullet-point summary of the following text. "
            f"If the content is too short, expand with more context. "
            f"Use '•' for bullet points and ensure each point starts on a new line:\n\n{text}"
        )
    else:  # large
        prompt = (
            f"Provide a detailed bullet-point summary of the following text. "
            f"If the content is too short, expand with comprehensive details. "
            f"Use '•' for bullet points and ensure each point starts on a new line:\n\n{text}"
        )
    
    response = model.generate_content(prompt)
    
    if response:
        # Format the summary with proper bullet points and spacing
        summary = response.text.strip()
        lines = summary.split('\n')
        formatted_lines = []
        
        for line in lines:
            line = line.strip()
            if line:
                # Remove any existing bullet points or stars at the start
                line = line.lstrip('•').lstrip('*').lstrip('-').strip()
                
                # Handle bold text conversion
                parts = line.split('**')
                formatted_line = ''
                for i, part in enumerate(parts):
                    if i % 2 == 1:  # Odd indices are between ** pairs
                        formatted_line += f'<strong>{part}</strong>'
                    else:
                        formatted_line += part
                
                # Add bullet point
                formatted_line = '• ' + formatted_line
                formatted_lines.append(formatted_line)
        
        formatted_summary = '<br>'.join(formatted_lines)
        return formatted_summary
    
    return "Summary generation failed."

def generate_qa(text):
    prompt = (
        f"Generate question-answer pairs from the following text strictly in the format:\n\n"
        f"Question:\n[Question here]\nAnswer:\n[Answer here]\n\n"
        f"Ensure each question and answer are on separate lines.\n\n{text}"
    )
    response = model.generate_content(prompt)
    if response:
        # Ensure the output is structured with questions and answers on new lines
        text = response.text.strip()
        
        # Split the text into lines
        lines = text.split("\n")
        
        # Iterate through each line and format it
        formatted_text = []
        for line in lines:
            line = line.strip()  # Remove leading/trailing whitespace
            if line.startswith("Question:"):
                formatted_text.append(f"<br><strong>{line}</strong>")  # Add <br> and make the question bold
            elif line.startswith("Answer:"):
                formatted_text.append(f"<br><strong>{line}</strong>")  # Add <br> and make the answer bold
            else:
                formatted_text.append(line)  # Keep other lines as is
        
        # Join the formatted lines into a single string
        formatted_response = "".join(formatted_text).strip()
        
        return formatted_response
    else:
        return "Response generation failed."


@app.route('/summary', methods=['POST'])
def summarize_pdf():
    file = request.files.get('file')
    summary_type = request.form.get('summary_type', 'small')
    
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    pdf_text = extract_text_from_pdf(file)
    if not pdf_text:
        return jsonify({"error": "Failed to extract text from the PDF"}), 500
    
    result = generate_summary(pdf_text, summary_type)
    
    return jsonify({"summary": result})

@app.route('/qa', methods=['POST'])
def qa_pdf():
    file = request.files.get('file')
    
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    pdf_text = extract_text_from_pdf(file)
    if not pdf_text:
        return jsonify({"error": "Failed to extract text from the PDF"}), 500
    
    result = generate_qa(pdf_text)
    
    return jsonify({"qa": result})

if __name__ == '__main__':
    app.run(debug=True)
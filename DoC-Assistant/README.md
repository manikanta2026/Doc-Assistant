# SummarEase - PDF Summarization and Q&A Tool

SummarEase is an open-source tool that transforms lengthy PDFs into clear, concise summaries and generates Q&A pairs using AI technology.

## Features

- **PDF Processing**: Upload and process PDF documents
- **Multiple Summary Types**:
  - Abstract (Short summary)
  - Summary (Medium-length summary)
  - Article (Detailed summary)
- **Q&A Generation**: Automatically generate relevant questions and answers from the PDF content
- **Copy Functionality**: Easy one-click copy for both summaries and Q&A
- **Modern UI**: Clean and responsive interface using React and Tailwind CSS

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite

### Backend
- Flask
- PyMuPDF
- Google Generative AI (Gemini)



### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google API Key for Gemini

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
cd summarization-app
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

### Running the Application

1. Start the frontend development server:
```bash
npm run dev
```

2. Start the backend server:
```bash
python backend/logic.py
```

The application will be available at `http://localhost:5173`

## Usage

1. Access the web interface
2. Upload a PDF file using the file input
3. Choose summary type (Abstract/Summary/Article)
4. Click "Summarize" to generate a summary or "Generate Q&A" for questions and answers
5. Use the copy button to copy the generated content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



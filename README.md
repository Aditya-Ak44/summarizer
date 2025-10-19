# AI Content Summarizer

A modern web application that uses AI to generate intelligent summaries of your content. Built with Next.js and powered by local Ollama models for complete privacy and offline functionality.

## 🌟 Features

- **Multiple Input Methods**: Paste text directly, upload files (.txt, .pdf, .md), or provide any content
- **Customizable Summary Lengths**: Choose between short (2-3 sentences), medium (4-5 sentences), or long (8-10 sentences) summaries
- **Real-time Streaming**: Watch summaries generate in real-time as the AI processes your content
- **Smart Formatting**: Automatically formats output with headings, bullet points, and proper paragraph structure
- **Local Processing**: Run completely locally using Ollama for maximum privacy and no API costs
- **Claude-like UI**: Split-screen interface with smooth animations between input and output panels
- **Copy to Clipboard**: One-click copying of generated summaries
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Ollama installed and running locally
- A model downloaded in Ollama (e.g., `mistral`, `neural-chat`, `llama2`)

### Installation

1. **Clone or create the project**:
```bash
npx create-next-app@latest summarizer --typescript --tailwind
cd summarizer
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the project root:
```
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Running Ollama

1. **Start Ollama service** (if not already running):
```bash
ollama serve
```

2. **Pull a model** (in another terminal):
```bash
ollama pull mistral
```

Available models: `mistral`, `neural-chat`, `llama2`, `dolphin-mixtral`, `openchat`

3. **Start the development server**:
```bash
npm run dev
```

4. **Open in browser**:
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
summarizer/
├── app/
│   ├── api/
│   │   └── summarize/
│   │       └── route.ts              # API endpoint for summarization
│   ├── components/
│   │   ├── TextInput.tsx             # Text input textarea component
│   │   ├── FileUpload.tsx            # File upload component
│   │   ├── SummaryDisplay.tsx        # Formatted summary display
│   │   └── LoadingSpinner.tsx        # Loading animation component
│   ├── page.tsx                      # Main page with Claude-like layout
│   ├── globals.css                   # Global styles
│   └── layout.tsx                    # Root layout
├── .env.local                        # Environment variables
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

## 💻 Usage

1. **Paste Content**: Enter text directly into the textarea on the left panel
2. **Or Upload**: Click the file upload area to select a `.txt`, `.pdf`, or `.md` file
3. **Choose Length**: Select your preferred summary length (Short, Medium, or Long)
4. **Summarize**: Click the "Summarize Content" button
5. **View Results**: The summary appears in the right panel with real-time streaming
6. **Copy**: Use the "Copy" button to copy the summary to your clipboard

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_URL` | `http://localhost:11434` | URL where Ollama is running |
| `OLLAMA_MODEL` | `mistral` | Ollama model to use for summarization |

### Supported File Types

- `.txt` - Plain text files
- `.md` - Markdown files
- `.pdf` - PDF documents (requires additional setup)

**Note**: PDF support requires `pdf-parse` or `pdfjs-dist`. Install with:
```bash
npm install pdf-parse
```

## 🎨 UI Components

### TextInput
- Textarea for pasting content
- Black text, rounded borders, focus states

### FileUpload
- Drag-and-drop enabled area
- Supports multiple file types
- Error handling for invalid files

### SummaryDisplay
- Formatted output with proper styling
- Detects and renders headings (`**text**` → bold headings)
- Bullet points with disc styling
- Proper paragraph spacing
- Copy-to-clipboard functionality

### LoadingSpinner
- Animated spinner with "Generating summary..." message
- Shows during API processing

## 📦 Dependencies

- **Next.js 14+**: React framework with server-side rendering
- **React 18+**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

## 🔄 How It Works

1. User provides content through text input or file upload
2. Frontend sends content + summary length to `/api/summarize` endpoint
3. API route calls Ollama's local `/api/generate` endpoint
4. Ollama processes the prompt using the selected model
5. Response streams back to the frontend as it's generated
6. Frontend formats and displays the summary in real-time
7. User can copy or refine the summary

## ⚙️ API Endpoint

### POST `/api/summarize`

**Request**:
```json
{
  "content": "Your text content here...",
  "summaryLength": "medium"
}
```

**Response**: Stream of text (real-time summary)

**Query Parameters**:
- `content` (required): Text to summarize
- `summaryLength` (optional): `short`, `medium`, or `long` (default: `medium`)

## 🎯 Future Enhancements

- YouTube transcript summarization
- Advanced PDF parsing with layout preservation
- Summary history and saved summaries
- Dark mode toggle
- Multi-language support
- Comparison between different summary lengths
- Export to PDF/Word formats
- Browser extension for web content
- API key support for cloud-based models

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is open source and available under the MIT License.

## ❓ Troubleshooting

### Ollama Connection Error
- Ensure Ollama is running: `ollama serve`
- Check `OLLAMA_URL` in `.env.local` matches your Ollama instance
- Verify Ollama is accessible at `http://localhost:11434`

### Model Not Found Error
- Pull the model: `ollama pull mistral`
- Verify model name in `.env.local` matches available models: `ollama list`

### Slow Summarization
- Check model size (larger models are slower but more accurate)
- Verify system resources (RAM, CPU)
- Try a smaller model like `neural-chat` instead of larger ones

### Out of Memory Error
- Reduce content length
- Try a smaller model
- Close other applications
- Increase system RAM if possible

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Ollama Documentation](https://ollama.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)

---

**Happy Summarizing! 🎉**
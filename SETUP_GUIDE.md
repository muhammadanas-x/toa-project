# Python Backend Setup Guide

## Quick Setup Steps

1. **Copy your existing files to python-backend:**
   ```bash
   # Copy these files from your Desktop\Manim folder:
   copy "C:\Users\midny\Desktop\Manim\pipeline_2.py" "C:\Users\midny\Documents\GitHub\toa-project\python-backend\"
   copy "C:\Users\midny\Desktop\Manim\config.py" "C:\Users\midny\Documents\GitHub\toa-project\python-backend\"
   ```

2. **Navigate to python-backend:**
   ```bash
   cd C:\Users\midny\Documents\GitHub\toa-project\python-backend
   ```

3. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify config.py has your API keys:**
   - Open `config.py`
   - Make sure `PINECONE_API_KEY` is set
   - Make sure `PINECONE_INDEX_NAME` is set

6. **Make sure Ollama is running:**
   ```bash
   # In a separate terminal, check if Ollama is running
   ollama list
   
   # Pull the model if needed
   ollama pull qwen3:8b
   ```

7. **Start the Flask server:**
   ```bash
   python app.py
   ```

You should see:
```
 * Running on http://127.0.0.1:5000
```

## Testing the Setup

Open a new terminal and test the API:

```bash
curl -X POST http://localhost:5000/health
```

Should return:
```json
{"status": "healthy", "message": "Python backend is running"}
```

## Running Both Servers

**Terminal 1 - Python Backend:**
```bash
cd C:\Users\midny\Documents\GitHub\toa-project\python-backend
.\venv\Scripts\activate
python app.py
```

**Terminal 2 - Next.js Frontend:**
```bash
cd C:\Users\midny\Documents\GitHub\toa-project\my-app
npm run dev
```

Then open: http://localhost:3000/chat

## Troubleshooting

### Python backend won't start:
- Make sure virtual environment is activated
- Check all dependencies are installed: `pip list`
- Verify config.py has correct API keys

### Frontend can't connect:
- Verify Flask server is running on port 5000
- Check `.env.local` has `PYTHON_BACKEND_URL=http://localhost:5000`
- Restart Next.js dev server after changing .env.local

### Ollama errors:
- Make sure Ollama is running: `ollama serve`
- Check model is installed: `ollama pull qwen3:8b`

### Pinecone errors:
- Verify API key in config.py
- Check index name is correct
- Ensure index exists in Pinecone dashboard

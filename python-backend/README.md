# Python Backend for TOA Project

This Flask server handles Python-specific operations including Manim visualizations and mathematical computations.

## Setup

1. **Copy your pipeline files:**
```bash
# Copy pipeline_2.py and config.py to python-backend folder
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
- Windows:
  ```bash
  .\venv\Scripts\activate
  ```
- Mac/Linux:
  ```bash
  source venv/bin/activate
  ```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure environment:**
- Edit `config.py` with your Pinecone API key and index name
- Make sure Ollama is running locally (or configure OLLAMA_HOST)

6. **Run the server:**
```bash
python app.py
```

The server will start at `http://localhost:5000`

## Prerequisites

- **Ollama**: Must be running locally with the models used in pipeline_2.py (qwen3:8b, etc.)
  ```bash
  ollama pull qwen3:8b
  ```
- **Pinecone**: Set up your Pinecone account and create an index
- **Manim**: Optional, for testing generated code locally

## API Endpoints

### POST /process
Process chat messages
```json
{
  "message": "Your message",
  "chat_id": "123"
}
```

### POST /visualize
Generate Manim visualizations
```json
{
  "code": "manim code",
  "visualization_type": "3d",
  "parameters": {}
}
```

### POST /execute
Execute Python scripts
```json
{
  "script_name": "script.py",
  "arguments": {}
}
```

### GET /health
Health check endpoint

## Integrating Your Existing Python Code

1. Place your existing Python files in this directory
2. Import them in `app.py`:
   ```python
   from your_module import your_function
   ```
3. Call your functions in the appropriate endpoints

## Example Structure
```
python-backend/
├── app.py              # Main Flask server
├── requirements.txt    # Dependencies
├── your_module.py      # Your existing code
├── manim_scenes.py     # Your Manim scenes
└── utils/              # Helper functions
```

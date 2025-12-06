# 🚨 IMPORTANT: Configure Your API Keys

## Step 1: Edit the .env file

Open the `.env` file in the `python-backend` folder and replace the placeholder values with your actual credentials:

```env
# Pinecone Configuration
PINECONE_API_KEY=pcsk_XXXXX_your_actual_key_here
PINECONE_ENVIRONMENT=us-east-1  # or your environment
PINECONE_INDEX_NAME=manim-docs  # your index name

# Ollama Configuration (optional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_LLM_MODEL=qwen3:8b
```

## Step 2: Get Your Pinecone API Key

1. Go to https://www.pinecone.io/
2. Log in to your account
3. Go to "API Keys" in the dashboard
4. Copy your API key
5. Paste it into the `.env` file (replace `your_pinecone_api_key_here`)

## Step 3: Verify Your Index Name

Make sure the `PINECONE_INDEX_NAME` matches the actual index name in your Pinecone dashboard.

## Step 4: Restart the Flask Server

After editing the `.env` file:

1. Stop the current Flask server (Ctrl+C in the terminal)
2. Restart it:
   ```bash
   python app.py
   ```

## Step 5: Test the Endpoint

Your chat should now work! The error "Failed to process message" was because the API key wasn't configured.

---

## Alternative: Copy from Your Original config.py

If your original `C:\Users\midny\Desktop\Manim\config.py` has the API key hardcoded, you can either:

1. **Option A**: Copy the values to the `.env` file (recommended for security)
2. **Option B**: Replace the entire config.py with your original (less secure but faster)

For Option B:
```bash
copy "C:\Users\midny\Desktop\Manim\config.py" "C:\Users\midny\Documents\GitHub\toa-project\python-backend\config.py"
```

Then restart the server.

import os
from pathlib import Path
from dotenv import load_dotenv

# Get the directory where this config.py file is located
current_dir = Path(__file__).parent

# Load environment variables from .env in the same directory
load_dotenv(dotenv_path=current_dir / '.env')


EMBEDDING_MODEL = "llama-text-embed-v2"

# Pinecone Configuration
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT')
PINECONE_INDEX_NAME = os.getenv('PINECONE_INDEX_NAME', 'manim-docs')

# Ollama Configuration
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_EMBEDDING_MODEL = os.getenv('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text')  # For embeddings
OLLAMA_LLM_MODEL = os.getenv('OLLAMA_LLM_MODEL', 'deepseek-r1:8b')  # For code generation

# Document Configuration
DOCS_FOLDER = 'dataset'
CHUNK_SIZE = 2000  # Characters per chunk (larger for technical docs)
CHUNK_OVERLAP = 400  # Overlap between chunks (20% of chunk size)

# Vector Dimension (depends on your embedding model)
# nomic-embed-text uses 768 dimensions
VECTOR_DIMENSION = 768

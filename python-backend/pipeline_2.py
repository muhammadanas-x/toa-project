import ollama
from pinecone import Pinecone
import config
import re


def get_embedding_pinecone(text, pc):
    """Generate embedding using Pinecone's llama-text-embed-v2."""
    try:
        embedding = pc.inference.embed(
            model='llama-text-embed-v2',
            inputs=[text],
            parameters={"input_type": "query"}
        )
        return embedding[0]['values']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None


def search_rag(query, top_k=1):
    """Search the RAG database for relevant Manim documentation."""
    print(f"\n🔍 Searching RAG for relevant documentation...")
    
    # Initialize Pinecone
    pc = Pinecone(api_key=config.PINECONE_API_KEY)
    index = pc.Index(config.PINECONE_INDEX_NAME)
    
    # Generate embedding for the query using Pinecone
    query_embedding = get_embedding_pinecone(query, pc)
    
    if query_embedding is None:
        print("Failed to generate query embedding!")
        return []
    
    # Search in Pinecone
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    # Extract relevant documentation
    docs = []
    for match in results['matches']:
        metadata = match['metadata']
        docs.append({
            'filename': metadata.get('filename', 'Unknown'),
            'instruction': metadata.get('instruction', ''),
            'response': metadata.get('response', ''),  # This contains the Manim code
            'score': match['score']
        })
    
    print(f"✓ Found {len(docs)} relevant documentation chunks\n")
    return docs


def extract_code_from_response(text):
    """Extract code blocks from LLM response."""
    # Try to find code between ```python and ```
    pattern = r'```python\n(.*?)\n```'
    matches = re.findall(pattern, text, re.DOTALL)
    if matches:
        return matches[0]
    
    # Try to find code between ``` and ```
    pattern = r'```\n(.*?)\n```'
    matches = re.findall(pattern, text, re.DOTALL)
    if matches:
        return matches[0]
    
    # If no code blocks found, return the whole text
    return text


def modify_code_with_rag(user_request, rag_template):
    """Modify the RAG template code according to user's request using deepseek-r1:8b."""
    print(f"🔧 Modifying template code with deepseek-r1:8b...")

    system_prompt = """You are a Manim expert code modifier. Your task is to take an existing Manim code template and modify ONLY the requested function/animation to match the user's request.

STRICT RULES:
1. Keep the overall code structure intact.
2. Modify ONLY the specific function or animation indicated in the user request.
3. Do NOT remove, condense, combine, or alter any other lines anywhere in the code.
4. Preserve **all original blank lines, comments, and formatting exactly** as in the template.
5. Do not “clean up” or simplify any code, even inside the modified function—change only what the user requested.
6. Return only the complete modified Python code, no explanations.
"""

    user_prompt = f"""ORIGINAL TEMPLATE CODE:
{rag_template}

USER REQUEST:
{user_request}

INSTRUCTIONS:
Modify the above template code strictly according to the user's request. 
Change only the necessary parts. 
Do NOT remove, condense, combine, or alter any other lines. 
Preserve all comments, blank lines, and formatting exactly as in the original code.

Return only the complete modified Python code without any omissions or simplifications.
"""

    try:
        response = ollama.generate(
            model='gpt-oss:20b',
            system=system_prompt,
            prompt=user_prompt
        )

        modified_code = response['response']
        print("✓ Code modified successfully\n")
        return modified_code

    except Exception as e:
        print(f"Error modifying code: {e}")
        return None
    

    
def manim_pipeline(user_prompt):
    """Complete pipeline: RAG Search -> Get Template -> Modify with LLM."""
    print("="*80)
    print("RAG-FIRST MANIM CODE GENERATION PIPELINE")
    print("="*80)
    print(f"\nUser Request: {user_prompt}\n")
    
    # Step 1: Search RAG for most relevant template
    print("STEP 1: RAG Template Search")
    print("-"*80)
    rag_docs = search_rag(user_prompt, top_k=1)
    
    if not rag_docs:
        print("No RAG documentation found!")
        return None
    
    # Get the top result
    top_result = rag_docs[0]
    template_code = top_result['response']  # Get the response (Manim code) from metadata
    matched_instruction = top_result['instruction']  # The instruction that was matched
    
    print(f"Best Match Found:")
    print(f"  File: {top_result['filename']}")
    print(f"  Relevance Score: {top_result['score']:.3f}")
    print(f"  Matched Instruction: {matched_instruction[:100]}...")
    print(f"\nTemplate Code Preview:")
    print("-"*40)
    print(template_code[:500] + "..." if len(template_code) > 500 else template_code)
    print("-"*40 + "\n")
    
    # Step 2: Modify the template code using gpt-oss:20b
    print("STEP 2: Modify Template with LLM")
    print("-"*80)
    modified_code = modify_code_with_rag(user_prompt, template_code)
    
    if not modified_code:
        print("Failed to modify code, returning original template")
        return template_code
    
    # Extract clean code
    final_code = extract_code_from_response(modified_code)
    
    print("="*80)
    print("FINAL MODIFIED CODE:")
    print("="*80)
    print(final_code)
    print("="*80)
    
    return final_code


def explain_manim_code(manim_code, user_request):
    """Use deepseek-r1:1.5b to solve the user's request through text explanation."""
    print(f"\n📚 Generating text explanation with deepseek-r1:1.5b...")
    
    system_message = """You are a mathematics expert and educator. Your task is to solve mathematical problems step-by-step with clear explanations.

Provide:
1. A detailed step-by-step solution to the problem
2. Clear explanations of each step
3. Final answer with proper mathematical notation
4. Any important notes about domain, range, or special conditions

Be thorough, educational, and use clear mathematical language."""

    user_message = f"""Please solve this mathematical problem step-by-step:

{user_request}

Provide a complete solution with explanations for each step."""

    try:
        print(f"Calling ollama.chat() with model 'deepseek-r1:1.5b'...")
        response = ollama.chat(
            model='deepseek-r1:1.5b',
            messages=[
                {'role': 'system', 'content': system_message},
                {'role': 'user', 'content': user_message}
            ]
        )
        
        explanation = response['message']['content']
        print(f"✓ Explanation generated successfully ({len(explanation)} characters)\n")
        print(f"Preview: {explanation[:200]}...\n")
        return explanation
        
    except Exception as e:
        print(f"❌ Error generating explanation: {e}")
        import traceback
        traceback.print_exc()
        return f"Unable to generate explanation. Error: {str(e)}"


def save_code_to_file(code, filename="generated_manim_scene.py"):
    """Save the generated code to a file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"\n✓ Code saved to: {filename}")
        return True
    except Exception as e:
        print(f"\n✗ Error saving code: {e}")
        return False


if __name__ == "__main__":
    # Your specific prompt
    user_prompt = "find me inverse of  x^2 + x^3 + 1 and state its domain and range"
    
    # Run the pipeline
    final_code = manim_pipeline(user_prompt)
    
    # Save to file
    if final_code:
        save_code_to_file(final_code)
        print("\n🎉 Pipeline completed successfully!")
        print("\nTo run the generated code:")
        print("  manim -pql generated_manim_scene.py SceneName")
    else:
        print("\n✗ Pipeline failed!")
# Service for AI-related tasks

import os
import httpx
from sqlalchemy.orm import Session

# Adjust import path based on actual project structure
from src import main as db_main, schemas

# Get Ollama endpoint from environment variable or use default
OLLAMA_ENDPOINT = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b") # Or another suitable model

async def generate_description_ollama(prompt: str) -> str:
    """Generates content using a local Ollama instance."""
    api_url = f"{OLLAMA_ENDPOINT}/api/chat"
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "stream": False # Get the full response at once
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client: # Increased timeout for generation
            response = await client.post(api_url, json=payload)
            response.raise_for_status() # Raise exception for bad status codes
            result = response.json()
            # Extract content from the last message in the response
            if result and "message" in result and "content" in result["message"]:
                return result["message"]["content"].strip()
            else:
                print(f"Unexpected Ollama response format: {result}")
                return "Error: Could not parse AI response."
    except httpx.RequestError as e:
        print(f"Error connecting to Ollama: {e}")
        return f"Error: Could not connect to AI service at {OLLAMA_ENDPOINT}."
    except Exception as e:
        print(f"An unexpected error occurred during AI generation: {e}")
        return "Error: AI generation failed."

async def generate_product_description(product_id: int, db: Session):
    """Fetches product details and triggers AI description generation."""
    db_product = db.query(db_main.Product).filter(db_main.Product.internal_id == product_id).first()
    if not db_product:
        print(f"Product {product_id} not found for AI description generation.")
        return

    if db_product.ai_description: # Don't regenerate if already exists
        print(f"AI description already exists for product {product_id}.")
        return

    # Construct a prompt for the AI
    # Improve this prompt based on desired output style and available data
    prompt = f"Generate a compelling and SEO-friendly product description (around 150-200 words) for the following product:\n\nTitle: {db_product.title}\n"
    if db_product.description:
        prompt += f"Existing Info: {db_product.description[:200]}...\n"
    if db_product.variants:
        try:
            variants_data = json.loads(db_product.variants)
            prompt += f"Variants: {json.dumps(variants_data[:2])} ...\n" # Show first few variants
        except:
            pass # Ignore variant errors in prompt
    prompt += f"\nFocus on benefits, unique selling points, and include relevant keywords. Do not include the title in the description itself."

    print(f"Generating AI description for product {product_id}...")
    ai_desc = await generate_description_ollama(prompt)

    # Update the product in the database
    db_product.ai_description = ai_desc
    db.commit()
    print(f"AI description updated for product {product_id}.")

# Add other AI-related functions here (e.g., pricing suggestions, trend analysis)


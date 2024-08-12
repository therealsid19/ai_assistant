from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from the .env.local file
load_dotenv(dotenv_path='../.env.local')

# Retrieve the OpenAI API key from the environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client with the API key
openai_client = OpenAI(api_key=openai_api_key)

def generate_title_from_answer(answer, max_length=50):
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Generate a short, concise title (max 50 characters) for the following content:"},
            {"role": "user", "content": answer}
        ],
        max_tokens=10
    )
    title = response.choices[0].message.content.strip()
    return title

'''from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_model import perform_rag  # Import your RAG function

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for development

@app.route('/api/rag', methods=['POST'])
def rag_endpoint():
    data = request.json
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        answer = perform_rag(query)  # Call your RAG function here
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)'''


import ssl
import certifi
import urllib.request

# Create and set an SSL context
ssl_context = ssl.create_default_context(cafile=certifi.where())
urllib.request.urlopen = lambda url, **kwargs: urllib.request.urlopen(url, context=ssl_context, **kwargs)

from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_model import perform_rag  # Import your RAG function
from title_generator import generate_title_from_answer  # Import the title generator
import logging

# Set up basic configuration for logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for development

@app.route('/api/rag', methods=['POST'])
def rag_endpoint():
    data = request.json
    query = data.get('query', '')
    generate_title = data.get('generate_title')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        result = perform_rag(query)
        if generate_title:
            title = generate_title_from_answer(result['answer'])
            result['title'] = title
            print(result['title'])

        
        print(f"Returning result: {result}")  # For debugging
        return jsonify(result)
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # For debugging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)

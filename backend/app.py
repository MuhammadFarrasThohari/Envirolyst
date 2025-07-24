from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
from transformers import pipeline
import numpy as np
import matplotlib.pyplot as plt
import base64
import io
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if not image_file:
        return jsonify({'error': 'No image file provided'}), 400

    try:
        # Load the image
        image = Image.open(image_file.stream).convert('RGB')
        
        # Initialize the classification pipeline
        pipe = pipeline("image-classification", model="prithivMLmods/GiD-Land-Cover-Classification")
        
        # Perform classification
        results = pipe(image)
        
        # Prepare the response
        response = [{'label': item['label'], 'score': item['score']} for item in results]
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Land usage classification API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

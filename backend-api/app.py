from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
import random

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all domains on all routes, specifically allowing POST requests
# For production, restrict the origin to your extension's ID:
# CORS(app, origins=["chrome-extension://YOUR_EXTENSION_ID"])
CORS(app, resources={r"/verify": {"origins": "*"}}) # Allow all origins for now for simplicity

@app.route('/verify', methods=['POST'])
def verify_text():
    """
    Mock API endpoint to simulate fact-checking.
    Accepts POST requests with JSON containing 'text'.
    Returns a mock confidence score and citations.
    """
    print("Received request on /verify") # Log when the endpoint is hit

    if not request.is_json:
        print("Error: Request is not JSON")
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    print(f"Received data: {data}") # Log received data

    if 'text' not in data:
        print("Error: 'text' field missing in JSON")
        return jsonify({"error": "Missing 'text' field in JSON"}), 400

    # Simulate processing the text (we don't actually use the text here)
    extracted_text = data['text']
    print(f"Received text length: {len(extracted_text)}")

    # --- Mock Response Generation ---
    # Generate a random confidence score
    mock_score = random.randint(50, 95)

    # Define a pool of possible citations
    citation_pool = [
        "Wikipedia: General Knowledge",
        "Study by Example University (2023)",
        "Expert Opinion: Dr. A. Smith",
        "News Article: The Example Times",
        "Government Report: Dept. of Examples",
        "Book: 'Theories of Stuff' by J. Doe"
    ]
    # Select 2-3 random citations from the pool
    num_citations = random.randint(2, 3)
    mock_citations = random.sample(citation_pool, num_citations)
    # --- End Mock Response Generation ---

    # Create the response payload
    response_data = {
        "confidence_score": mock_score,
        "citations": mock_citations
    }

    print(f"Sending response: {response_data}") # Log the response being sent
    return jsonify(response_data)

if __name__ == '__main__':
    # Run the Flask app locally on port 5000
    # Accessible at http://127.0.0.1:5000/
    # Use host='0.0.0.0' to make it accessible on your network if needed,
    # but 127.0.0.1 is safer for local development.
    app.run(debug=True, port=5000) # debug=True enables auto-reloading and error pages

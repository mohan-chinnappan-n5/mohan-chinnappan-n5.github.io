from flask import Flask, request, jsonify
import spacy
# python -m spacy download en_core_web_sm

from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allow all origin

# Load the spaCy model (you may need to download and install the model)
nlp = spacy.load("en_core_web_sm")

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'msg': 'Hello from Spacy!'})

@app.route('/entities', methods=['POST'])
def recognize_entities():
    try:
        # Get the input text from the request
        data = request.get_json()
        text = data['text']
        print (f"text: {text}")

        # Process the text with spaCy to recognize entities
        doc = nlp(text)
        print(doc)

        # Extract recognized entities
        entities = []
        for ent in doc.ents:
            entities.append({
                'text': ent.text,
                'type': ent.label_
            })


        print (entities);
        return jsonify({'entities': entities})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)


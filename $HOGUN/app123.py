from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import pickle

# Load the model from disk
filename = 'model.pkl'
clf = pickle.load(open(filename, 'rb'))

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if the request contains a file
        if 'csv-file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['csv-file']
        
        # Check if the file is empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        # Check if the file is a CSV
        if file and file.filename.endswith('.csv'):
            # Read the CSV file
            df = pd.read_csv(file)
            # Preprocess the data
            message = df.values.astype(float)
            my_prediction = clf.predict(message)
            return render_template('result.html', prediction=my_prediction)
        else:
            return jsonify({'error': 'Please select a CSV file'})

if __name__ == '__main__':
    app.run(debug=True)

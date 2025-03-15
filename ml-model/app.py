import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, render_template, request
from sklearn.preprocessing import StandardScaler
import plotly.express as px
import plotly.io as pio
import joblib  # For saving/loading scaler

app = Flask(__name__)

# Load model and scaler
model = tf.keras.models.load_model('model/ocean_health_model.h5')
scaler = joblib.load('model/scaler.pkl')  # Save scaler during training

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get all form fields
        features = {
            'latitude': float(request.form['latitude']),
            'longitude': float(request.form['longitude']),
            'month': int(request.form['month']),
            'sea_surface_temp': float(request.form['sea_surface_temp']),
            'salinity': float(request.form['salinity']),
            'ph': float(request.form['ph']),
            'pollution_nearby': float(request.form['pollution_nearby']),
            'current_speed': float(request.form['current_speed']),
            'plastic_concentration': float(request.form['plastic_concentration']),
            'phytoplankton': float(request.form['phytoplankton']),
            'dissolved_oxygen': float(request.form['dissolved_oxygen'])
        }
    except KeyError as e:
        return f"Missing form field: {e}", 400
    except ValueError as e:
        return f"Invalid value: {e}", 400
    
    # Preprocess input
    input_df = pd.DataFrame([features])
    scaled_input = scaler.transform(input_df)
    
    # Make prediction
    prediction = model.predict(scaled_input)
    coral_health, plastic_accumulation, carbon_sequestration = prediction[0]
    
    # Generate Plotly graphs
    data = pd.read_csv('synthetic_ocean_data.csv').sample(n=1000)
    fig1 = px.scatter(data, x='sea_surface_temp', y='coral_health', 
                     title='Coral Health vs. Temperature')
    fig2 = px.histogram(data, x='plastic_concentration', 
                       title='Plastic Distribution')
    fig3 = px.line(data, y='carbon_sequestration', 
                  title='Carbon Sequestration Over Time')
    
    # Convert plots to HTML
    graph1 = pio.to_html(fig1, full_html=False)
    graph2 = pio.to_html(fig2, full_html=False)
    graph3 = pio.to_html(fig3, full_html=False)
    
    return render_template('results.html', 
                         coral_health=round(coral_health, 2),
                         plastic=round(plastic_accumulation, 2),
                         carbon=round(carbon_sequestration, 2),
                         graph1=graph1,
                         graph2=graph2,
                         graph3=graph3)

if __name__ == '__main__':
    app.run(debug=True)
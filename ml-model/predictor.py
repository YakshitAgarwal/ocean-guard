# -*- coding: utf-8 -*-
# predictor.py - Handles AI predictions for ocean health

import pandas as pd
import tensorflow as tf
import joblib
import os

class OceanHealthPredictor:
    def __init__(self, model_path='models/ocean_health_model.h5', scaler_path='models/scaler.pkl'):
        """Initialize the predictor with model and scaler"""
        try:
            self.model = tf.keras.models.load_model(model_path)
            self.scaler = joblib.load(scaler_path)
        except (OSError, IOError) as e:
            print(f"Error loading model files: {e}")
            print("Please run create_dummy_models.py first to create placeholder models.")
            raise
        
    def preprocess_data(self, data):
        """Preprocess input data for model prediction"""
        features = pd.DataFrame({
            'sst': [data['sea_surface_temp']],
            'chlorophyll': [data['chlorophyll']],
            'plastic_density': [data['plastic_concentration']],
            'current_speed': [data['current_speed']],
            'ph': [data['ph']],
            'dissolved_oxygen': [data['dissolved_oxygen']]
        })
        return self.scaler.transform(features)
    
    def predict(self, processed_data):
        """Make predictions using the loaded model"""
        prediction = self.model.predict(processed_data)
        return {
            'coral_health': prediction[0][0],
            'plastic_risk': prediction[0][1],
            'carbon_capacity': prediction[0][2]
        }
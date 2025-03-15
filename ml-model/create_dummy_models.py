# -*- coding: utf-8 -*-
# create_dummy_models.py - Creates placeholder models for development

import os
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.metrics import MeanAbsoluteError

def create_dummy_tensorflow_model():
    """Create a simple dummy TensorFlow model for ocean health predictions"""
    # Create a simple model with 6 inputs and 3 outputs
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(12, activation='relu', input_shape=(6,)),
        tf.keras.layers.Dense(8, activation='relu'),
        tf.keras.layers.Dense(3, activation='sigmoid')
    ])
    
    # Use instantiated loss and metric objects instead of strings
    model.compile(
        optimizer='adam',
        loss=MeanSquaredError(),  # Using object instead of string 'mse'
        metrics=[MeanAbsoluteError()]  # Using object instead of string 'mae'
    )
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Save the model
    model.save('models/ocean_health_model.h5')
    print("Dummy TensorFlow model created and saved to models/ocean_health_model.h5")

def create_dummy_scaler():
    """Create a dummy scaler for preprocessing data"""
    # Create sample data for fitting the scaler
    data = {
        'sst': np.random.uniform(20, 30, 100),
        'chlorophyll': np.random.uniform(0.1, 5.0, 100),
        'plastic_density': np.random.uniform(0, 1000, 100),
        'current_speed': np.random.uniform(0, 2, 100),
        'ph': np.random.uniform(7.5, 8.4, 100),
        'dissolved_oxygen': np.random.uniform(4, 9, 100)
    }
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Create and fit scaler
    scaler = StandardScaler()
    scaler.fit(df)
    
    # Save the scaler
    joblib.dump(scaler, 'models/scaler.pkl')
    print("Dummy scaler created and saved to models/scaler.pkl")

if __name__ == "__main__":
    create_dummy_tensorflow_model()
    create_dummy_scaler()
    print("All dummy models created successfully. You can now run the main application.")
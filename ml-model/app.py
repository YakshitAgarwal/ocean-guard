from flask import Flask, jsonify, request
import requests
import numpy as np
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)

# API Keys (replace with your own keys)
OPENWEATHER_API_KEY = "42daabecd172b609b416effaabee3020"
OPENCAGE_API_KEY = "8d36655c5cd84ceea09c70b5c2bc0ee0"
NASA_EARTHDATA_API_KEY = "le2px69A3hQCrCTsxKdG81vSjVyKHMoMnt9LQWg6"

# Example ML model (replace with your trained model)
def train_carbon_sequestration_model():
    # Dummy data for example
    X = np.random.rand(100, 5)  # Features (e.g., temperature, salinity, etc.)
    y = np.random.rand(100)     # Target (e.g., carbon sequestration capacity)
    model = RandomForestRegressor()
    model.fit(X, y)
    return model

carbon_model = train_carbon_sequestration_model()

def get_current_location():
    """Get the current latitude and longitude using the user's IP address."""
    response = requests.get(f"https://api.opencagedata.com/geocode/v1/json?q=ip&key={OPENCAGE_API_KEY}")
    if response.status_code == 200:
        data = response.json()
        lat = data["results"][0]["geometry"]["lat"]
        lon = data["results"][0]["geometry"]["lng"]
        return lat, lon
    else:
        return None, None

def fetch_weather_data(lat, lon):
    """Fetch weather and oceanic data from OpenWeatherMap API."""
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def fetch_nasa_earthdata(lat, lon):
    """Fetch satellite data from NASA Earthdata API."""
    # Replace with actual NASA Earthdata API endpoint and parameters
    url = f"https://api.nasa.gov/planetary/earth/imagery?lon={lon}&lat={lat}&date=2023-10-01&dim=0.1&api_key={NASA_EARTHDATA_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def predict_carbon_sequestration(data):
    """Predict carbon sequestration capacity using the trained model."""
    features = np.array([data["temp"], data["humidity"], data["pressure"], data["wind_speed"], data["clouds"]]).reshape(1, -1)
    prediction = carbon_model.predict(features)
    return prediction[0]

@app.route('/predict', methods=['GET'])
def predict():
    """API endpoint to predict coral reef health, plastic accumulation, and carbon sequestration."""
    # Get the current location of the user
    lat, lon = get_current_location()
    if not lat or not lon:
        return jsonify({"error": "Unable to fetch location"}), 500

    # Fetch weather and oceanic data
    weather_data = fetch_weather_data(lat, lon)
    if not weather_data:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    # Fetch satellite data (replace with actual analysis)
    satellite_data = fetch_nasa_earthdata(lat, lon)
    if not satellite_data:
        return jsonify({"error": "Failed to fetch satellite data"}), 500

    # Example predictions (replace with actual analysis)
    coral_reef_health = "Healthy" if weather_data["main"]["temp"] < 30 else "At Risk"
    plastic_accumulation = "High" if weather_data["clouds"]["all"] > 50 else "Low"
    carbon_capacity = predict_carbon_sequestration({
        "temp": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "pressure": weather_data["main"]["pressure"],
        "wind_speed": weather_data["wind"]["speed"],
        "clouds": weather_data["clouds"]["all"]
    })

    # Return results as JSON
    result = {
        "coral_reef_health": coral_reef_health,
        "plastic_accumulation": plastic_accumulation,
        "carbon_sequestration_capacity": carbon_capacity,
        "location": {"latitude": lat, "longitude": lon},
        "weather_data": weather_data,
        "satellite_data": satellite_data
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
import pandas as pd
import numpy as np

# Generate 10,000 synthetic samples
num_samples = 10_000

# Synthetic Features (adjust ranges based on real-world values)
data = {
    # Location and time
    'latitude': np.random.uniform(-90, 90, num_samples),
    'longitude': np.random.uniform(-180, 180, num_samples),
    'month': np.random.randint(1, 12, num_samples),
    
    # Environmental factors
    'sea_surface_temp': np.random.uniform(20, 30, num_samples),  # °C
    'salinity': np.random.uniform(30, 37, num_samples),          # PSU
    'ph': np.random.uniform(7.5, 8.4, num_samples),             # pH level
    'pollution_nearby': np.random.uniform(0, 1, num_samples),   # 0-1 scale
    
    # Ocean currents (hypothetical)
    'current_speed': np.random.uniform(0, 2, num_samples),      # m/s
    'plastic_concentration': np.random.uniform(0, 1000, num_samples),  # particles/km²
    
    # Carbon metrics
    'phytoplankton': np.random.uniform(0, 10, num_samples),    # mg/m³
    'dissolved_oxygen': np.random.uniform(4, 9, num_samples),   # mg/L
}

# Create DataFrame
df = pd.DataFrame(data)

# Generate synthetic targets (formulas are simplified for demonstration)
df['coral_health'] = (
    0.7 * (30 - df['sea_surface_temp']) +  # Cooler water = healthier coral
    0.5 * df['ph'] +                       # Higher pH = healthier coral
    -0.9 * df['pollution_nearby']          # Pollution harms coral
) + np.random.normal(0, 5, num_samples)    # Add noise

df['plastic_accumulation'] = (
    0.8 * df['current_speed'] +            # Slower currents = more plastic
    1.2 * df['pollution_nearby'] +         # Pollution increases plastic
    0.5 * df['phytoplankton']              # Phytoplankton traps plastic
) + np.random.normal(0, 10, num_samples)

df['carbon_sequestration'] = (
    1.5 * df['phytoplankton'] +            # Phytoplankton absorbs CO2
    0.8 * df['dissolved_oxygen'] +         # Oxygen indicates healthy ecosystems
    -0.3 * df['plastic_concentration']     # Plastic harms carbon capture
) + np.random.normal(0, 8, num_samples)

# Save to CSV
df[['latitude', 'longitude', 'month', 'sea_surface_temp', 'salinity', 'ph', 
    'pollution_nearby', 'current_speed', 'plastic_concentration', 'phytoplankton',
    'dissolved_oxygen', 'coral_health', 'plastic_accumulation', 
    'carbon_sequestration']].to_csv('synthetic_ocean_data.csv', index=False)

# Split into individual datasets for clarity
df[['latitude', 'longitude', 'month', 'sea_surface_temp', 'salinity', 'ph', 
    'coral_health']].to_csv('coral_reef_data.csv', index=False)

df[['latitude', 'longitude', 'month', 'current_speed', 'plastic_concentration', 
    'plastic_accumulation']].to_csv('plastic_data.csv', index=False)

df[['latitude', 'longitude', 'month', 'phytoplankton', 'dissolved_oxygen', 
    'carbon_sequestration']].to_csv('carbon_data.csv', index=False)
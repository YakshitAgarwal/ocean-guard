# -*- coding: utf-8 -*-
# app.py - Main dashboard application for Ocean Health Intelligence Platform

import dash
from dash import dcc, html, Input, Output, State, callback
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

# Import our custom modules
from data_fetcher import SatelliteDataFetcher
from predictor import OceanHealthPredictor

# Initialize the Dash app with a dark theme
app = dash.Dash(
    __name__, 
    external_stylesheets=[dbc.themes.DARKLY],
    assets_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
)

app.title = "Ocean Health Intelligence System"

# Dashboard Layout
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col(html.H1("🌊 Ocean Health Intelligence Platform", 
                       className="text-center mb-4"), width=12)
    ]),
    
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Live Ocean Metrics", className="h5"),
                dbc.CardBody([
                    dcc.Graph(id='live-ocean-map', 
                             style={'height': '400px'}),
                    dcc.Interval(id='map-update', interval=60*1000)
                ])
            ], className="mb-4")
        ], width=8),
        
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Prediction Controls", className="h5"),
                dbc.CardBody([
                    dbc.InputGroup([
                        dbc.InputGroupText("Latitude"),
                        dbc.Input(id='latitude', type='number', value=20.5)
                    ], className="mb-3"),
                    
                    dbc.InputGroup([
                        dbc.InputGroupText("Longitude"),
                        dbc.Input(id='longitude', type='number', value=-157.8)
                    ], className="mb-3"),
                    
                    dbc.Button("Run Analysis", id='predict-btn', 
                              color="primary", className="w-100")
                ])
            ]),
            
            dbc.Card([
                dbc.CardHeader("Health Indicators", className="h5"),
                dbc.CardBody([
                    dbc.Row([
                        dbc.Col([
                            html.Div(id='coral-health', 
                                    className="health-indicator coral")
                        ]),
                        dbc.Col([
                            html.Div(id='plastic-risk', 
                                    className="health-indicator plastic")
                        ])
                    ]),
                    dcc.Graph(id='carbon-gauge', 
                             config={'staticPlot': False})
                ])
            ], className="mt-4")
        ], width=4)
    ]),
    
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardHeader("Historical Trends", className="h5"),
                dbc.CardBody([
                    dcc.Graph(id='historical-trend'),
                    dcc.Dropdown(id='metric-selector',
                                options=[
                                    {'label': 'Coral Health', 'value': 'coral'},
                                    {'label': 'Plastic Risk', 'value': 'plastic'},
                                    {'label': 'Carbon Capacity', 'value': 'carbon'}
                                ],
                                value='coral')
                ])
            ])
        ], width=12)
    ], className="mt-4")
], fluid=True)

# ======================================
# CALLBACKS & INTERACTIVITY
# ======================================

@app.callback(
    Output('live-ocean-map', 'figure'),
    Input('map-update', 'n_intervals')
)
def update_live_map(n):
    """Update the live ocean map"""
    try:
        fetcher = SatelliteDataFetcher()
        img = fetcher.fetch_nasa_ocean_data()
        
        fig = px.imshow(
            img, 
            title="Live Sea Surface Temperature",
            color_continuous_scale='thermal'
        )
        fig.update_layout(
            coloraxis_showscale=False,
            margin=dict(l=0, r=0, t=30, b=0)
        )
        return fig
    except Exception as e:
        print(f"Error updating map: {e}")
        # Return empty figure as fallback
        return go.Figure().update_layout(
            title="Error loading map data",
            annotations=[
                dict(
                    text="Map data unavailable",
                    showarrow=False,
                    xref="paper",
                    yref="paper",
                    x=0.5,
                    y=0.5
                )
            ]
        )

@app.callback(
    [Output('coral-health', 'children'),
     Output('plastic-risk', 'children'),
     Output('carbon-gauge', 'figure')],
    [Input('predict-btn', 'n_clicks')],
    [State('latitude', 'value'),
     State('longitude', 'value')]
)
def update_predictions(n_clicks, lat, lon):
    """Update the prediction indicators based on location"""
    if n_clicks is None or not all([lat, lon]):
        # Default values for initial load
        return (
            "N/A",
            "N/A",
            go.Figure(go.Indicator(
                mode="gauge+number",
                value=0,
                domain={'x': [0, 1], 'y': [0, 1]},
                title={'text': "Carbon Capacity (tons)"},
                gauge={'axis': {'range': [0, 100]}}
            ))
        )
    
    # Get real-time data (simulated)
    simulated_data = {
        'sea_surface_temp': np.random.uniform(20, 30),
        'chlorophyll': np.random.uniform(0.1, 5.0),
        'plastic_concentration': np.random.uniform(0, 1000),
        'current_speed': np.random.uniform(0, 2),
        'ph': np.random.uniform(7.5, 8.4),
        'dissolved_oxygen': np.random.uniform(4, 9)
    }
    
    try:
        predictor = OceanHealthPredictor()
        processed_data = predictor.preprocess_data(simulated_data)
        predictions = predictor.predict(processed_data)
        
        # Create gauge for carbon sequestration
        carbon_gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = predictions['carbon_capacity'] * 100,  # Scale to percentage
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Carbon Capacity (tons)"},
            gauge = {
                'axis': {'range': [0, 100]},
                'steps': [
                    {'range': [0, 40], 'color': "red"},
                    {'range': [40, 80], 'color': "yellow"},
                    {'range': [80, 100], 'color': "green"}
                ],
                'bar': {'color': "darkblue"}
            }
        ))
        
        carbon_gauge.update_layout(
            height=250,
            margin=dict(l=20, r=20, t=50, b=20)
        )
        
        return (
            f"{predictions['coral_health'] * 100:.1f}% Healthy",
            f"{predictions['plastic_risk'] * 10:.1f} Risk Score",
            carbon_gauge
        )
    except Exception as e:
        print(f"Error in predictions: {e}")
        return "Error", "Error", go.Figure()

@app.callback(
    Output('historical-trend', 'figure'),
    Input('metric-selector', 'value')
)
def update_trends(metric):
    """Update the historical trend graph based on selected metric"""
    # Generate random data for demonstration
    dates = pd.date_range(end=datetime.today(), periods=30).tolist()
    
    if metric == 'coral':
        title = "Historical Coral Health Trend"
        values = np.random.normal(70, 10, 30)  # Higher values are better
        color = "green"
    elif metric == 'plastic':
        title = "Historical Plastic Risk Trend"
        values = np.random.normal(30, 15, 30)  # Lower values are better
        color = "red" 
    else:  # carbon
        title = "Historical Carbon Capacity Trend"
        values = np.random.normal(60, 12, 30)
        color = "blue"
    
    # Add some trend to make it look more realistic
    trend = np.linspace(-5, 5, 30)
    values = values + trend
    
    fig = px.line(
        x=dates, 
        y=values, 
        title=title,
        labels={"x": "Date", "y": "Score"}
    )
    
    fig.update_traces(line_color=color)
    
    fig.update_layout(
        xaxis_title="Date",
        yaxis_title="Score",
        hovermode="x unified"
    )
    
    return fig

# ======================================
# MAIN APPLICATION ENTRY POINT
# ======================================

if __name__ == '__main__':
    print("Starting Ocean Health Intelligence Platform...")
    print("Make sure you've run create_dummy_models.py first!")
    app.run_server(debug=True, port=8050)

# -*- coding: utf-8 -*-
# data_fetcher.py - Handles satellite and ocean data retrieval

import requests
import io
from PIL import Image
import xarray as xr
from datetime import datetime

class SatelliteDataFetcher:
    def __init__(self):
        self.nasa_gibs_url = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
        self.cmems_username = "sroy9"  # Note: These are placeholder credentials
        self.cmems_password = "SRoy@2006"  # In production, use environment variables
        
    def fetch_nasa_ocean_data(self, layer='MODIS_Aqua_L3_SST_MidIR_9km_Night_8Day'):
        """Fetch NASA ocean data images"""
        params = {
            "LAYERS": layer,
            "FORMAT": "image/png",
            "SERVICE": "WMS",
            "VERSION": "1.1.1",
            "REQUEST": "GetMap",
            "SRS": "EPSG:4326",
            "BBOX": "-180,-90,180,90",
            "WIDTH": "1024",
            "HEIGHT": "512",
            "TIME": datetime.today().strftime('%Y-%m-%d')
        }
        
        try:
            response = requests.get(self.nasa_gibs_url, params=params)
            response.raise_for_status()  # Check if request was successful
            return Image.open(io.BytesIO(response.content))
        except requests.exceptions.RequestException as e:
            print(f"Error fetching NASA data: {e}")
            # Return a blank image as fallback
            return Image.new('RGB', (1024, 512), color='black')
    
    def fetch_cmems_data(self):
        """Fetch Copernicus Marine Service data"""
        dataset_id = "cmems_mod_glo_phy_my_0.083_P1D-m"
        
        try:
            response = requests.get(
                f"https://data.marine.copernicus.eu/products/{dataset_id}/download",
                auth=(self.cmems_username, self.cmems_password)
            )
            response.raise_for_status()
            return xr.open_dataset(io.BytesIO(response.content))
        except requests.exceptions.RequestException as e:
            print(f"Error fetching CMEMS data: {e}")
            # Return None as fallback
            return None
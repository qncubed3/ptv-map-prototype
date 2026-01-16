# PTV Vehicle Tracker
A prototype web application that displays live locations of Public Transport Victoria (PTV) vehicles (trains, trams, buses) on an interactive map. This is a small scale, severless system, using AWS Lambda (Python) as a lightweight backend to fetch and transform live data from the PTV API. The frontend is created with vanilla JavaScript which fetches the data from Lambda, and visualised with the Mapbox API.

## Features
- Live tracking of trains, trams, buses
- Interactive map with service information for each vehicle
- Severless backend using AWS Lambda
- Secure handling of API keys (never exposed to client)

## Backend (AWS Lambda - Python)
- Authentication with PTV API
- Fetches data on all available vehicles for each route
- Transforms and normalises into a clean JSON format for the frontend

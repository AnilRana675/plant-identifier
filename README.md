# Plant Identifier App

A modern React app to identify plants from photos and provide practical agricultural guides using Plant.id, Pl@ntNet, and Gemini APIs.

## Features
- Upload or capture a plant photo using your device's camera
- Identifies plant using Plant.id and Pl@ntNet APIs
- Combines results and generates an agricultural guide with Gemini
- Agricultural info is categorized: Cultivation, Care & Maintenance, Harvesting, Growth Info, Common Issues
- Clean, modern UI with tabbed results and error handling

## Getting Started

### Prerequisites
- Node.js and npm installed
- API keys for Plant.id, Pl@ntNet, and Gemini

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AnilRana675/plant-identifier.git
   cd plant-identifier
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your API keys to a `.env` file in the `plant-identifier` directory:
   ```env
   REACT_APP_GEMINI_API_KEY="your-gemini-api-key"
   REACT_APP_PLANT_ID_API_KEY="your-plant-id-api-key"
   REACT_APP_PLANTNET_API_KEY="your-plantnet-api-key"
   ```

### Running the App
```bash
npm start
```
The app will open in your browser at `http://localhost:3000`.

## Usage
1. Click "Open Camera" to capture or upload a plant photo.
2. Click "Identify Plant" to start identification.
3. View results in tabs: Name, Agricultural Info, Error.

## API References
- [Plant.id API](https://web.plant.id/api/)
- [Pl@ntNet API](https://my.plantnet.org/)
- [Gemini API](https://ai.google.dev/)

## License
MIT

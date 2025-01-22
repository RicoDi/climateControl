import { useState } from 'react';

export default function SensorForm() {
  const [humidityIn, setHumidityIn] = useState('');
  const [temperatureIn, setTemperatureIn] = useState('');
  const [humidityOut, setHumidityOut] = useState('');
  const [temperatureOut, setTemperatureOut] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [latestData, setLatestData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to the API route
    const response = await fetch('/api/sensor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture }),
    });

    const result = await response.json();
    console.log(result.message);
    fetchLatestData(); // Fetch the latest data after submission
  };

  const fetchLatestData = async () => {
    // Fetch the latest sensor data
    const response = await fetch('/api/sensor');
    const data = await response.json();
    setLatestData(data);
  };

  return (
    <div>
      <h1>Sensor Data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Humidity In:
          <input type="number" value={humidityIn} onChange={(e) => setHumidityIn(e.target.value)} />
        </label>
        <label>
          Temperature In:
          <input type="number" value={temperatureIn} onChange={(e) => setTemperatureIn(e.target.value)} />
        </label>
        <label>
          Humidity Out:
          <input type="number" value={humidityOut} onChange={(e) => setHumidityOut(e.target.value)} />
        </label>
        <label>
          Temperature Out:
          <input type="number" value={temperatureOut} onChange={(e) => setTemperatureOut(e.target.value)} />
        </label>
        <label>
          Soil Moisture:
          <input type="number" value={soilMoisture} onChange={(e) => setSoilMoisture(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>

      {latestData && (
        <div>
          <h2>Latest Sensor Data:</h2>
          <pre>{JSON.stringify(latestData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

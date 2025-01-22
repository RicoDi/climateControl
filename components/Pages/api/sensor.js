import mysql from 'mysql2';

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'sensor_user',
  password: 'me3Hh2FaBt',
  database: 'sensor_data',
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    // POST request - Insert data into the database
    const { humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture } = req.body;

    const query = 'INSERT INTO data (humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'New record created successfully' });
      }
    });
  } else if (req.method === 'GET') {
    // GET request - Retrieve the latest record from the database
    const query = 'SELECT * FROM data ORDER BY id DESC LIMIT 1';

    db.execute(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.length > 0) {
          const latestData = results[0];
          res.status(200).json({
            temperatureIn: latestData.temperatureIn,
            humidityIn: latestData.humidityIn,
            temperatureOut: latestData.temperatureOut,
            humidityOut: latestData.humidityOut,
            soilMoisture: latestData.soilMoisture,
          });
        } else {
          res.status(200).json({});
        }
      }
    });
  } else {
    // If method is not GET or POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

import { useState, useEffect } from "react";
import axios from "axios";

export default function SensorData({ token }) {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sensors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (err) {
      console.error("Ошибка загрузки данных", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Загрузка данных...</p>;

  return (
    <div>
      <h2>Данные с датчиков</h2>
      <p><strong>Внутри:</strong> Температура: {data.temperatureIn}°C, Влажность: {data.humidityIn}%</p>
      <p><strong>Снаружи:</strong> Температура: {data.temperatureOut}°C, Влажность: {data.humidityOut}%</p>
      <p><strong>Влажность почвы:</strong> {data.soilMoisture}%</p>
    </div>
  );
}

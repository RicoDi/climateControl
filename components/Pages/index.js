import { useState, useEffect } from "react";

export default function Home() {
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функція для отримання даних
  const fetchLatestData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      setLatestData(data);
      setLoading(false);
    } catch (error) {
      console.error("Помилка отримання даних:", error);
      setLoading(false);
    }
  };

  // Завантаження даних при завантаженні сторінки
  useEffect(() => {
    fetchLatestData(); // Одразу отримуємо дані
    const interval = setInterval(fetchLatestData, 10000); // Оновлення кожні 10 секунд
    return () => clearInterval(interval); // Очищення інтервалу при виході зі сторінки
  }, []);

  return (
    <div>
      <h1>Останні дані від ESP8266</h1>
      {loading ? (
        <p>Завантаження...</p>
      ) : latestData ? (
        <div>
          <p><strong>Час:</strong> {new Date(latestData.timestamp).toLocaleString()}</p>
          <p><strong>Вологість всередині:</strong> {latestData.humidityIn}</p>
          <p><strong>Температура всередині:</strong> {latestData.temperatureIn}</p>
          <p><strong>Вологість зовні:</strong> {latestData.humidityOut}</p>
          <p><strong>Температура зовні:</strong> {latestData.temperatureOut}</p>
          <p><strong>Вологість ґрунту:</strong> {latestData.soilMoisture}</p>
        </div>
      ) : (
        <p>Дані відсутні.</p>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [espData, setEspData] = useState(null);
  const [fanState, setFanState] = useState(false); // false - вентилятор вимкнений, true - увімкнений
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Функція для отримання даних із Node.js
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setEspData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  
   // Функція для керування вентилятором
   const toggleFan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/fan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fanState: fanState ? 0 : 1 }), // Відправляємо новий стан
      });

      if (!response.ok) {
        throw new Error("Помилка відправки команди");
      }

      const data = await response.json();
      console.log(data.message);
      setFanState(!fanState); // Оновлюємо стан вентилятора
    } catch (err) {
      console.error("Помилка:", err);
      setError("Не вдалося оновити стан вентилятора");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div><>
      <h1>ESP8266 Data Viewer</h1>
      {espData ? (
        <pre>{JSON.stringify(espData.data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
      </>
      <>
      <div>
      <h1>Управління вентилятором</h1>
      <button onClick={toggleFan} disabled={loading}>
        {loading ? "Оновлення..." : fanState ? "Вимкнути вентилятор" : "Увімкнути вентилятор"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
      </>
    </div>
    
  );
}

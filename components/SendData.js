import { useState } from 'react';

export default function SendData() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const sendData = async () => {
    setLoading(true);

    try {
      const data = {
        humidityIn: 45.5,
        temperatureIn: 22.3,
        humidityOut: 48.0,
        temperatureOut: 20.1,
        soilMoisture: 60,
      };

      const res = await fetch('/api/sendData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Ошибка:', error);
      setResponse({ message: 'Ошибка при отправке данных' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendData} disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить данные'}
      </button>

      {response && (
        <div>
          <h3>Ответ сервера:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

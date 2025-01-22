import https from 'https';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture } = req.body;

    // Проверка полученных данных
    if (!humidityIn || !temperatureIn || !humidityOut || !temperatureOut || !soilMoisture) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    // Данные для отправки на внешний сервер
    const postData = new URLSearchParams({
      humidityIn,
      temperatureIn,
      humidityOut,
      temperatureOut,
      soilMoisture,
    }).toString();

    // Настройка HTTPS-запроса
    const options = {
      hostname: 'localhost',
      path: '/data.php',
      method: 'POST',
      port: 443,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
      ca: [ /* Вставьте сюда ваш PEM-сертификат */ ],
    };

    const request = https.request(options, (serverRes) => {
      let data = '';

      // Чтение ответа сервера
      serverRes.on('data', (chunk) => {
        data += chunk;
      });

      serverRes.on('end', () => {
        res.status(200).json({ message: 'Данные отправлены', response: data });
      });
    });

    request.on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при отправке данных', error: error.message });
    });

    // Отправка данных
    request.write(postData);
    request.end();
  } else {
    res.status(405).json({ message: 'Метод не поддерживается' });
  }
}

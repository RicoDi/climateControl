require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const morgan = require("morgan");

const app = express();
const serverIp = '185.252.24.105';  // Используйте реальный IP вашего сервера
const port = 3000;

// Подключение к базе данных MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Подключение к MySQL успешно!");
});
//Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

// Логируем все запросы с помощью morgan
app.use(morgan('combined'));  // Можно заменить на 'dev' или другие форматы


// Логируем запросы
app.use((req, res, next) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  console.log('Заголовки:', req.headers);
  console.log('Тело запроса:', req.body);
  next();
});

// Секретный ключ для JWT
const jwtSecret = process.env.JWT_SECRET || "my_secret_key";

// Маршрут для авторизации
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Необходимы оба поля: username и password" });
  }
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
    return res.status(200).json({ message: "Успешный вход", token });
  }
  res.status(401).json({ message: "Неверные данные" });
});

// Middleware для проверки токена
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Нет токена" });

  jwt.verify(token.split(" ")[1], jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Неверный токен" });
    req.user = user;
    next();
  });
}

// Получение последнего состояния из базы данных
app.get("/data", verifyToken, (req, res) => {
  const query = "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка базы данных" });
    res.status(200).json(results[0]);
  });
});

// Сохранение новых данных в базу
app.post("/data", verifyToken, (req, res) => {
  const { temperatureIn, humidityIn, temperatureOut, humidityOut, soilMoisture } = req.body;
  if (!temperatureIn || !humidityIn || !temperatureOut || !humidityOut || !soilMoisture) {
    return res.status(400).json({ message: "Все поля должны быть заполнены" });
  }

  const query = "INSERT INTO sensor_data (temperatureIn, humidityIn, temperatureOut, humidityOut, soilMoisture) VALUES (?, ?, ?, ?, ?)";
  const values = [temperatureIn, humidityIn, temperatureOut, humidityOut, soilMoisture];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);  // Логируем ошибку
      return res.status(500).json({ error: "Ошибка сохранения данных" });
    }
    console.log('Данные успешно сохранены');
    res.status(201).json({ message: "Данные успешно сохранены" });
  });
  });

// Управление вентиляторами
app.post("/fan", verifyToken, async (req, res) => {
  const { fanState } = req.body;

  if (fanState !== 1 && fanState !== 0) {
    return res.status(400).json({ message: "Неверное состояние вентилятора" });
  }

  try {
    const response = await axios.post("http://ESP8266_IP/setFan", { fanState });
    res.status(200).json({ message: "Команда отправлена", response: response.data });
  } catch (error) {
    res.status(500).json({ error: "Ошибка отправки команды на ESP" });
  }
});

// Запуск сервера
app.listen(port, '0.0.0.0', () => {  // Ожидается, что сервер будет доступен по любому IP
  console.log(`Сервер запущен на http://localhost:${port}`);
});
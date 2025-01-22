import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

// Секретний ключ для JWT
const JWT_SECRET = "your_secret_key"; // Замініть на ваш секретний ключ

// Конфігурація бази даних
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "smart_greenhouse",
});

// Ендпоінт для реєстрації
app.post(
  "/api/register",
  [
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword]
      );

      res.status(201).json({ message: "Користувача створено" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка сервера" });
    }
  }
);

// Ендпоінт для входу
app.post(
  "/api/login",
  [body("username").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const [rows] = await db.query(
        "SELECT id, username, password FROM users WHERE username = ?",
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: "Невірний логін або пароль" });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Невірний логін або пароль" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка сервера" });
    }
  }
);

// Старт сервера
app.listen(3000, () => {
  console.log("Сервер запущено на порту 3000");
});

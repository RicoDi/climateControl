import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Підключення до бази даних
      const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "esp_data",
      });

      // Запит для отримання останнього запису
      const [rows] = await db.execute("SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1");
      await db.end();

      // Повертаємо дані клієнту
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ message: "Дані відсутні." });
      }
    } catch (error) {
      console.error("Помилка отримання даних з MySQL:", error);
      res.status(500).json({ message: "Помилка сервера" });
    }
  } else {
    res.status(405).json({ message: "Метод не дозволено" });
  }
}

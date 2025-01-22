import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { fanState } = req.body;

      if (fanState === undefined) {
        return res.status(400).json({ message: "Стан вентилятора не вказано" });
      }

      // Надсилаємо команду на ESP8266
      const espUrl = "http://<ESP_IP_ADDRESS>/setFan"; // Заміни <ESP_IP_ADDRESS> на IP адресу ESP8266
      const response = await fetch(espUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fanState }),
      });

      if (response.ok) {
        return res.status(200).json({ message: "Команда успішно надіслана" });
      } else {
        return res.status(response.status).json({ message: "Помилка на ESP8266" });
      }
    } catch (error) {
      console.error("Помилка відправки команди:", error);
      return res.status(500).json({ message: "Помилка сервера" });
    }
  } else {
    res.status(405).json({ message: "Метод не дозволено" });
  }
}

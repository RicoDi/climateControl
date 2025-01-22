export default function handler(req, res) {
    const { username, password } = req.body;
  
    if (username === "admin" && password === "password") {
      const token = "your-jwt-token"; // Здесь используйте генерацию JWT
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Неверный логин или пароль" });
    }
  }
  
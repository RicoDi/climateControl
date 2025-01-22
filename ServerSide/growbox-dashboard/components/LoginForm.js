import { useState } from "react";
import axios from "axios";

export default function LoginForm({ setIsAuthenticated, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth", { username, password });
      setToken(response.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Ошибка авторизации. Проверьте логин или пароль.");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

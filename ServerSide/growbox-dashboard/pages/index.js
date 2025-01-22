import { useState } from "react";
import LoginForm from "../components/LoginForm";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  return (
    <div>
      <h1>Гроубокс: Управление и мониторинг</h1>
      {!isAuthenticated ? (
        <LoginForm setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
      ) : (
        <Dashboard token={token} />
      )}
    </div>
  );
}

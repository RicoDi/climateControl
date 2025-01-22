import { useState, useEffect } from "react";
import SensorData from "./SensorData";
import axios from "axios";

export default function Dashboard({ token }) {
  const [fanState, setFanState] = useState(false);

  const toggleFan = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/fan",
        { fanState: fanState ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFanState(response.data.fanState === 1);
    } catch (err) {
      console.error("Ошибка управления вентилятором", err);
    }
  };

  return (
    <div>
      <SensorData token={token} />
      <h2>Управление вентилятором</h2>
      <button onClick={toggleFan}>
        {fanState ? "Выключить вентилятор" : "Включить вентилятор"}
      </button>
    </div>
  );
}

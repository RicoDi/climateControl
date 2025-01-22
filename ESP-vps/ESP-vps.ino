#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char *ssid = "****";
const char *password = "****";

ESP8266WebServer server(80);

String arduinoData = ""; // Буфер для данных от Mega

void setup() {
  Serial.begin(115200); // Для связи с Mega
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi подключен!");
  Serial.println("IP адрес: " + WiFi.localIP());

  server.on("/getData", HTTP_GET, handleGetData);
  server.on("/setFan", HTTP_POST, handleSetFan);

  server.begin();
  Serial.println("HTTP сервер запущен!");
}

void loop() {
  server.handleClient();
  receiveDataFromMega();
}

void receiveDataFromMega() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      Serial.println("Данные от Mega: " + arduinoData);
      arduinoData = "";
    } else {
      arduinoData += c;
    }
  }
}

void handleGetData() {
  server.send(200, "application/json", "{\"data\":\"" + arduinoData + "\"}");
}

void handleSetFan() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    if (body.indexOf("\"fanState\":1") != -1) {
      Serial.println("FAN_OUT_ON"); // Отправка команды Mega
      server.send(200, "application/json", "{\"message\":\"Вентилятор включен\"}");
    } else if (body.indexOf("\"fanState\":0") != -1) {
      Serial.println("FAN_OUT_OFF"); // Отправка команды Mega
      server.send(200, "application/json", "{\"message\":\"Вентилятор выключен\"}");
    } else {
      server.send(400, "application/json", "{\"message\":\"Некорректный запрос\"}");
    }
  } else {
    server.send(400, "application/json", "{\"message\":\"Нет данных\"}");
  }
}

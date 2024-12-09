#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

// Wi-Fi конфигурация
const char *ssid = "****";  
const char *password = "****";

// Глобальные переменные
float humidityIn, temperatureIn, humidityOut, temperatureOut;
int soilMoisture;

// Переменные для отслеживания времени отправки данных
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000; // Интервал отправки данных (5 секунд)

void connectToWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Подключение к Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi подключен!");
  Serial.print("IP адрес: ");
  Serial.println(WiFi.localIP());
}

// Функция для разделения строки по разделителю
String splitString(String data, char separator, int index) {
    int found = 0, strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i + 1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void setup() {
  Serial.begin(115200); // Для связи с Arduino
  connectToWifi();
}

void loop() {
  // Проверка данных от Arduino
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n'); // Чтение до символа новой строки
    if (msg.length() > 0) {
      // Разбор данных
      humidityIn = splitString(msg, ';', 0).toFloat();
      temperatureIn = splitString(msg, ';', 1).toFloat();
      humidityOut = splitString(msg, ';', 2).toFloat();
      temperatureOut = splitString(msg, ';', 3).toFloat();
      soilMoisture = splitString(msg, ';', 4).toInt();
      
      // Проверка на валидность данных
      if (isnan(humidityIn) || isnan(temperatureIn) || 
          isnan(humidityOut) || isnan(temperatureOut) || soilMoisture < 0) {
        Serial.println("Ошибка: получены некорректные данные.");
        return; // Пропустить отправку на сервер
      }

      // Отправка данных на сервер (но только если прошло достаточно времени)
      unsigned long currentMillis = millis();
      if (currentMillis - lastSendTime >= sendInterval) {
        sendDataToServer();
        lastSendTime = currentMillis;  // Обновляем время последней отправки
      }
    } else {
      Serial.println("Ошибка: пустое сообщение от Arduino.");
    }
  }

  // Проверка подключения к Wi-Fi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi отключен. Переподключение...");
    connectToWifi();
  }
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client; // Создание WiFi-клиента
    HTTPClient http;

    // Подготовка данных для отправки
    String postData = "humidityIn=" + String(humidityIn) +
                      "&temperatureIn=" + String(temperatureIn) +
                      "&humidityOut=" + String(humidityOut) +
                      "&temperatureOut=" + String(temperatureOut) +
                      "&soilMoisture=" + String(soilMoisture);

    // Настройка HTTP-запроса
    http.begin(client, "your.website");
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Отправка данных
    int httpCode = http.POST(postData);

    // Проверка результата
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println("Ответ сервера: " + payload);
    } else {
      Serial.print("Ошибка HTTP: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end(); // Завершение соединения
  } else {
    Serial.println("Ошибка: нет подключения к Wi-Fi.");
  }
}

#include <DHT.h>

#define DHTPIN_INSIDE A1 // Датчик внутри гроубокса
#define DHTPIN_OUTSIDE A2 // Датчик снаружи
#define DHTTYPE DHT11

#define SOIL_MOISTURE_PIN A3 // Датчик влажности почвы

DHT dhtInside(DHTPIN_INSIDE, DHTTYPE);
DHT dhtOutside(DHTPIN_OUTSIDE, DHTTYPE);

float humidityIn = 0, temperatureIn = 0;
float humidityOut = 0, temperatureOut = 0;
int soilMoisture = 0;

String kirim = "";

unsigned long previousMillis = 0;
const unsigned long interval = 1000; // Интервал в миллисекундах

void setup() {
  Serial.begin(9600);    // Для отладки
  Serial3.begin(115200); // Для связи с ESP8266
  dhtInside.begin();
  dhtOutside.begin();
  kirim.reserve(64); // Резервируем память для строки
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Считываем данные с датчиков
    readSensors();

    // Подготавливаем строку для отправки
    prepareData();

    // Отправляем данные на ESP8266
    sendData();

    // Проверяем и выводим ответ от ESP
    checkESPResponse();
  }
}

void readSensors() {
  humidityIn = dhtInside.readHumidity();
  temperatureIn = dhtInside.readTemperature();
  humidityOut = dhtOutside.readHumidity();
  temperatureOut = dhtOutside.readTemperature();
  
  // Чтение влажности почвы с усреднением и калибровкой
  int soilMoistureRaw = readSoilMoisture();
  soilMoisture = map(soilMoistureRaw, 300, 700, 0, 100); // Калибровка
  soilMoisture = constrain(soilMoisture, 0, 100); // Ограничиваем диапазон

  // Проверяем данные на ошибки
  if (isnan(humidityIn) || isnan(temperatureIn)) {
    Serial.println("Ошибка чтения датчика внутри!");
    humidityIn = 0;
    temperatureIn = 0;
  }
  if (isnan(humidityOut) || isnan(temperatureOut)) {
    Serial.println("Ошибка чтения датчика снаружи!");
    humidityOut = 0;
    temperatureOut = 0;
  }
}

void prepareData() {
  kirim = String(humidityIn) + ";" +
          String(temperatureIn) + ";" +
          String(humidityOut) + ";" +
          String(temperatureOut) + ";" +
          String(soilMoisture) + "."; // Добавляем влажность почвы в данные
}

void sendData() {
  Serial3.println(kirim);
  Serial.println("Данные отправлены: " + kirim);
}

void checkESPResponse() {
  if (Serial3.available()) {
    String msg = Serial3.readStringUntil('\n'); // Читаем до символа новой строки
    Serial.println("Ответ от ESP: " + msg);
    // Вы можете добавить здесь логику для обработки ответа
  }
}

int readSoilMoisture() {
  int total = 0;
  for (int i = 0; i < 10; i++) { // Считываем 10 значений для усреднения
    total += analogRead(SOIL_MOISTURE_PIN);
    delay(10); // Небольшая задержка для стабилизации
  }
  return total / 10; // Возвращаем усредненное значение
}

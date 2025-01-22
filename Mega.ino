#include <DHT.h>

#define DHTPIN_INSIDE A1  // Датчик внутри гроубокса
#define DHTPIN_OUTSIDE A2 // Датчик снаружи
#define DHTTYPE DHT11

#define SOIL_MOISTURE_PIN A3 // Датчик влажности почвы
#define FAN_IN_PIN 22         // Входной вентилятор
#define FAN_OUT_PIN 23        // Выходной вентилятор

DHT dhtInside(DHTPIN_INSIDE, DHTTYPE);
DHT dhtOutside(DHTPIN_OUTSIDE, DHTTYPE);

float humidityIn = 0, temperatureIn = 0;
float humidityOut = 0, temperatureOut = 0;
int soilMoisture = 0;

String incomingCommand = ""; // Для команд от ESP
unsigned long previousMillis = 0;
const unsigned long interval = 1000;

void setup() {
  Serial3.begin(115200); // Для связи с ESP8266
  Serial.begin(9600);    // Для отладки

  dhtInside.begin();
  dhtOutside.begin();

  pinMode(FAN_IN_PIN, OUTPUT);
  pinMode(FAN_OUT_PIN, OUTPUT);
  digitalWrite(FAN_IN_PIN, LOW);
  digitalWrite(FAN_OUT_PIN, LOW);
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Считываем данные с датчиков
    readSensors();

    // Отправляем данные на ESP
    sendDataToESP();
  }

  // Читаем команды от ESP
  if (Serial3.available()) {
    incomingCommand = Serial3.readStringUntil('\n');
    handleCommand(incomingCommand);
  }
}

void readSensors() {
  humidityIn = dhtInside.readHumidity();
  temperatureIn = dhtInside.readTemperature();
  humidityOut = dhtOutside.readHumidity();
  temperatureOut = dhtOutside.readTemperature();

  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  soilMoisture = map(soilMoistureRaw, 300, 700, 0, 100);
  soilMoisture = constrain(soilMoisture, 0, 100);
}

void sendDataToESP() {
  String data = String(humidityIn) + ";" + String(temperatureIn) + ";" +
                String(humidityOut) + ";" + String(temperatureOut) + ";" +
                String(soilMoisture) + ".";
  Serial3.println(data);
  Serial.println("Отправлено на ESP: " + data);
}

void handleCommand(String command) {
  if (command == "FAN_IN_ON") {
    digitalWrite(FAN_IN_PIN, HIGH);
    Serial.println("Включен входной вентилятор");
  } else if (command == "FAN_IN_OFF") {
    digitalWrite(FAN_IN_PIN, LOW);
    Serial.println("Выключен входной вентилятор");
  } else if (command == "FAN_OUT_ON") {
    digitalWrite(FAN_OUT_PIN, HIGH);
    Serial.println("Включен выходной вентилятор");
  } else if (command == "FAN_OUT_OFF") {
    digitalWrite(FAN_OUT_PIN, LOW);
    Serial.println("Выключен выходной вентилятор");
  }
}

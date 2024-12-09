Arduino and ESP8266 Climate Monitoring System
This project involves two main components: an Arduino that collects environmental data from various sensors and an ESP8266 that transmits this data to a remote server. The sensors measure parameters like temperature, humidity, and soil moisture. The data is sent at regular intervals and processed by a server for further analysis.

Components:
1. Arduino (or compatible board)
2. ESP8266 Wi-Fi module
3. DHT11 Temperature and Humidity Sensors
4. Soil Moisture Sensor
5. Wi-Fi Router

Arduino Code (Sensor Data Collection)
This code runs on the Arduino and is responsible for reading data from the following sensors:

-DHT11 inside the grow box (temperature and humidity)
-DHT11 outside the grow box (temperature and humidity)
-Soil Moisture Sensor

It then formats the collected data into a string and sends it to the ESP8266 via serial communication.

Features:
-Reads temperature and humidity data from two DHT11 sensors (inside and outside the grow box).
-Reads soil moisture data from the soil moisture sensor.
-Performs basic error checking and handling for sensor failures.
-Sends sensor data in a formatted string via serial communication.

Key Functions:

readSensors(): Reads the data from the sensors and checks for errors.
prepareData(): Formats the sensor data into a string to be sent to the ESP8266.
sendData(): Sends the formatted data to the ESP8266.
checkESPResponse(): Checks and prints any response from the ESP8266.

ESP8266 Code (Wi-Fi Data Transmission)
This code runs on the ESP8266 module and is responsible for:
-Connecting to a Wi-Fi network.
-Receiving sensor data from the Arduino.
-Sending the data to a remote server via HTTP POST.

Features:
Connects to a specified Wi-Fi network.
Reads the sensor data from the Arduino via serial communication.
Validates the received data and ensures it's in the correct format.
Sends the validated data to a remote server every 5 seconds using an HTTP POST request.

Key Functions:

connectToWifi(): Connects the ESP8266 to the specified Wi-Fi network.
splitString(): Splits the received string from Arduino into individual sensor data components.
sendDataToServer(): Sends the sensor data to a remote server via an HTTP POST request.

Dependencies:

ESP8266WiFi: Required to connect the ESP8266 to Wi-Fi.
WiFiClient: Required to manage Wi-Fi connections.
ESP8266HTTPClient: Required for sending HTTP POST requests to the server.




Workflow

Arduino:
-Collects data from the sensors (temperature, humidity, and soil moisture).
-Sends the data to the ESP8266 via serial communication.

ESP8266:
-Receives the data from the Arduino.
-Validates the data and sends it to a remote server via HTTP POST every 5 seconds.

Remote Server:
-Receives and processes the sensor data for further analysis or storage.

Setup
Arduino:
  Upload the Arduino code to your Arduino board.
  Connect the DHT11 sensors and soil moisture sensor to the specified pins.
  Connect the Arduino to the ESP8266 via serial communication.

ESP8266:
  Upload the ESP8266 code to the module.
  Modify the Wi-Fi credentials (ssid and password) in the code to match your network.
  Ensure the ESP8266 is correctly wired to the Arduino for serial communication.

Server:
  Set up a server to handle HTTP POST requests.
  The server should be able to receive the data parameters (humidityIn, temperatureIn, humidityOut, temperatureOut, and soilMoisture). 

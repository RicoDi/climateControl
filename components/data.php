<?php
$servername = "localhost";
$username = "sensor_user";
$password = "me3Hh2FaBt";
$dbname = "sensor_data";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from POST request
    $humidityIn = $_POST['humidityIn'];
    $temperatureIn = $_POST['temperatureIn'];
    $humidityOut = $_POST['humidityOut'];
    $temperatureOut = $_POST['temperatureOut'];
    $soilMoisture = $_POST['soilMoisture'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO data (humidityIn, temperatureIn, humidityOut, temperatureOut, soilMoisture) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ddddd", $humidityIn, $temperatureIn, $humidityOut, $temperatureOut, $soilMoisture);

    // Execute the statement
    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

$stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request to retrieve the last record
    $sql = "SELECT * FROM data ORDER BY id DESC LIMIT 1"; // Get the latest record
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch the last record and return as JSON
        $row = $result->fetch_assoc();
        $data = [
            'temperatureIn' => $row['temperatureIn'],
            'humidityIn' => $row['humidityIn'],
            'temperatureOut' => $row['temperatureOut'],
            'humidityOut' => $row['humidityOut'],
            'soilMoisture' => $row['soilMoisture']
        ];
        echo json_encode($data);
    } else {
        // If no records are found
        echo json_encode([]);
    }
}

$conn->close();
?>
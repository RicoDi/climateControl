<?php
$conn = new mysqli("localhost","sensor_user","me3Hh2FaBt","climateControl");

// Check connection
if ($conn -> connect_errno) {
  echo "Failed to connect to MySQL: " . $conn -> connect_error;
  exit();
}

?>
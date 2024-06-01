<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sensorData = $_POST['sensor_data'];
    $timestamp = $_POST['timestamp'];

    // Insert sensor data into MySQL database
    $servername = "localhost";
    $username = "example_user";
    $password = "9Lesbians!";
    $dbname = "mydatabase";


    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        http_response_code(500); // Internal Server Error
        die("Database connection failed: " . $conn->connect_error);
    }

    // Get sensor data from POST request
    $sensorData = $_POST['sensor_data'];
    

    // Prepare SQL statement
    $sql = "INSERT INTO sensor_data (sensor_value) VALUES (?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        die("Error preparing SQL statement: " . $conn->error);
    }

    // Bind parameters and execute statement
    $stmt->bind_param("s", $sensorData);
    $result = $stmt->execute();

    if ($result === FALSE) {
        http_response_code(500); // Internal Server Error
        die("Error executing SQL statement: " . $stmt->error);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

    // Success response
    http_response_code(200); // OK
    echo "Sensor data inserted successfully";
} else {
    // Invalid request
    http_response_code(400); // Bad Request
    echo "Invalid request";
}
?>
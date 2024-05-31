<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$servername = "localhost";
$username = "example_user";
$password = "9Lesbians!";
$dbname = "mydatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

if (isset($_POST['reset'])) {
    // Delete all data from the table
    $deleteSql = "DELETE FROM sensor_data";
    if ($conn->query($deleteSql) === TRUE) {
        echo "All values deleted successfully";
    } else {
        echo "Error deleting values: " . $conn->error;
    }

    // Reset the auto-increment value for the id column
    $resetSql = "ALTER TABLE sensor_data AUTO_INCREMENT = 1";
    if ($conn->query($resetSql) === TRUE) {
        echo "ID reset successfully";
    } else {
        echo "Error resetting ID: " . $conn->error;
    }
}

echo "<form method='post'>";
echo "<input type='submit' name='reset' value='Reset'>";
echo "</form>";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from the database
$sql = "SELECT * FROM sensor_data";
$result = $conn->query($sql);

if ($result === FALSE) {
    echo "Error: " . $sql . "<br>" . $conn->error;
} elseif ($result->num_rows > 0) {
    // Output data of each row
    echo "<table border='1'><tr><th>ID</th><th>Sensor Value</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>".$row["id"]."</td><td>".$row["sensor_value"]."</td></tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}


$conn->close();
?>
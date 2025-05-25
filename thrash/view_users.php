<?php
$servername = "localhost";
$username = "example_user"; // Replace with your MySQL username
$password = "9Lesbians!"; // Replace with your MySQL password
$dbname = "mydatabase"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, name, email FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table border='1'>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
            </tr>";
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["id"]. "</td>
                <td>" . $row["name"]. "</td>
                <td>" . $row["email"]. "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}
$conn->close();
?>


<html>
  <head>
    <title>your_domain website</title>
  </head>
  <body>
    <h1>Hello World!</h1>

    <p>This is the landing page of <strong>your_domain</strong>.</p>

    <?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$servername = "localhost";
$username = "example_user";
$password = "9Lesbians!";
$dbname = "mydatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from the database
function fetchData() {
  global $conn;
  $sql = "SELECT * FROM sensor_data";
  $result = $conn->query($sql);

  if ($result === FALSE) {
    echo "Error: " . $sql . "<br>" . $conn->error;
  } elseif ($result->num_rows > 0) {
    // Output data of each row
    echo "<table border='1'><tr><th>ID</th><th>Sensor Value</th></tr>";
    $count = 0;
    while($row = $result->fetch_assoc()) {
      if ($count >= $result->num_rows - 3) {
        echo "<tr><td>".$row["id"]."</td><td>".$row["sensor_value"]."</td></tr>";
      }
      $count++;
    }
    echo "</table>";
  } else {
    echo "0 results";
  }
}

// Call the fetchData function initially
fetchData();

// Refresh the data every 3 seconds using JavaScript
echo "<script>
  setInterval(function() {
    location.reload();
  }, 3000);
</script>";

$conn->close();
?>
<button onclick="window.location.href = 'view_data.php';">View Data</button>
  </body>
</html>

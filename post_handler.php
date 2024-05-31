
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);

    if (filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($name)) {
        $servername = "localhost";
        $username = "example_user"; // Replace with your MySQL username
        $password = "9Lesbians!"; // Replace with your MySQL password
        $dbname = "mydatabase"; // Replace with your database name

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        } else {
            echo "Connection successful.<br>";
        }

        $sql = "INSERT INTO users (name, email) VALUES ('$name', '$email')";
        
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
    } else {
        echo "Invalid input. Please try again.";
    }
} else {
    echo "No data received.";
}
?>

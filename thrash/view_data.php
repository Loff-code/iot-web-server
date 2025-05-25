<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Loffy</title>
    <link rel="stylesheet" href="/loffy.dk/Style/style.css" />
    <link rel="icon" href="/loffy.dk/images/Logo-modified.png" type="image/png" />
</head>

<body>
    <header-component></header-component>

    <div class="page-container">



        <?php
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "mydatabase";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Select data from the 'users' table
        $sql = "SELECT id, name, email FROM users";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Output data of each row
            while ($row = $result->fetch_assoc()) {
                echo "ID: " . $row["id"] . " - Name: " . $row["name"] . " - Email: " . $row["email"] . "<br>";
            }
        } else {
            echo "0 results";
        }

        // Close connection
        $conn->close();
        ?>

    </div>
    <script src="/loffy.dk/Script/heading.js"></script>

</body>

</html>
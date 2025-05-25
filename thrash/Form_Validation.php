<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];

    // Simple validation
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_message = "Please fill in all fields correctly.";
    } else {
        $success_message = "Form submitted successfully!";
        // Process the form data or save it to the database
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Validation</title>
    <link rel="stylesheet" href="/loffy.dk/Style/style.css" />
</head>
<body>
    <?php
    if (isset($error_message)) {
        echo "<p style='color: red;'>$error_message</p>";
    } elseif (isset($success_message)) {
        echo "<p style='color: green;'>$success_message</p>";
    }
    ?>

    <form method="post" action="">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>

        <input type="submit" value="Submit">
    </form>
</body>
</html>

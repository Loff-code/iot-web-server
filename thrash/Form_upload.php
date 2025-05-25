<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Loffy</title>
    <link rel="stylesheet" href="/loffy.dk/Style/style.css" />
    <link rel="icon" href="/loffy.dk/images/Logo-modified.png" type="image/png" />
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script> <!-- Include jQuery -->
  </head>
  <body>
    <header-component></header-component>
     <div class="page-container">
    <h1>gay</h1>
    <?php
    $name = "fag";
    $age = 69;
    $salary = 420;
    $times= 4;

    echo "Hello, my name is $name, and I am $age years old. My salary is $salary kr";

    if ($age > 50) {
        echo ". <br> $age? You're old as fuck";
    } else {
        echo "You're of a decent age";
    }

    for ($i = 1; $i <= $times; $i++) {
        echo "<br>Itereation $i ";
    }
    ?>
    <form id="uploadForm" action="/database.php" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="gay" required>
        <button type="button" onclick="submitForm()">Submit</button>
    </form>
    <a class="next" href="/view_data.php">View Data</a>
    <script src="/loffy.dk/Script/heading.js"></script>
    <script src="/loffy.dk/Script/Forms.js">    
    </script>
   </div>
  </body>
</html>

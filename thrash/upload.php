<?php
$target_dir = "../uploads/";
$uploadOk = 1;

if(isset($_FILES["fileToUpload"])) {
  $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
  $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

  // Check if the file is an actual image or a fake image
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    echo "File is an image - " . $check["mime"] . ". ";
    $uploadOk = 1;
  } else {
    echo "File is not an image. ";
    $uploadOk = 0;
  }

  // Check if file already exists
  if (file_exists($target_file)) {
    echo "Sorry, file already exists. ";
    $uploadOk = 0;
  }

  // Check file size
  if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large. ";
    $uploadOk = 0;
  }

  // Allow certain file formats
  $allowed_formats = ["jpg", "jpeg", "png", "gif"];
  if (!in_array($imageFileType, $allowed_formats)) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed. ";
    $uploadOk = 0;
  }

  // Check if $uploadOk is set to 0 by an error
  if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded. ";
  } else {
    // If everything is ok, try to upload the file
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
      echo "The file ". htmlspecialchars(basename($_FILES["fileToUpload"]["name"])). " has been uploaded. ";
    } else {
      echo "Sorry, there was an error uploading your file. ";
    }
  }
}
?>

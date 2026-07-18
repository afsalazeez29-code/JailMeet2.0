<?php
include('db.php'); // Ensure this connects to your database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $pris_id = mysqli_real_escape_string($connection, $_POST['pris_id']);
    $pris_name = mysqli_real_escape_string($connection, $_POST['pris_name']);
    $pris_age = mysqli_real_escape_string($connection, $_POST['pris_age']);
    $pris_gender = mysqli_real_escape_string($connection, $_POST['pris_gender']);
    $pris_case = mysqli_real_escape_string($connection, $_POST['pris_case']);
    $pris_adm = mysqli_real_escape_string($connection, $_POST['pris_adm']);
    $pris_period = !empty($_POST['pris_period']) ? mysqli_real_escape_string($connection, $_POST['pris_period']) : NULL;

    // Update query
    $query = "UPDATE prisoner SET pris_name='$pris_name', pris_age='$pris_age', pris_gender='$pris_gender', pris_case='$pris_case', pris_adm='$pris_adm', pris_period='$pris_period' WHERE pris_id='$pris_id'";

    // Execute the query
    if (mysqli_query($connection, $query)) {
        // Redirect back to list page with success message
        header("Location: prisoners.php");
        exit;
    } else {
        echo "Error: " . mysqli_error($connection);
    }
}
?>
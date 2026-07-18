<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = $_POST['pris_id'];
    $parole_from = $_POST['parole_from'];
    $parole_to = $_POST['parole_to'];
    $parole_msg = $_POST['parole_msg'];

    // Validate dates
    if (strtotime($parole_from) > strtotime($parole_to)) {
        die("Error: Parole 'From' date must be before 'To' date");
    }

    $query = "UPDATE prisoner SET 
              par_status = 'Accepted',
              parole_from = ?,
              parole_to = ?,
              parole_msg = ?
              WHERE pris_id = ?";

    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "sssi", $parole_from, $parole_to, $parole_msg, $pris_id);
    
    if (mysqli_stmt_execute($stmt)) {
        header("Location: requests.php?success=Parole+accepted+successfully");
    } else {
        die("Error updating record: " . mysqli_error($connection));
    }
} else {
    header("Location: requests.php");
}
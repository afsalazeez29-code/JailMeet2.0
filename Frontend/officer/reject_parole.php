<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = $_POST['pris_id'];
    $parole_msg = $_POST['parole_msg'];

    $query = "UPDATE prisoner SET 
              par_status = 'Rejected',
              reject_msg = ?
              WHERE pris_id = ?";

    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "si", $parole_msg, $pris_id);
    
    if (mysqli_stmt_execute($stmt)) {
        header("Location: requests.php?success=Parole+rejected+successfully");
    } else {
        die("Error updating record: " . mysqli_error($connection));
    }
} else {
    header("Location: requests.php");
}
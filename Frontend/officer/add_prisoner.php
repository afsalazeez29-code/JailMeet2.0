<?php
session_start();
include('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pris_id = $_POST['pris_id'];
    $pris_name = mysqli_real_escape_string($connection, $_POST['pris_name']);
    $pris_age = mysqli_real_escape_string($connection, $_POST['pris_age']);
    $pris_gender = mysqli_real_escape_string($connection, $_POST['pris_gender']);
    $pris_case = mysqli_real_escape_string($connection, $_POST['pris_case']);
    $fir = mysqli_real_escape_string($connection, $_POST['fir']);
    $pris_adm = mysqli_real_escape_string($connection, $_POST['pris_adm']);
    $pris_period = mysqli_real_escape_string($connection, $_POST['pris_period']);
    $parole_from = mysqli_real_escape_string($connection, $_POST['parole_from']);

    $query = "UPDATE prisoner SET 
              pris_name = ?, 
              pris_age = ?, 
              pris_gender = ?, 
              pris_case = ?, 
              fir = ?,
              pris_adm = ?, 
              pris_period = ?,
              parole_from = ?
              WHERE pris_id = ?";
              
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "sissssssi", 
        $pris_name, $pris_age, $pris_gender, 
        $pris_case, $fir, $pris_adm, $pris_period, $parole_from, $pris_id);
    
    if (mysqli_stmt_execute($stmt)) {
        header("Location: prisoner_list.php?success=1");
    } else {
        header("Location: prisoner_list.php?error=" . urlencode(mysqli_error($connection)));
    }
    
    mysqli_stmt_close($stmt);
} else {
    header("Location: prisoner_list.php");
}
?>
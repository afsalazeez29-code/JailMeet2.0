<?php
include('db.php');

if (isset($_GET['id'])) {
    $pris_id = $_GET['id'];

    // Prevent SQL injection
    $pris_id = mysqli_real_escape_string($connection, $pris_id);

    $deleteQuery = "DELETE FROM prisoner WHERE pris_id = '$pris_id'";

    if (mysqli_query($connection, $deleteQuery)) {
        // Redirect back with success message (optional)
        header("Location: prisoners.php");
        exit();
    } else {
        echo "Error deleting record: " . mysqli_error($connection);
    }
} else {
    echo "Invalid request.";
}
?>

<?php
session_start(); // Start the session

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Check if the id is provided
if (isset($_GET['id'])) {
    $id = mysqli_real_escape_string($connection, $_GET['id']); // This should match the column name in your database (ad_id)

    // Perform delete operation
    $query = "DELETE FROM admin WHERE ad_id='$id'";
    if (mysqli_query($connection, $query)) {
        $_SESSION['message'] = "Admin deleted successfully!";
    } else {
        $_SESSION['message'] = "Error deleting admin: " . mysqli_error($connection);
    }
}

// Redirect back to the admin details page
header('Location: admindetails.php');
exit();
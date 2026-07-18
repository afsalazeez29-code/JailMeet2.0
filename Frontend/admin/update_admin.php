<?php
session_start();
$connection = mysqli_connect("localhost", "root", "", "jailmeet");

if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Ensure admin is logged in
if (!isset($_SESSION['ad_id'])) {
    echo "<script>alert('You must be logged in to perform this action.'); window.location.href='adminlogin.php';</script>";
    exit();
}

// Get posted form data
$admin_id = $_POST['admin_id'];
$admin_name = trim($_POST['admin_name']);
$admin_email = trim($_POST['admin_email']);
$admin_password = trim($_POST['admin_password']);

// If password field is empty, retain the old password
if (empty($admin_password)) {
    $query = "SELECT ad_password FROM admin WHERE ad_id = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, "i", $admin_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $admin_password);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
}

// Update the admin info
$update_query = "UPDATE admin SET ad_name = ?, ad_email = ?, ad_password = ? WHERE ad_id = ?";
$update_stmt = mysqli_prepare($connection, $update_query);

if ($update_stmt) {
    mysqli_stmt_bind_param($update_stmt, "sssi", $admin_name, $admin_email, $admin_password, $admin_id);
    if (mysqli_stmt_execute($update_stmt)) {
        echo "<script>alert('Admin details updated successfully.'); window.location.href='profileedit.php';</script>";
    } else {
        echo "<script>alert('Error executing update.'); window.location.href='profileedit.php';</script>";
    }
    mysqli_stmt_close($update_stmt);
} else {
    echo "<script>alert('Error preparing update statement.'); window.location.href='profileedit.php';</script>";
}

mysqli_close($connection);
?>

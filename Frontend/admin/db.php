<?php
// Database connection settings
$host = "localhost";
$user = "root"; // Change if your MySQL username is different
$pass = ""; // Change if your MySQL has a password
$dbname = "jailmeet"; // Your database name

// Create connection
$connection = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

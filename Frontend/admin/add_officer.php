<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include necessary files
include('includes/navbar.php');
include('includes/sidebar.php');
include('db.php'); // Ensure this file contains the database connection

// Debugging: Check if database connection is successful
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["add_officer_btn"])) {
    // Trim and sanitize input data
    $ofname = trim($_POST["ofname"]);
    $ofemail = trim($_POST["ofemail"]);
    $ofpass = trim($_POST["ofpass"]);
    $ofphno = trim($_POST["ofphno"]);

    // Basic Validation
    if (empty($ofname) || empty($ofemail) || empty($ofpass) || empty($ofphno)) {
        echo "<script>alert('All fields are required!'); window.history.back();</script>";
        exit;
    }

    // Secure input
    $ofname = mysqli_real_escape_string($connection, $ofname);
    $ofemail = mysqli_real_escape_string($connection, $ofemail);
    $ofphno = mysqli_real_escape_string($connection, $ofphno);
    $hashed_pass = password_hash($ofpass, PASSWORD_BCRYPT); // Secure password hashing

    // Insert query
    $query = "INSERT INTO officers (ofname, ofemail, ofpass, ofphno) VALUES ('$ofname', '$ofemail', '$hashed_pass', '$ofphno')";
    
    // Execute the query
    if (mysqli_query($connection, $query)) {
        echo "<script>alert('Officer added successfully!'); window.location.href='officers.php';</script>";
        exit;
    } else {
        echo "<script>alert('Error adding officer: " . mysqli_error($connection) . "');</script>";
    }
}

// Fetch officer details
$query_fetch = "SELECT * FROM officers";
$result = mysqli_query($connection, $query_fetch);
if (!$result) {
    die("Query Failed: " . mysqli_error($connection));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>JailMeet Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <link rel="icon" href="assets1/img/kaiadmin/favicon.ico" type="image/x-icon">

    <!-- Fonts and icons -->
    <script src="assets1/js/plugin/webfont/webfont.min.js"></script>
    <script>
        WebFont.load({
            google: { families: ["Public Sans:300,400,500,600,700"] },
            custom: {
                families: [
                    "Font Awesome 5 Solid",
                    "Font Awesome 5 Regular",
                    "Font Awesome 5 Brands",
                    "simple-line-icons"
                ],
                urls: ["assets1/css/fonts.min.css"]
            },
            active: function () {
                sessionStorage.fonts = true;
            }
        });
    </script>
    losjdncvojsnjneevpkmpvckmkvc
    konmvolkneeokvmn
    nmovkmokmv
    mokevmnokmnv

    <!-- CSS Files -->
    <link rel="stylesheet" href="assets1/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets1/css/plugins.min.css">
    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">
    <link rel="stylesheet" href="assets1/css/demo.css">
</head>
<body>


                

<!-- Core JS Files -->
<script src="assets1/js/core/jquery-3.7.1.min.js"></script>
<script src="assets1/js/core/popper.min.js"></script>
<script src="assets1/js/core/bootstrap.min.js"></script>

<!-- jQuery Scrollbar -->
<script src="assets1/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>

<!-- Chart JS -->
<script src="assets1/js/plugin/chart.js/chart.min.js"></script>

<!-- jQuery Sparkline -->
<script src="assets1/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>

<!-- Chart Circle -->
<script src="assets1/js/plugin/chart-circle/circles.min.js"></script>

<!-- Datatables -->
<script src="assets1/js/plugin/datatables/datatables.min.js"></script>

<!-- jQuery Vector Maps -->
<script src="assets1/js/plugin/jsvectormap/jsvectormap.min.js"></script>
<script src="assets1/js/plugin/jsvectormap/world.js"></script>

<!-- Sweet Alert -->
<script src="assets1/js/plugin/sweetalert/sweetalert.min.js"></script>

<!-- Kaiadmin JS -->
<script src="assets1/js/kaiadmin.min.js"></script>

<!-- Kaiadmin DEMO methods, don't include it in your project! -->
<script src="assets1/js/setting-demo.js"></script>
<script src="assets1/js/demo.js"></script>
<script>
    $("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#177dff",
        fillColor: "rgba(23, 125, 255, 0.14)",
    });

    $("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#f3545d",
        fillColor: "rgba(243, 84, 93, .14)",
    });

    $("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#ffa534",
        fillColor: "rgba(255, 165, 52, .14)",
    });
</script>
</body>
</html>
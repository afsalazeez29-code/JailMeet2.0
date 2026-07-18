<?php
session_start();
include('db.php');

// Redirect to login if the user is not logged in
if (!isset($_SESSION['visitor_id'])) {
    header("Location: /Project/JailMeet/visitor/login.php");
    exit();
}

// Fetch visitor details from the database
$visitor_id = $_SESSION['visitor_id'];

// Debugging: Uncomment to check session value
// var_dump($_SESSION['visitor_id']);

$query = "SELECT vname, vemail FROM visitors WHERE vid = ?";
$stmt = mysqli_prepare($connection, $query);

if (!$stmt) {
    die("Query failed: " . mysqli_error($connection));
}

mysqli_stmt_bind_param($stmt, "i", $visitor_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$visitor = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

// Debugging: Uncomment to check fetched visitor data
// var_dump($visitor);

// If visitor details not found, set default values
if (!$visitor) {
    $visitor_name = "Guest";
    $visitor_email = "No email available";
} else {
    $visitor_name = htmlspecialchars($visitor['vname']);
    $visitor_email = htmlspecialchars($visitor['vemail']);
}

include('navbar.php');
include('sidebar.php');
?>


<!DOCTYPE html>

<html
  lang="en"
  class="light-style layout-menu-fixed"
  dir="ltr"
  data-theme="theme-default"
  data-assets-path="../assets/"
  data-template="vertical-menu-template-free"
>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />

    <title>JailMeet Visitor</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/img/favicon/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
      rel="stylesheet"
    />

    <!-- Icons. Uncomment required icon fonts -->
    <link rel="stylesheet" href="../assets/vendor/fonts/boxicons.css" />

    <!-- Core CSS -->
    <link rel="stylesheet" href="../assets/vendor/css/core.css" class="template-customizer-core-css" />
    <link rel="stylesheet" href="../assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
    <link rel="stylesheet" href="../assets/css/demo.css" />

    <!-- Vendors CSS -->
    <link rel="stylesheet" href="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />

    <link rel="stylesheet" href="../assets/vendor/libs/apex-charts/apex-charts.css" />

    <!-- Page CSS -->

    <!-- Helpers -->
    <script src="../assets/vendor/js/helpers.js"></script>

    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->
    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
    <script src="../assets/js/config.js"></script>
  </head>

  <body>
  <body>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <div class="layout-page">
                <div class="content-wrapper">
                <div class="container"style="
    width: 454px;
    padding-top: 116px;
">
                        <h1>Welcome, <?php echo $visitor_name; ?>!</h1>
                        <p>Your Visitor ID: <?php echo htmlspecialchars($visitor_id); ?></p>
                        <p>Email: <?php echo $visitor_email; ?></p>
                        <a href="../../../index.php?logout=true">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/core.js -->
    <script src="../assets/vendor/libs/jquery/jquery.js"></script>
    <script src="../assets/vendor/libs/popper/popper.js"></script>
    <script src="../assets/vendor/js/bootstrap.js"></script>
    <script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="../assets/vendor/js/menu.js"></script>
    <!-- endbuild -->

    <!-- Vendors JS -->
    <script src="../assets/vendor/libs/apex-charts/apexcharts.js"></script>

    <!-- Main JS -->
    <script src="../assets/js/main.js"></script>

    <!-- Page JS -->
    <script src="../assets/js/dashboards-analytics.js"></script>

    <!-- Place this tag in your head or just before your close body tag. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
  </body>
</html>
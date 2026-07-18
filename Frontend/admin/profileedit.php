<?php
session_start();

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Include navigation and sidebar
include('includes/navbar.php');
include('includes/sidebar.php');

// Ensure that the admin is logged in
if (!isset($_SESSION['ad_id'])) {
    echo "<script>alert('You must be logged in to view this page.'); window.location.href='adminlogin.php';</script>";
    exit();
}

// Fetch admin details using the logged-in admin's ID
$admin_id = $_SESSION['ad_id'];
$query = "SELECT ad_name, ad_password, ad_email FROM admin WHERE ad_id = ?";
$stmt = mysqli_prepare($connection, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $admin_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($admin = mysqli_fetch_assoc($result)) {
        // Admin details fetched successfully
    } else {
        echo "<script>alert('Admin not found.'); window.location.href='adminlogin.php';</script>";
        exit();
    }
    mysqli_stmt_close($stmt);
} else {
    echo "<script>alert('Database query failed.'); window.location.href='adminlogin.php';</script>";
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>JailMeet Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <link rel="icon" href="assets1/img/kaiadmin/favicon.ico" type="image/x-icon">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">

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

    <link rel="stylesheet" href="assets1/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets1/css/plugins.min.css">
    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">
    <link rel="stylesheet" href="assets1/css/demo.css">

    
</head>
<body>




<div class="container mt-5">
    <h2 class="mb-4">Edit Admin Details</h2>
    <form method="POST" action="update_admin.php">
        <div class="form-group">
            <label for="adminName">Admin Name</label>
            <input type="text" class="form-control" id="adminName" name="admin_name" value="<?php echo htmlspecialchars($admin['ad_name']); ?>">
        </div>
        <div class="form-group">
            <label for="adminEmail">Email</label>
            <input type="email" class="form-control" id="adminEmail" name="admin_email" value="<?php echo htmlspecialchars($admin['ad_email']); ?>">
        </div>
        <div class="form-group">
    <label for="adminPassword">Password</label>
    <div class="input-group">
        <input type="password" class="form-control" id="adminPassword" name="admin_password" value="<?php echo htmlspecialchars($admin['ad_password']); ?>">
        <div class="input-group-append">
            <span class="input-group-text" onclick="togglePassword()" style="cursor: pointer;">
                <i class="fas fa-eye" id="toggleIcon"></i>
            </span>
        </div>
    </div>
</div>
        <input type="hidden" name="admin_id" value="<?php echo $admin_id; ?>">
        <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
</div>





<!-- Bootstrap and Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>



<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
<script>
function togglePassword() {
    var input = document.getElementById("adminPassword");
    var icon = document.getElementById("toggleIcon");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
</script>


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

</body>
</html>
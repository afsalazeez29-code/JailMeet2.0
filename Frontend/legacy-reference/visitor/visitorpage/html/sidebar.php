<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db.php'); // Ensure database connection is included

// Redirect to login if session is not set
if (!isset($_SESSION['visitor_id'])) {
    header("Location: /Project/JailMeet/visitor/login.php");
    exit();
}

// Fetch visitor details from the database
$visitor_id = $_SESSION['visitor_id'];
$query = "SELECT vname, vemail, vpass FROM visitors WHERE vid = ?";
$stmt = mysqli_prepare($connection, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $visitor_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $visitor_name = $row['vname']; 
        $visitor_email = $row['vemail']; 
        $visitor_password = $row['vpass']; // Retrieve password
    } else {
        $visitor_name = "Guest";
        $visitor_email = "No email available";
        $visitor_password = "N/A"; // Default if not found
    }
    mysqli_stmt_close($stmt);
} else {
    $visitor_name = "Guest";
    $visitor_email = "No email available";
    $visitor_password = "N/A";
}

?>

<!-- Sidebar Menu -->
<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
  <div class="app-brand demo">
    <a href="home.php" class="app-brand-link">
      <img src="jmblack.png" alt="Logo" class="app-brand-logo" style="max-width: 100px; height: auto;">
    </a>
  </div>

  <div class="menu-inner-shadow"></div>

  <!-- User Info -->
  <div class="user-info text-center p-3" style="display: none;">
    <img src="../assets/img/avatars/1.png" alt="User Avatar" class="w-px-50 h-auto rounded-circle mb-2" />
    <h1>Welcome, <?php echo htmlspecialchars($visitor_name); ?>!</h1>
    <small class="text-muted">ID: <?php echo htmlspecialchars($visitor_id); ?></small>
    <br>
    <small class="text-muted"><?php echo htmlspecialchars($visitor_email); ?></small>
</div>

  <ul class="menu-inner py-1">
    <!-- Dashboard -->
    <li class="menu-item active">
      <a href="vhome.php" class="menu-link">
        <i class="menu-icon tf-icons bx bx-home-circle"></i>
        <div>Dashboard</div>
      </a>
    </li>

    <!-- Pages -->
    <li class="menu-header small text-uppercase"><span class="menu-header-text">Pages</span></li>

    

    <li class="menu-item">
      <a href="prisoners.php" class="menu-link">
        <i class="menu-icon tf-icons bx bx-cube-alt"></i>
        <div>View Prisoner</div>
      </a>
    </li>

    <li class="menu-item">
      <a href="booking.php" class="menu-link">
        <i class="menu-icon tf-icons bx bx-cube-alt"></i>
        <div>Book Appointment</div>
      </a>
    </li>

    <li class="menu-item">
      <a href="status.php" class="menu-link">
        <i class="menu-icon tf-icons bx bx-cube-alt"></i>
        <div>View Booking Status</div>
      </a>
    </li>

    <li class="menu-item">
      <a href="accountsettings.php" class="menu-link">
        <i class="menu-icon tf-icons bx bx-cube-alt"></i>
        <div>Edit Profile</div>
      </a>
    </li>
  </ul>
</aside>

<?php
session_start();
include('db.php'); // Must be after session_start


$pris_id = $_SESSION['pris_id'] ?? null;

if ($pris_id) {
    $stmt = $conn->prepare("SELECT pris_id, pris_name, dp FROM prisoner WHERE pris_id = ?");
    $stmt->bind_param("s", $pris_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $prisoner = $result->fetch_assoc();
        $display_id = htmlspecialchars($prisoner['pris_id']);
        $display_name = htmlspecialchars($prisoner['pris_name']);

        $image_path = '../images.png'; // Default fallback
        if (!empty($prisoner['dp'])) {
            $filename = basename($prisoner['dp']);
            $uploads_dir = '../officer/uploads/';
            if (file_exists($uploads_dir . $filename)) {
                $image_path = $uploads_dir . $filename;
            }
        }
    } else {
        $display_id = "Unknown";
        $display_name = "Name Not Found";
        $image_path = '../images.png';
    }
    $stmt->close();
    $conn->close();
} else {
    $display_id = "Not Logged In";
    $display_name = "Guest";
    $image_path = '../images.png';
}
?>

<!-- Start wrapper-->
<div id="wrapper">
  <div class="clearfix"></div>
  <div class="content-wrapper">
    <div class="container-fluid">

      <!-- Start topbar header -->
      <header class="topbar-nav">
        <nav class="navbar navbar-expand fixed-top">
          <ul class="navbar-nav mr-auto align-items-center">
            <li class="nav-item">
              <a class="nav-link toggle-menu" href="javascript:void();">
                <i class="icon-menu menu-icon"></i>
              </a>
            </li>
            <li class="nav-item">
              <form class="search-bar">
                <input type="text" class="form-control" placeholder="Enter keywords">
                <a href="javascript:void();"><i class="icon-magnifier"></i></a>
              </form>
            </li>
          </ul>

          <ul class="navbar-nav align-items-center right-nav-link">
            

            <li class="nav-item">
              <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown" href="#">
              <span class="user-profile">
  <img src="<?php echo $image_path; ?>" 
       class="img-circle" 
       alt="user avatar" 
       style="width: 40px; height: 40px; object-fit: cover;" 
       onerror="this.src='../images.png'">
</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right">
                <li class="dropdown-item user-details">
                  <a href="javascript:void();">
                    <div class="media">
                    <div class="avatar">
  <img class="align-self-start mr-3" 
       src="<?php echo $image_path; ?>" 
       alt="user avatar" 
       style="width: 60px; height: 60px; object-fit: cover;" 
       onerror="this.src='../images.png'">
</div>
                      <div class="media-body">
                        <h6 class="mt-2 user-title">Prisoner ID: <?php echo $display_id; ?></h6>
                        <p class="user-subtitle">Prisoner Name: <?php echo $display_name; ?></p>
                      </div>
                    </div>
                  </a>
                </li> 
                <li class="dropdown-divider"></li>
<li class="dropdown-item">
  <a href="index.php" class="text-white">
    <i class="icon-wallet mr-2"></i> Account
  </a>
</li>
<li class="dropdown-divider"></li>
<li class="dropdown-item">
  <a href="prisonerlogin.php" class="text-white">
    <i class="icon-power mr-2"></i> Logout
  </a>
</li>

              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <!-- End topbar header -->
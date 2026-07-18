<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db.php');// Ensure database connection is included
include('navbar.php'); 
include('sidebar.php');

// Redirect to login if session is not set
if (!isset($_SESSION['visitor_id'])) {
    header("Location: /Project/JailMeet/visitor/login.php");
    exit();
}

// Fetch visitor details from the database
$visitor_id = $_SESSION['visitor_id'];
$query = "SELECT vname, vemail, vadd, vzip, vphno, vstate FROM visitors WHERE vid = ?";
$stmt = mysqli_prepare($connection, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $visitor_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $visitor_name = $row['vname'];  // Visitor Name
        $visitor_email = $row['vemail']; // Visitor Email
        $visitor_address = $row['vadd']; // Visitor Address
        $visitor_zipcode = $row['vzip']; // Visitor Zipcode
        $visitor_phone = $row['vphno']; // Visitor Phone Number
        $visitor_state = $row['vstate']; // Visitor State
    } else {
        $visitor_name = "Guest";
        $visitor_email = "No email available";
        $visitor_address = "No address available";
        $visitor_zipcode = "No zip code available";
        $visitor_phone = "No phone number available";
        $visitor_state = "No state available";
    }
    mysqli_stmt_close($stmt);
} else {
    $visitor_name = "Guest";
    $visitor_email = "No email available";
    $visitor_address = "No address available";
    $visitor_zipcode = "No zip code available";
    $visitor_phone = "No phone number available";
    $visitor_state = "No state available";
}
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

    <!-- Page CSS -->

    <!-- Helpers -->
    <script src="../assets/vendor/js/helpers.js"></script>

    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->
    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
    <script src="../assets/js/config.js"></script>
  </head>

  <body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        
        <!-- Layout container -->
        <div class="layout-page">
          
          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->

            <div class="container-xxl flex-grow-1 container-p-y">
              <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Your Profile</span></h4>

              <div class="row">
                <div class="col-md-12">
                  <ul class="nav nav-pills flex-column flex-md-row mb-3">
                    <li class="nav-item">
                      <a class="nav-link active" href="accountsettings.php"><i class="bx bx-user me-1"></i> Edit Profile</a>
                    </li>
                    
                    
                  </ul>
                  <div class="card mb-4">
                    <h5 class="card-header">Profile Details</h5>
                    <!-- Account -->
                    
                    <hr class="my-0" />
                    <div class="card-body">
                    <form id="formAccountSettings" method="POST" onsubmit="return false">
                      <div class="row">
                        <div class="mb-3 col-md-6">
                          <label for="firstName" class="form-label">Full Name</label>
                          <input class="form-control" type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($visitor_name); ?>" readonly />
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="email" class="form-label">E-mail</label>
                          <input class="form-control" type="text" id="email" name="email" value="<?php echo htmlspecialchars($visitor_email); ?>" readonly />
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="phoneNumber" class="form-label">Phone Number</label>
                          <div class="input-group input-group-merge">
                            <span class="input-group-text">IN(+91)</span>
                            <input type="text" id="phoneNumber" name="phoneNumber" class="form-control" value="<?php echo htmlspecialchars($visitor_phone); ?>" readonly />
                          </div>
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="address" class="form-label">Address</label>
                          <input type="text" class="form-control" id="address" name="address" value="<?php echo htmlspecialchars($visitor_address); ?>" readonly />
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="zipCode" class="form-label">Zip Code</label>
                          <input type="text" class="form-control" id="zipCode" name="zipCode" value="<?php echo htmlspecialchars($visitor_zipcode); ?>" maxlength="6" readonly />
                        </div>
                        <div class="mb-3 col-md-6">
                          <label for="state" class="form-label">State</label>
                          <input type="text" class="form-control" id="state" name="state" value="<?php echo htmlspecialchars($visitor_state); ?>" readonly />
                        </div>
                      </div>
                    </form>



                    </div>
                    <!-- /Account 
                  </div>
                  <div class="card">
                    <h5 class="card-header">Delete Account</h5>
                    <div class="card-body">
                      <div class="mb-3 col-12 mb-0">
                        <div class="alert alert-warning">
                          <h6 class="alert-heading fw-bold mb-1">Are you sure you want to delete your account?</h6>
                          <p class="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                      </div>
                      <form id="formAccountDeactivation" onsubmit="return false">
                        <div class="form-check mb-3">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="accountActivation"
                            id="accountActivation"
                          />
                          <label class="form-check-label" for="accountActivation"
                            >I confirm my account deactivation</label
                          >
                        </div>
                        <button type="submit" class="btn btn-danger deactivate-account">Deactivate Account</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- / Content -->

            
            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
        <!-- / Layout page -->
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
    </div>
    <!-- / Layout wrapper -->

   

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/core.js -->
    <script src="../assets/vendor/libs/jquery/jquery.js"></script>
    <script src="../assets/vendor/libs/popper/popper.js"></script>
    <script src="../assets/vendor/js/bootstrap.js"></script>
    <script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="../assets/vendor/js/menu.js"></script>
    <!-- endbuild -->

    <!-- Vendors JS -->

    <!-- Main JS -->
    <script src="../assets/js/main.js"></script>

    <!-- Page JS -->
    <script src="../assets/js/pages-account-settings-account.js"></script>

    <!-- Place this tag in your head or just before your close body tag. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
  </body>
</html>

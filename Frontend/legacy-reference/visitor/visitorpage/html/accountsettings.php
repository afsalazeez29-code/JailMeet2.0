<?php
// Start output buffering at the very top
ob_start();

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Redirect if not logged in - must be before any output
if (!isset($_SESSION['visitor_id'])) {
    header("Location: /Project/JailMeet/visitor/login.php");
    exit();
}

// Now include your files
include('db.php');
include('navbar.php'); 
include('sidebar.php');

$visitor_id = $_SESSION['visitor_id'];

// Fetch visitor details from the database
$query = "SELECT vname, vemail, vpass, vadd, vzip, vphno, vstate FROM visitors WHERE vid = ?";
$stmt = mysqli_prepare($connection, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "i", $visitor_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $visitor_name = $row['vname'];
        $visitor_email = $row['vemail'];
        $visitor_password = $row['vpass'];
        $visitor_address = $row['vadd'];
        $visitor_zipcode = $row['vzip'];
        $visitor_phone = $row['vphno'];
        $visitor_state = $row['vstate'];
    }
    mysqli_stmt_close($stmt);
}

// Handle Form Submission for Profile Update
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $updated_name = $_POST['firstName'];
    $updated_email = $_POST['email'];
    $updated_password = $_POST['password'];
    $updated_phone = $_POST['phoneNumber'];
    $updated_address = $_POST['address'];
    $updated_zip = $_POST['zipCode'];
    $updated_state = $_POST['state'];

    // Update query
    $update_query = "UPDATE visitors SET vname=?, vemail=?, vpass=?, vphno=?, vadd=?, vzip=?, vstate=? WHERE vid=?";
    $update_stmt = mysqli_prepare($connection, $update_query);

    if ($update_stmt) {
        mysqli_stmt_bind_param($update_stmt, "sssssssi", 
            $updated_name, 
            $updated_email, 
            $updated_password, 
            $updated_phone, 
            $updated_address, 
            $updated_zip, 
            $updated_state, 
            $visitor_id
        );
        mysqli_stmt_execute($update_stmt);
        mysqli_stmt_close($update_stmt);

        // Set success message in session
        $_SESSION['update_success'] = true;
        
        // Redirect to profile page
        header("Location: accountsettings.php");
        exit();
    }
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
              <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account Settings</span></h4>

              <div class="row">
                <div class="col-md-12">
                  <ul class="nav nav-pills flex-column flex-md-row mb-3">
                    <li class="nav-item">
                      <a class="nav-link active" href="profile.php"><i class="bx bx-user me-1"></i>My Profile</a>
                    </li>
                    
                    
                  </ul>
                  <div class="card mb-4">
                    <h5 class="card-header">Profile Details</h5>
                    <!-- Account -->
                    
                    <hr class="my-0" />
                    <div class="card-body">
                      <?php if (isset($_SESSION['update_success'])): ?>
        <div id="successPopup" class="alert alert-success text-center" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; display: none;">
            ✅ Changes Saved Successfully! 
        </div>
        <script>
            // Show the success popup
            document.getElementById("successPopup").style.display = "block";

            // Redirect after 3 seconds
            setTimeout(function() {
                window.location.href = "accountsettings.php";
            }, 3000);
        </script>
        <?php unset($_SESSION['update_success']); ?>
    <?php endif; ?>
                    <form id="formAccountSettings" method="POST">
        <div class="row">
            <div class="mb-3 col-md-6">
                <label for="firstName" class="form-label">Full Name</label>
                <input class="form-control" type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($visitor_name); ?>" required />
            </div>
            <div class="mb-3 col-md-6">
                <label for="email" class="form-label">E-mail</label>
                <input class="form-control" type="email" id="email" name="email" value="<?php echo htmlspecialchars($visitor_email); ?>" required />
            </div>
            <div class="mb-3 col-md-6">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="password" name="password" value="<?php echo htmlspecialchars($visitor_password); ?>" required />
                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="mb-3 col-md-6">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <div class="input-group">
                    <span class="input-group-text">IN(+91)</span>
                    <input type="text" id="phoneNumber" name="phoneNumber" class="form-control" value="<?php echo htmlspecialchars($visitor_phone); ?>" required />
                </div>
            </div>
            <div class="mb-3 col-md-6">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" name="address" value="<?php echo htmlspecialchars($visitor_address); ?>" required />
            </div>
            <div class="mb-3 col-md-6">
                <label for="zipCode" class="form-label">Zip Code</label>
                <input type="text" class="form-control" id="zipCode" name="zipCode" value="<?php echo htmlspecialchars($visitor_zipcode); ?>" required maxlength="6" />
            </div>
            <div class="mb-3 col-md-6">
                <label for="state" class="form-label">State</label>
                <input type="text" class="form-control" id="state" name="state" value="<?php echo htmlspecialchars($visitor_state); ?>" required />
            </div>
            <div class="mt-3">
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </div>
    </form>

    <script>
        document.getElementById('togglePassword').addEventListener('click', function () {
            let passwordField = document.getElementById('password');
            let icon = this.querySelector('i');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    </script>

<!-- Font Awesome for Eye Icon -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">





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

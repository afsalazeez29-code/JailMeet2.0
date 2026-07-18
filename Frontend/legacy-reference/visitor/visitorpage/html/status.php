<?php
session_start();
include('db.php'); 
include('navbar.php');
include('sidebar.php');

// Redirect to login if the user is not logged in
if (!isset($_SESSION['visitor_id'])) {
  header("Location: /Project/JailMeet/visitor/login.php");
  exit();
}

// Get logged-in visitor ID
$visitor_id = $_SESSION['visitor_id'];
?>
<!DOCTYPE html>
<html lang="en" class="light-style layout-menu-fixed" dir="ltr" data-theme="theme-default" data-assets-path="../assets/" data-template="vertical-menu-template-free">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <title>JailMeet Visitor</title>
    <meta name="description" content="" />
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/img/favicon/favicon.ico" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
    <!-- Icons -->
    <link rel="stylesheet" href="../assets/vendor/fonts/boxicons.css" />
    <!-- Core CSS -->
    <link rel="stylesheet" href="../assets/vendor/css/core.css" class="template-customizer-core-css" />
    <link rel="stylesheet" href="../assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
    <link rel="stylesheet" href="../assets/css/demo.css" />
    <!-- Vendors CSS -->
    <link rel="stylesheet" href="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="../assets/vendor/libs/apex-charts/apex-charts.css" />
    <!-- Helpers -->
    <script src="../assets/vendor/js/helpers.js"></script>
    <!-- Config -->
    <script src="../assets/js/config.js"></script>
  </head>
  <body>
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <div class="layout-page">
          <div class="content-wrapper">
            <div class="container-xxl flex-grow-1 container-p-y">
              <!-- Header -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="mb-0">Your Visitor ID: <?php echo htmlspecialchars($visitor_id); ?></h4>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filter Section -->
              <div class="card mb-4">
                <div class="card-body">
                  <form method="POST">
                    <div class="row">
                      <div class="col-md-6">
                        <label for="filter_prisid" class="form-label"><strong>Filter by Prisoner:</strong></label>
                        <select name="filter_prisid" id="filter_prisid" class="form-select" onchange="this.form.submit()">
                          <option value="all" <?php if (!isset($_POST['filter_prisid']) || $_POST['filter_prisid'] == 'all') echo 'selected'; ?>>All Prisoners</option>
                          <?php
                          $dropdown_query = "SELECT DISTINCT prisid FROM appointments WHERE visitor_id = '$visitor_id'";
                          $dropdown_result = mysqli_query($connection, $dropdown_query);
                          while ($row = mysqli_fetch_assoc($dropdown_result)) {
                            $prisid = htmlspecialchars($row['prisid']);
                            $selected = (isset($_POST['filter_prisid']) && $_POST['filter_prisid'] == $prisid) ? 'selected' : '';
                            echo "<option value='$prisid' $selected>Prisoner ID: $prisid</option>";
                          }
                          ?>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Appointments Section -->
              <div class="row">
                <div class="col-12">
                  <h4 class="mb-4">Your Appointments</h4>
                  
                  <?php
                  $selected_prisid = isset($_POST['filter_prisid']) ? $_POST['filter_prisid'] : 'all';
                  $appointment_query = "SELECT * FROM appointments WHERE visitor_id = '$visitor_id'";
                  
                  if ($selected_prisid !== 'all') {
                    $safe_prisid = mysqli_real_escape_string($connection, $selected_prisid);
                    $appointment_query .= " AND prisid = '$safe_prisid'";
                  }
                  
                  $appointment_result = mysqli_query($connection, $appointment_query);
                  
                  if ($appointment_result && mysqli_num_rows($appointment_result) > 0) {
                    while ($appointment = mysqli_fetch_assoc($appointment_result)) {
                      // Determine card color based on status
                      $status_class = '';
                      $status_icon = '';
                      switch(strtolower($appointment['accept'])) {
                        case 'accepted':
                          $status_class = 'success';
                          $status_icon = 'bx-check-circle';
                          break;
                        case 'rejected':
                          $status_class = 'danger';
                          $status_icon = 'bx-x-circle';
                          break;
                        case 'pending':
                          $status_class = 'warning';
                          $status_icon = 'bx-time-five';
                          break;
                        default:
                          $status_class = 'secondary';
                          $status_icon = 'bx-question-mark';
                      }
                  ?>
                    <div class="card mb-4 border-<?php echo $status_class; ?>">
                      <div class="card-header d-flex justify-content-between align-items-center bg-<?php echo $status_class; ?>-subtle">
                        <h5 class="mb-0">
                          <i class="bx <?php echo $status_icon; ?> me-2"></i>
                          Prisoner ID: <?php echo htmlspecialchars($appointment['prisid']); ?>
                        </h5>
                        <div>
                          <span class="badge bg-<?php echo $status_class; ?>">
                            <?php echo htmlspecialchars($appointment['accept']); ?>
                          </span>
                          <?php if (strtolower($appointment['accept']) === 'rejected'): ?>
                            <button type="button" class="btn btn-sm btn-outline-danger ms-2" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#reasonModal"
                                    data-reason="<?php echo htmlspecialchars($appointment['reply']); ?>">
                              Rejected Reason
                            </button>
                          <?php endif; ?>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="mb-3">
                              <h6 class="text-muted">Visitor Name</h6>
                              <p class="mb-0"><?php echo htmlspecialchars($appointment['name']); ?></p>
                            </div>
                            <div class="mb-3">
                              <h6 class="text-muted">Visit Date</h6>
                              <p class="mb-0"><?php echo htmlspecialchars($appointment['date']); ?></p>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="mb-3">
                              <h6 class="text-muted">Purpose</h6>
                              <p class="mb-0"><?php echo htmlspecialchars($appointment['message']); ?></p>
                            </div>
                            <div class="mb-3">
                              <h6 class="text-muted">Contact Email</h6>
                              <p class="mb-0"><?php echo htmlspecialchars($appointment['email']); ?></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  <?php
                    }
                  } else {
                    echo '<div class="alert alert-info">No appointments found for this selection.</div>';
                  }
                  ?>
                </div>
              </div>

              <!-- Modal for Rejection Reason -->
              <div class="modal fade" id="reasonModal" tabindex="-1" aria-labelledby="reasonModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="reasonModalLabel">Reason for Rejection</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <p id="rejectionReason"></p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core JS -->
    <script src="../assets/vendor/libs/jquery/jquery.js"></script>
    <script src="../assets/vendor/libs/popper/popper.js"></script>
    <script src="../assets/vendor/js/bootstrap.js"></script>
    <script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="../assets/vendor/js/menu.js"></script>
    <!-- Main JS -->
    <script src="../assets/js/main.js"></script>
    <!-- Script to handle modal content -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const reasonModal = document.getElementById('reasonModal');
        reasonModal.addEventListener('show.bs.modal', function (event) {
          const button = event.relatedTarget;
          const reason = button.getAttribute('data-reason');
          const reasonText = document.getElementById('rejectionReason');
          reasonText.textContent = reason || 'No reason provided.';
        });
      });
    </script>
  </body>
</html>
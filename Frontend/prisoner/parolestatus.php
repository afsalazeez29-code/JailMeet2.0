<?php
include('header.php');
include('navbar.php');
include('sidebar.php');
include('db.php');

session_start();

$pris_id = $_SESSION['pris_id'] ?? null;

if ($pris_id) {
    // Fetch parole details from the database for the logged-in prisoner
    $stmt = $conn->prepare("SELECT par_name, par_rel, par_purp, par_msg, par_status, parole_from, parole_to, parole_msg, reject_msg FROM prisoner WHERE pris_id = ?");
    $stmt->bind_param("s", $pris_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $prisoner = $result->fetch_assoc();
        $par_name = htmlspecialchars($prisoner['par_name']);
        $par_rel = htmlspecialchars($prisoner['par_rel']);
        $par_purp = htmlspecialchars($prisoner['par_purp']);
        $par_msg = htmlspecialchars($prisoner['par_msg']);
        $par_status = htmlspecialchars($prisoner['par_status']);
        $parole_from = $prisoner['parole_from'] ? date('F j, Y', strtotime($prisoner['parole_from'])) : 'Not specified';
        $parole_to = $prisoner['parole_to'] ? date('F j, Y', strtotime($prisoner['parole_to'])) : 'Not specified';
        $parole_msg = htmlspecialchars($prisoner['parole_msg'] ?? 'No additional message');
        $reject_msg = htmlspecialchars($prisoner['reject_msg'] ?? 'No rejection reason provided');
        
        // Set status-specific variables
        $status_class = '';
        $status_icon = '';
        $status_title = '';
        
        switch($par_status) {
            case 'Accepted':
                $status_class = 'success';
                $status_icon = 'fa-check-circle';
                $status_title = 'Parole Approved';
                break;
            case 'Rejected':
                $status_class = 'danger';
                $status_icon = 'fa-times-circle';
                $status_title = 'Parole Rejected';
                break;
            case 'Pending':
                $status_class = 'warning';
                $status_icon = 'fa-clock';
                $status_title = 'Parole Under Review';
                break;
            case 'Returned':
                $status_class = 'info';
                $status_icon = 'fa-calendar-check';
                $status_title = 'Parole Completed';
                break;
            default:
                $status_class = 'secondary';
                $status_icon = 'fa-question-circle';
                $status_title = 'Parole Status';
        }
    } else {
        // If no parole details found, set default values
        $par_name = null;
        $par_purp = null;
        $par_msg = null;
        $par_status = null;
        $parole_from = null;
        $parole_to = null;
        $parole_msg = null;
        $reject_msg = null;
        $status_class = 'secondary';
        $status_icon = 'fa-question-circle';
        $status_title = 'No Parole Request';
    }

    $stmt->close();
} else {
    // If no prisoner ID is set in session, show an error message
    $par_name = "Not Logged In";
    $par_purp = null;
    $par_msg = null;
    $par_status = null;
    $parole_from = null;
    $parole_to = null;
    $parole_msg = null;
    $reject_msg = null;
    $status_class = 'secondary';
    $status_icon = 'fa-exclamation-circle';
    $status_title = 'Login Required';
}

$conn->close();
?>

<body class="bg-theme bg-theme1">
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Status Header Card -->
        <div class="card shadow-lg mt-4 border-<?php echo $status_class; ?>">
          <div class="card-header bg-<?php echo $status_class; ?> text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="mb-0">
                <i class="fas <?php echo $status_icon; ?> mr-2"></i>
                <?php echo $status_title; ?>
              </h3>
              <?php if ($par_status): ?>
                <span class="badge badge-light badge-pill py-2 px-3" style="font-size: 1rem;">
                  <?php echo $par_status; ?>
                </span>
              <?php endif; ?>
            </div>
          </div>
          
          <?php if ($par_name && $par_purp): ?>
          <!-- Parole Details Section -->
          <div class="card-body">
            <div class="row">
              <!-- Left Column - Basic Info -->
              <div class="col-md-6">
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <h5 class="mb-0">Request Details</h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th width="40%">Requested By:</th>
                            <td><?php echo $par_name; ?></td>
                          </tr>
                          <tr>
                            <th>Relationship:</th>
                            <td><?php echo $par_rel; ?></td>
                          </tr>
                          <tr>
                            <th>Purpose:</th>
                            <td><?php echo $par_purp; ?></td>
                          </tr>
                          <tr>
                            <th>Message:</th>
                            <td><?php echo $par_msg; ?></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Column - Status Info -->
              <div class="col-md-6">
                <?php if ($par_status == 'Accepted'): ?>
                <div class="card mb-4 border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Approval Details</h5>
                  </div>
                  <div class="card-body">
                    <div class="alert alert-success">
                      <i class="fas fa-check-circle mr-2"></i>
                      Your parole request has been approved!
                    </div>
                    <div class="table-responsive">
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th width="40%">Approved Period:</th>
                            <td><?php echo $parole_from; ?> to <?php echo $parole_to; ?></td>
                          </tr>
                          <tr>
                            <th>Officer's Message:</th>
                            <td><?php echo $parole_msg; ?></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="mt-3">
                      <h6>Conditions:</h6>
                      <ul class="list-group">
                        <li class="list-group-item"><i class="fas fa-check-circle text-success mr-2"></i> Weekly check-ins required</li>
                        <li class="list-group-item"><i class="fas fa-check-circle text-success mr-2"></i> Must stay within approved area</li>
                        <li class="list-group-item"><i class="fas fa-check-circle text-success mr-2"></i> Return by specified date</li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-footer bg-light">
                    <button class="btn btn-outline-success" onclick="window.print()">
                      <i class="fas fa-print mr-2"></i>Print Approval
                    </button>
                  </div>
                </div>
                <?php elseif ($par_status == 'Rejected'): ?>
                <div class="card mb-4 border-danger">
                  <div class="card-header bg-danger text-white">
                    <h5 class="mb-0">Rejection Details</h5>
                  </div>
                  <div class="card-body">
                    <div class="alert alert-danger">
                      <i class="fas fa-times-circle mr-2"></i>
                      Your parole request has been rejected.
                    </div>
                    <div class="table-responsive">
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th width="40%">Rejection Reason:</th>
                            <td><?php echo $reject_msg; ?></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="card-footer bg-light">
                    <button class="btn btn-outline-primary">
                      <i class="fas fa-redo mr-2"></i>Request Review
                    </button>
                  </div>
                </div>
                <?php elseif ($par_status == 'Pending'): ?>
                <div class="card mb-4 border-warning">
                  <div class="card-header bg-warning text-white">
                    <h5 class="mb-0">Review Status</h5>
                  </div>
                  <div class="card-body">
                    <div class="alert alert-warning">
                      <i class="fas fa-clock mr-2"></i>
                      Your parole request is under review.
                    </div>
                    <div class="progress" style="height: 20px;">
                      <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="mt-3 text-center">
                      <small class="text">Typically processed within 7-10 working days</small>
                    </div>
                  </div>
                </div>
                <?php elseif ($par_status == 'Returned'): ?>
                <div class="card mb-4 border-info">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Completion Details</h5>
                  </div>
                  <div class="card-body">
                    <div class="alert alert-info">
                      <i class="fas fa-calendar-check mr-2"></i>
                      Your parole period has been successfully completed.
                    </div>
                    <div class="table-responsive">
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th width="40%">Completed On:</th>
                            <td><?php echo $parole_to; ?></td>
                          </tr>
                          <tr>
                            <th>Officer's Notes:</th>
                            <td><?php echo $parole_msg; ?></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <?php endif; ?>
              </div>
            </div>
          </div>
          <?php else: ?>
          <!-- No Parole Request Section -->
          <div class="card-body text-center py-5">
            <i class="fas fa-file-alt fa-5x text-muted mb-4"></i>
            <h3 class="text-muted">No Parole Request Found</h3>
            <p class="text-muted">You haven't submitted any parole requests yet.</p>
            <a href="parole.php" class="btn btn-primary mt-3">
              <i class="fas fa-plus mr-2"></i>Submit New Request
            </a>
          </div>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script src="assets/js/jquery.min.js"></script>
  <script src="assets/js/popper.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>

  <!-- simplebar js -->
  <script src="assets/plugins/simplebar/js/simplebar.js"></script>
  <!-- sidebar-menu js -->
  <script src="assets/js/sidebar-menu.js"></script>
  <!-- loader scripts -->
  <script src="assets/js/jquery.loading-indicator.js"></script>
  <!-- Custom scripts -->
  <script src="assets/js/app-script.js"></script>

  <!-- Font Awesome for icons -->
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
<?php
include('header.php');
include('navbar.php');
include('sidebar.php');
include('db.php');

session_start();

$pris_id = $_SESSION['pris_id'] ?? null;

$completed_visits = [];
$upcoming_visits = [];

if ($pris_id) {
    // Completed visits (status = Visited)
    $query1 = "SELECT name, email, phno, date, visit_status FROM appointments WHERE prisid = ? AND visit_status = 'Visited' ORDER BY date DESC";
    $stmt1 = $conn->prepare($query1);
    $stmt1->bind_param("s", $pris_id);
    $stmt1->execute();
    $result1 = $stmt1->get_result();

    while ($row = $result1->fetch_assoc()) {
        $completed_visits[] = [
            'name' => htmlspecialchars($row['name']),
            'email' => htmlspecialchars($row['email']),
            'phone' => htmlspecialchars($row['phno']),
            'date' => date('F j, Y', strtotime($row['date'])),
            'status' => htmlspecialchars($row['visit_status'])
        ];
    }
    $stmt1->close();

    // Upcoming visits (accept = Accepted and visit_status = Pending)
    $query2 = "SELECT name, email, phno, date FROM appointments WHERE prisid = ? AND accept = 'Accepted' AND visit_status = 'Pending' ORDER BY date ASC";
    $stmt2 = $conn->prepare($query2);
    $stmt2->bind_param("s", $pris_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();

    while ($row = $result2->fetch_assoc()) {
        $upcoming_visits[] = [
            'name' => htmlspecialchars($row['name']),
            'email' => htmlspecialchars($row['email']),
            'phone' => htmlspecialchars($row['phno']),
            'date' => date('F j, Y', strtotime($row['date']))
        ];
    }
    $stmt2->close();
}

$conn->close();
?>

<body class="bg-theme bg-theme1">
  <div class="container mt-4">
    <!-- Heading and ID -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0"><i class="fas fa-history mr-2"></i>Visitor History</h2>
      <div class="badge badge-primary p-2">
        <i class="fas fa-id-badge mr-1"></i>
        <?php echo htmlspecialchars($pris_id ?? 'Not logged in'); ?>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4" id="visitTabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="completed-tab" data-toggle="tab" href="#completed" role="tab">
          <i class="fas fa-check-circle mr-1"></i> Completed
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="upcoming-tab" data-toggle="tab" href="#upcoming" role="tab">
          <i class="fas fa-calendar-alt mr-1"></i> Upcoming
        </a>
      </li>
    </ul>

    <div class="tab-content" id="visitTabsContent">
      <!-- Completed Tab -->
      <div class="tab-pane fade show active" id="completed" role="tabpanel">
        <?php if (empty($completed_visits)): ?>
          <div class="alert alert-info">
            <i class="fas fa-info-circle mr-2"></i>No completed visits found.
          </div>
        <?php else: ?>
          <div class="row">
            <?php foreach ($completed_visits as $visitor): ?>
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-success text-white d-flex align-items-center">
                    <div class="rounded-circle bg-white p-2 mr-3">
                      <i class="fas fa-user-check text-success"></i>
                    </div>
                    <div>
                      <h5 class="mb-0"><?php echo $visitor['name']; ?></h5>
                      <small class="d-block">Completed Visit</small>
                    </div>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-calendar-day text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Visited Date</small>
                          <p class="mb-0"><?php echo $visitor['date']; ?></p>
                        </div>
                      </li>
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-envelope text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Email</small>
                          <p class="mb-0"><?php echo $visitor['email']; ?></p>
                        </div>
                      </li>
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-phone text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Phone</small>
                          <p class="mb-0"><?php echo $visitor['phone']; ?></p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="card-footer bg-white border-top-0">
                    <span class="badge badge-success badge-pill">
                      <i class="fas fa-check mr-1"></i> Completed
                    </span>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- Upcoming Tab -->
      <div class="tab-pane fade" id="upcoming" role="tabpanel">
        <?php if (empty($upcoming_visits)): ?>
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-circle mr-2"></i>No upcoming visits scheduled.
          </div>
        <?php else: ?>
          <div class="row">
            <?php foreach ($upcoming_visits as $visitor): ?>
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-warning text-dark d-flex align-items-center">
                    <div class="rounded-circle bg-white p-2 mr-3">
                      <i class="fas fa-user-clock text-warning"></i>
                    </div>
                    <div>
                      <h5 class="mb-0"><?php echo $visitor['name']; ?></h5>
                      <small class="d-block">Upcoming Visit</small>
                    </div>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-calendar-day text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Scheduled Date</small>
                          <p class="mb-0"><?php echo $visitor['date']; ?></p>
                        </div>
                      </li>
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-envelope text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Email</small>
                          <p class="mb-0"><?php echo $visitor['email']; ?></p>
                        </div>
                      </li>
                      <li class="list-group-item d-flex align-items-center">
                        <i class="fas fa-phone text-muted mr-3"></i>
                        <div>
                          <small class="text-muted">Phone</small>
                          <p class="mb-0"><?php echo $visitor['phone']; ?></p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="card-footer bg-white border-top-0">
                    <span class="badge badge-warning badge-pill">
                      <i class="fas fa-clock mr-1"></i> Upcoming
                    </span>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
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
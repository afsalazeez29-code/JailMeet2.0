<?php
include('header.php');
include('navbar.php');
include('sidebar.php');
include('db.php');

session_start();

$pris_id = $_SESSION['pris_id'] ?? null;
$can_request = true;
$status_message = '';

if ($pris_id) {
    // Check current parole status
    $status_stmt = $conn->prepare("SELECT par_status, parole_to FROM prisoner WHERE pris_id = ?");
    $status_stmt->bind_param("s", $pris_id);
    $status_stmt->execute();
    $status_result = $status_stmt->get_result();
    
    if ($status_result->num_rows > 0) {
        $status_row = $status_result->fetch_assoc();
        $current_status = $status_row['par_status'];
        $parole_to = $status_row['parole_to'] ?? null;
        
        if ($current_status === 'Pending') {
            $can_request = false;
            $status_message = '<div class="alert alert-warning">You already have a pending parole request. Please wait for approval.</div>';
        } elseif ($current_status === 'Accepted') {
            $can_request = false;
            $end_date = $parole_to ? date('Y-m-d', strtotime($parole_to)) : 'an unspecified date';
            $status_message = '<div class="alert alert-info">Your parole request was accepted and is ongoing until '.$end_date.'.</div>';
        } elseif ($current_status === 'Returned') {
            $status_message = '<div class="alert alert-success">Your previous parole period has been completed successfully.</div>';
        }
    }
    $status_stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit_parole']) && $can_request) {
    $par_name = $_POST['par_name'] ?? '';
    $par_rel = $_POST['relation'] ?? '';
    $par_purp = $_POST['purpose'] ?? '';
    $par_msg = $_POST['message'] ?? '';

    if ($pris_id) {
        $stmt = $conn->prepare("UPDATE prisoner SET par_name = ?, par_rel = ?, par_purp = ?, par_msg = ?, par_status='Pending', parole_to=NULL WHERE pris_id = ?");
        $stmt->bind_param("sssss", $par_name, $par_rel, $par_purp, $par_msg, $pris_id);

        if ($stmt->execute()) {
            echo "<div class='alert alert-success'>Parole request submitted successfully.</div>";
        } else {
            echo "<div class='alert alert-danger'>Error submitting request: " . $stmt->error . "</div>";
        }

        $stmt->close();
    } else {
        echo "<div class='alert alert-warning'>User not logged in.</div>";
    }
}

$conn->close();
?>

<body class="bg-theme bg-theme1">
  <!-- Parole Request Form -->
  <div class="card mt-4">
    <div class="card-header">
      <h5 class="mb-0">Request Parole</h5>
    </div>
    <div class="card-body">
      <?php 
      // Show status message if exists
      if (!empty($status_message)) {
          echo $status_message;
      }
      
      // Only show form if allowed to request
      if ($can_request): 
      ?>
      <form method="POST" action="">
        <div class="form-group">
          <label class="text-white">Your Name</label>
          <input type="text" name="par_name" class="form-control" required>
        </div>

        <div class="form-group">
          <label class="text-white">Relationship to Prisoner</label>
          <select name="relation" class="form-control" required>
            <option value="">-- Select Relationship --</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Wife">Wife</option>
            <option value="Husband">Husband</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="text-white">Purpose of Parole</label>
          <input type="text" name="purpose" class="form-control" required>
        </div>

        <div class="form-group">
          <label class="text-white">Message</label>
          <textarea name="message" class="form-control" rows="4" required></textarea>
        </div>

        <button type="submit" name="submit_parole" class="btn btn-primary btn-block">Submit Parole Request</button>
      </form>
      <?php endif; ?>
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
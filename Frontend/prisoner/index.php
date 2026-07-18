<?php
include('header.php');
include('navbar.php');
include('sidebar.php');
include('db.php');

session_start();

$pris_id = $_SESSION['pris_id'] ?? null;
$visitation_status = '<span class="badge badge-secondary">Login to view status</span>';
$parole_finished_info = ''; // Initialize variable for parole finished info
$multiple_visitors = false; // Flag for multiple visitors
$visitors_list = []; // Array to store visitors for popover

if ($pris_id) {
    if (!isset($conn) || $conn->connect_error) {
        include('db.php'); // Ensure connection
    }

    // Fetch prisoner details (now including pris_cell, parole_to, and fir)
    $stmt = $conn->prepare("SELECT pris_id, pris_name, pris_age, pris_case, jailtype, jailname, pris_adm, pris_period, fir_number, fir, checkup, blood, allergies, dp, par_status, pris_cell, parole_to FROM prisoner WHERE pris_id = ?");
    
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $pris_id);

    if (!$stmt->execute()) {
        die("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $prisoner = $result->fetch_assoc();
        $display_id = htmlspecialchars($prisoner['pris_id']);
        $display_name = htmlspecialchars($prisoner['pris_name']);
        $display_age = htmlspecialchars($prisoner['pris_age']);
        $display_crime = htmlspecialchars($prisoner['pris_case']);
        $display_jailtype = htmlspecialchars($prisoner['jailtype']);
        $display_jailname = htmlspecialchars($prisoner['jailname']);
        $display_adm_date = htmlspecialchars($prisoner['pris_adm']);
        $display_period = htmlspecialchars($prisoner['pris_period']);
        $display_fir = !empty($prisoner['fir_number']) ? htmlspecialchars($prisoner['fir_number']) : 'FIR not registered';
        $display_fir_details = !empty($prisoner['fir']) ? htmlspecialchars($prisoner['fir']) : 'No FIR details available';
        $display_checkup = htmlspecialchars($prisoner['checkup']);
        $display_blood = htmlspecialchars($prisoner['blood']);
        $display_allergies = htmlspecialchars($prisoner['allergies']);
        $display_parole = htmlspecialchars($prisoner['par_status']);
        $display_cell = !empty($prisoner['pris_cell']) ? htmlspecialchars($prisoner['pris_cell']) : 'Not assigned';
        $parole_to = $prisoner['parole_to'];

        $image_path = '../images.png';
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
        $display_cell = "Not assigned";
        $image_path = '../images.png';
        $display_fir = 'FIR not registered';
        $display_fir_details = 'No FIR details available';
    }

    $stmt->close();

    // Fetch all pending visitation appointments
    $visitation_stmt = $conn->prepare("SELECT date, name FROM appointments WHERE prisid = ? AND UPPER(accept) = 'ACCEPTED' AND LOWER(visit_status) = 'pending' ORDER BY date DESC");

    if ($visitation_stmt) {
        $visitation_stmt->bind_param("s", $pris_id);

        if ($visitation_stmt->execute()) {
            $visitation_result = $visitation_stmt->get_result();

            if ($visitation_result && $visitation_result->num_rows > 0) {
                // Store all visitors for popover
                while ($appointment = $visitation_result->fetch_assoc()) {
                    $visitors_list[] = [
                        'name' => htmlspecialchars($appointment['name']),
                        'date' => htmlspecialchars($appointment['date'])
                    ];
                }

                // Check if there are multiple visitors
                if ($visitation_result->num_rows > 1) {
                    $multiple_visitors = true;
                    // Show the first visitor in the status
                    $first_visitor = $visitors_list[0];
                    $visitation_status = '<span class="badge badge-warning">Pending Visit on ' . $first_visitor['date'] . ' by ' . $first_visitor['name'] . '</span>';
                } else {
                    // Single visitor
                    $appointment = $visitors_list[0];
                    $visitation_status = '<span class="badge badge-warning">Pending Visit on ' . $appointment['date'] . ' by ' . $appointment['name'] . '</span>';
                }
            } else {
                $visitation_status = '<span class="badge badge-danger">No Visitors</span>';
            }
        } else {
            $visitation_status = '<span class="badge badge-warning">Error fetching status</span>';
        }

        $visitation_stmt->close();
    } else {
        $visitation_status = '<span class="badge badge-warning">Error: ' . htmlspecialchars($conn->error) . '</span>';
    }

    $conn->close();
} else {
    $display_id = "Not Logged In";
    $display_name = "Guest";
    $display_cell = "Not assigned";
    $image_path = '../images.png';
    $display_fir = 'FIR not registered';
    $display_fir_details = 'No FIR details available';
}
?>

<body class="bg-theme bg-theme1">
  <div class="card">
    <div class="card-header">
      <h5>Prisoner Profile</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <!-- Left Column -->
        <div class="col-md-4 text-center">
          <div class="prisoner-photo mb-4">
            <img src="<?php echo $image_path; ?>" 
                 alt="Prisoner Photo" 
                 class="img-thumbnail" 
                 style="max-height: 300px;"
                 onerror="this.src='../images.png'">
          </div>
          <div class="prisoner-id">
            <h4 class="text-primary">ID: <?php echo $display_id; ?></h4>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-8">
          <?php echo $parole_finished_info; // Display parole finished info if applicable ?>
          
          <div class="table-responsive">
            <table class="table table-bordered">
              <tbody>
                <tr><th width="30%">Full Name</th><td><?php echo $display_name; ?></td></tr>
                <tr><th>Age</th><td><?php echo $display_age; ?></td></tr>
                <tr><th>Crime</th><td><?php echo $display_crime; ?></td></tr>
                <tr><th>Jail Type</th><td><?php echo $display_jailtype; ?></td></tr>
                <tr><th>Jail Name</th><td><?php echo $display_jailname; ?></td></tr>
                <tr><th>Date of Incarceration</th><td><?php echo $display_adm_date; ?></td></tr>
                <tr><th>Duration</th><td><?php echo $display_period; ?></td></tr>
                <tr>
                  <th>FIR Number</th>
                  <td>
                    <?php echo $display_fir; ?>
                    <?php if ($display_fir !== 'FIR not registered'): ?>
                      <button type="button" 
                              class="btn btn-sm btn-primary ml-2 fir-popover" 
                              data-bs-toggle="popover" 
                              data-bs-placement="top" 
                              data-bs-trigger="click"
                              data-fir="<?php echo htmlspecialchars(json_encode($display_fir_details)); ?>">
                        <i class="fas fa-eye mr-1"></i> View
                      </button>
                    <?php endif; ?>
                  </td>
                </tr>
                <tr>
                  <th>Parole Status</th>
                  <td>
                    <?php
                    $status = $prisoner['par_status'] ?? null;
                    $status = $status ? strtolower(trim($status)) : null;
                    $parole_to = $prisoner['parole_to'] ?? null;

                    if ($status === null) {
                        echo '<span class="badge badge-secondary">Not Requested</span>';
                    } elseif ($status === 'pending') {
                        echo '<span class="badge badge-warning">Pending</span>';
                    } elseif ($status === 'accepted') {
                        echo '<span class="badge badge-success">Accepted</span>';
                    } elseif ($status === 'rejected') {
                        echo '<span class="badge badge-danger">Rejected</span>';
                    } elseif ($status === 'returned') {
                        if (!empty($parole_to)) {
                            echo '<span class="badge badge-info">Returned</span><br>';
                            echo '<small class="text-muted">Parole period finished on: ' . htmlspecialchars($parole_to) . '</small>';
                        } else {
                            echo '<span class="badge badge-info">Returned</span>';
                        }
                    } else {
                        echo '<span class="badge badge-dark">Unknown (' . htmlspecialchars($prisoner['par_status']) . ')</span>';
                    }
                    ?>
                  </td>
                </tr>
                <tr><th>Cell Block</th><td><?php echo $display_cell; ?></td></tr>
                <tr>
                  <th>Visitation Status</th>
                  <td>
                    <?php echo $visitation_status; ?>
                    <?php if ($multiple_visitors): ?>
                      <button type="button" 
                              class="btn btn-sm btn-primary ml-2 visitors-popover" 
                              data-bs-toggle="popover" 
                              data-bs-placement="top" 
                              data-bs-trigger="click"
                              data-visitors='<?php echo json_encode($visitors_list); ?>'>
                        <i class="fas fa-eye mr-1"></i> View All Visitors
                      </button>
                    <?php endif; ?>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="additional-info mt-4">
            <h5 class="mb-3">Additional Information</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="info-box bg-light p-3 mb-3">
                  <h6>Medical Records</h6>
                  <p class="mb-1">Last checkup: <?php echo $display_checkup; ?></p>
                  <p class="mb-1">Blood Type: <?php echo $display_blood; ?></p>
                  <p>Allergies: <?php echo $display_allergies; ?></p>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
    </div> <!-- card-body -->
  </div> <!-- card -->

</div>
<!-- End container-fluid-->
</div><!--End content-wrapper-->

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

<!-- Popover Initialization Script -->
<script>
$(document).ready(function() {
    // Visitors Popover
    $('.visitors-popover').each(function() {
        const $button = $(this);
        const visitors = JSON.parse($button.attr('data-visitors') || '[]');
        
        // Generate popover content
        let content = '<div style="max-height: 150px; overflow-y: auto;">';
        if (visitors.length > 0) {
            content += '<ul class="list-unstyled mb-0">';
            visitors.forEach(visitor => {
                content += `
                    <li class="mb-2">
                        <i class="fas fa-user mr-2"></i>
                        <strong>${visitor.name}</strong><br>
                        <small class="text-muted">Visit: ${visitor.date}</small>
                    </li>
                `;
            });
            content += '</ul>';
        } else {
            content += '<p class="text-muted mb-0">No pending visitors.</p>';
        }
        content += '</div>';

        // Initialize popover
        $button.popover({
            html: true,
            content: content,
            placement: 'top',
            trigger: 'click',
            container: 'body',
            boundary: 'viewport',
            template: `
                <div class="popover" role="tooltip">
                    <div class="arrow"></div>
                    <h3 class="popover-header bg-primary text-white">
                        <i class="fas fa-users mr-2"></i>Pending Visitors
                    </h3>
                    <div class="popover-body"></div>
                </div>
            `
        });
    });

    // FIR Details Popover
    $('.fir-popover').each(function() {
        const $button = $(this);
        const firDetails = JSON.parse($button.attr('data-fir') || '"No FIR details available"');
        
        // Generate popover content
        let content = '<div style="max-height: 150px; overflow-y: auto;">';
        content += `<p class="mb-0">${firDetails}</p>`;
        content += '</div>';

        // Initialize popover
        $button.popover({
            html: true,
            content: content,
            placement: 'top',
            trigger: 'click',
            container: 'body',
            boundary: 'viewport',
            template: `
                <div class="popover" role="tooltip">
                    <div class="arrow"></div>
                    <h3 class="popover-header bg-primary text-white">
                        <i class="fas fa-file-alt mr-2"></i>FIR Details
                    </h3>
                    <div class="popover-body"></div>
                </div>
            `
        });
    });

    // Ensure only one popover is visible at a time
    $(document).on('click', '.visitors-popover, .fir-popover', function() {
        $('.visitors-popover').not(this).popover('hide');
        $('.fir-popover').not(this).popover('hide');
    });

    // Hide popover when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.popover').length && 
            !$(e.target).hasClass('visitors-popover') && 
            !$(e.target).hasClass('fir-popover')) {
            $('.visitors-popover').popover('hide');
            $('.fir-popover').popover('hide');
        }
    });
});
</script>

</body>
</html>
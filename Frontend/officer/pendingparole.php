<?php
ob_start(); // Start output buffering at the very top
session_start();
include('db.php');

// Handle form submission to update parole status (Accept or Reject)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = mysqli_real_escape_string($connection, $_POST['pris_id']);
    $action = $_POST['action'];

    if ($action === 'accept_with_details') {
        $parole_status = 'Accepted';
        $parole_from = mysqli_real_escape_string($connection, $_POST['parole_from']);
        $parole_to = mysqli_real_escape_string($connection, $_POST['parole_to']);
        $parole_msg = mysqli_real_escape_string($connection, $_POST['parole_msg']);

        $updateQuery = "UPDATE prisoner 
                        SET par_status = '$parole_status', 
                            parole_from = '$parole_from', 
                            parole_to = '$parole_to', 
                            parole_msg = '$parole_msg' 
                        WHERE pris_id = '$pris_id'";
    } elseif ($action === 'reject') {
        $parole_status = 'Rejected';
        $updateQuery = "UPDATE prisoner SET par_status = '$parole_status' WHERE pris_id = '$pris_id'";
    }

    if (isset($updateQuery)) {
        $result = mysqli_query($connection, $updateQuery);

        if ($result) {
            $_SESSION['success'] = 'Parole status updated successfully';
            ob_end_clean(); // Clean the buffer before redirect
            header("Location: requests.php");
            exit();
        } else {
            $error = "Error updating record: " . mysqli_error($connection);
        }
    }
}

// Fetch only PENDING parole requests with prisoner details
$query = "SELECT pris_id, par_name, par_rel, par_purp, par_status, par_msg FROM prisoner WHERE par_status = 'Pending'";
$result = mysqli_query($connection, $query);

// Now include your header files AFTER potential redirects
include('navbar.php');
include('sidebar.php');
?>

<!DOCTYPE html>
<html>
<head>
    <!-- Basic Page Info -->
    <meta charset="utf-8">
    <title>JailMeet Officer</title>

    <!-- Site favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="vendors/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="vendors/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="vendors/images/favicon-16x16.png">

    <!-- Mobile Specific Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="vendors/styles/core.css">
    <link rel="stylesheet" type="text/css" href="vendors/styles/icon-font.min.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/styles/style.css">
</head>
<body style="padding-left: 250px; padding-top: 100px;">
<div class="container">
    <h2 class="mb-4">Pending Parole Requests</h2>

    <?php 
    // Display success message if exists
    if (isset($_SESSION['success'])) {
        echo '<div class="alert alert-success alert-dismissible fade show">';
        echo $_SESSION['success'];
        echo '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        echo '</div>';
        unset($_SESSION['success']);
    }
    
    // Display error message if exists
    if (isset($error)) {
        echo '<div class="alert alert-danger alert-dismissible fade show">';
        echo $error;
        echo '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        echo '</div>';
    }

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)): 
            if (!empty($row['par_name']) && !empty($row['par_rel']) && !empty($row['par_purp'])): 
    ?>
    <div class="card mb-4">
        <div class="card-header">
            <h5 class="mb-0">Parole Request - <?php echo htmlspecialchars($row['par_name']); ?></h5>
        </div>
        <div class="card-body">
            <p><strong>Purpose of Parole: </strong><?php echo htmlspecialchars($row['par_purp']); ?></p>
            <p><strong>Status: </strong>
                <span class="badge badge-warning">
                    <?php echo htmlspecialchars($row['par_status']); ?>
                </span>
            </p>

            <!-- View Button -->
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#viewModal<?php echo $row['pris_id']; ?>">View</button>

            <!-- Accept Button -->
            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#acceptModal<?php echo $row['pris_id']; ?>">Accept</button>

            <!-- Reject Button -->
            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#rejectModal<?php echo $row['pris_id']; ?>">Reject</button>
        </div>
    </div>

    <!-- View Modal -->
    <div class="modal fade" id="viewModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Parole Request Details</h5>
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <p><strong>Name:</strong> <?php echo htmlspecialchars($row['par_name']); ?></p>
                    <p><strong>Relation:</strong> <?php echo htmlspecialchars($row['par_rel']); ?></p>
                    <p><strong>Purpose:</strong> <?php echo htmlspecialchars($row['par_purp']); ?></p>
                    <?php if (!empty($row['par_msg'])): ?>
                    <p><strong>Message:</strong> <?php echo htmlspecialchars($row['par_msg']); ?></p>
                    <?php endif; ?>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Accept Modal -->
    <div class="modal fade" id="acceptModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="POST">
                    <div class="modal-header">
                        <h5 class="modal-title">Enter Parole Details</h5>
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="pris_id" value="<?php echo $row['pris_id']; ?>">
                        <input type="hidden" name="action" value="accept_with_details">
                        <div class="form-group">
                            <label>Parole From</label>
                            <input type="date" name="parole_from" class="form-control" required min="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="form-group">
                            <label>Parole To</label>
                            <input type="date" name="parole_to" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea name="parole_msg" class="form-control" rows="3" required placeholder="Enter any parole message..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">Submit Parole</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Reject Modal -->
    <div class="modal fade" id="rejectModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="POST">
                    <div class="modal-header">
                        <h5 class="modal-title">Reject Parole Request</h5>
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="pris_id" value="<?php echo $row['pris_id']; ?>">
                        <input type="hidden" name="action" value="reject">
                        <div class="form-group">
                            <label>Rejection Reason</label>
                            <textarea name="parole_msg" class="form-control" rows="3" required placeholder="Please provide a reason for rejection..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-danger">Confirm Rejection</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <?php 
            endif;
        endwhile;
    } else {
        echo '<div class="alert alert-info">No pending parole requests found.</div>';
    }
    ?>
</div>

<!-- js -->
<script src="vendors/scripts/core.js"></script>
<script src="vendors/scripts/script.min.js"></script>
<script src="vendors/scripts/process.js"></script>
<script src="vendors/scripts/layout-settings.js"></script>
<script src="src/plugins/datatables/js/jquery.dataTables.min.js"></script>
<script src="src/plugins/datatables/js/dataTables.bootstrap4.min.js"></script>

<!-- Date Validation Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for "to" date fields based on "from" date
    document.querySelectorAll('input[name="parole_from"]').forEach(function(fromInput) {
        fromInput.addEventListener('change', function() {
            const toInput = this.closest('.modal-content').querySelector('input[name="parole_to"]');
            if (this.value) {
                const fromDate = new Date(this.value);
                const minToDate = new Date(fromDate);
                minToDate.setDate(fromDate.getDate() + 1);
                toInput.min = minToDate.toISOString().split('T')[0];
                
                // Clear to date if it's before the new minimum
                if (toInput.value && new Date(toInput.value) <= fromDate) {
                    toInput.value = '';
                }
            }
        });
    });
});
</script>
</body>
</html>
<?php ob_end_flush(); ?>
<?php
ob_start(); // Start output buffering at the very beginning
session_start();
include('db.php');

// Process form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && isset($_POST['pris_id'])) {
        $pris_id = mysqli_real_escape_string($connection, $_POST['pris_id']);
        $message = mysqli_real_escape_string($connection, $_POST['parole_msg'] ?? '');
        
        if ($_POST['action'] === 'accept') {
            $from_date = mysqli_real_escape_string($connection, $_POST['parole_from']);
            $to_date = mysqli_real_escape_string($connection, $_POST['parole_to']);
            
            $query = "UPDATE prisoner SET 
                      par_status = 'Accepted',
                      parole_from = '$from_date',
                      parole_to = '$to_date',
                      parole_msg = '$message'
                      WHERE pris_id = '$pris_id'";
            
            $success_message = "Parole request accepted successfully!";
        } elseif ($_POST['action'] === 'reject') {
            $query = "UPDATE prisoner SET 
                      par_status = 'Rejected',
                      reject_msg = '$message'
                      WHERE pris_id = '$pris_id'";
            
            $success_message = "Parole request rejected successfully!";
        }
        
        if (isset($query)) {
            if (mysqli_query($connection, $query)) {
                $_SESSION['success'] = $success_message;
                ob_end_clean(); // Clean the buffer before redirect
                header("Location: requests.php");
                exit();
            } else {
                $error = "Database error: " . mysqli_error($connection);
            }
        }
    }
}

// Fetch parole requests with prisoner details
$query = "SELECT pris_id, pris_name, par_name, par_rel, par_purp, par_status, par_msg FROM prisoner WHERE par_status IS NOT NULL";
$result = mysqli_query($connection, $query);

// Get today's date for the min attribute
$today = date('Y-m-d');

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

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-119386393-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-119386393-1');
    </script>
</head>
<body style="padding-left: 250px; padding-top: 100px;">
    <div class="container">
        <h2 class="mb-4">Parole Requests</h2>
        
        <?php if (isset($_SESSION['success'])): ?>
            <div class="alert alert-success alert-dismissible fade show">
                <?php echo $_SESSION['success']; ?>
                <button type="button" class="close" data-dismiss="alert">×</button>
            </div>
            <?php unset($_SESSION['success']); ?>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="alert alert-danger alert-dismissible fade show">
                <?php echo $error; ?>
                <button type="button" class="close" data-dismiss="alert">×</button>
            </div>
        <?php endif; ?>

        <?php while ($row = mysqli_fetch_assoc($result)): ?>
            <?php if (!empty($row['par_name']) && !empty($row['par_rel']) && !empty($row['par_purp'])): ?>
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Parole Request - <?php echo htmlspecialchars($row['pris_name']); ?></h5>
                </div>
                <div class="card-body">
                    <p><strong>Requested By: </strong><?php echo htmlspecialchars($row['par_name']); ?> (<?php echo htmlspecialchars($row['par_rel']); ?>)</p>
                    <p><strong>Purpose of Parole: </strong><?php echo htmlspecialchars($row['par_purp']); ?></p>
                    <p><strong>Status: </strong>
                        <span class="badge <?php echo $row['par_status'] == 'Accepted' ? 'badge-success' : 
                                ($row['par_status'] == 'Rejected' ? 'badge-danger' : 'badge-warning'); ?>">
                            <?php echo htmlspecialchars($row['par_status']); ?>
                        </span>
                    </p>

                    <?php if ($row['par_status'] == 'Pending'): ?>
                        <!-- View Button -->
                        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#viewModal<?php echo $row['pris_id']; ?>">
                            View Details
                        </button>

                        <!-- Accept Button -->
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#acceptModal<?php echo $row['pris_id']; ?>">
                            Accept
                        </button>

                        <!-- Reject Button -->
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#rejectModal<?php echo $row['pris_id']; ?>">
                            Reject
                        </button>
                    <?php endif; ?>
                </div>
            </div>

            <!-- View Details Modal -->
            <div class="modal fade" id="viewModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Parole Request Details</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Prisoner Name:</strong> <?php echo htmlspecialchars($row['pris_name']); ?></p>
                            <p><strong>Requested By:</strong> <?php echo htmlspecialchars($row['par_name']); ?></p>
                            <p><strong>Relationship:</strong> <?php echo htmlspecialchars($row['par_rel']); ?></p>
                            <p><strong>Purpose:</strong> <?php echo htmlspecialchars($row['par_purp']); ?></p>
                            <?php if (!empty($row['par_msg'])): ?>
                                <p><strong>Additional Message:</strong> <?php echo htmlspecialchars($row['par_msg']); ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Accept Modal -->
            <div class="modal fade" id="acceptModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <form method="POST">
                            <input type="hidden" name="action" value="accept">
                            <input type="hidden" name="pris_id" value="<?php echo $row['pris_id']; ?>">
                            <div class="modal-header">
                                <h5 class="modal-title">Accept Parole Request</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Parole From Date</label>
                                    <input type="date" class="form-control parole-from" name="parole_from" id="parole_from_<?php echo $row['pris_id']; ?>" min="<?php echo $today; ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Parole To Date</label>
                                    <input type="date" class="form-control parole-to" name="parole_to" id="parole_to_<?php echo $row['pris_id']; ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Approval Message</label>
                                    <textarea class="form-control" name="parole_msg" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-success">Confirm Acceptance</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Reject Modal -->
            <div class="modal fade" id="rejectModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <form method="POST">
                            <input type="hidden" name="action" value="reject">
                            <input type="hidden" name="pris_id" value="<?php echo $row['pris_id']; ?>">
                            <div class="modal-header">
                                <h5 class="modal-title">Reject Parole Request</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Rejection Reason</label>
                                    <textarea class="form-control" name="parole_msg" rows="3" required></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-danger">Confirm Rejection</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        <?php endwhile; ?>
    </div>
    <!-- js -->
    <script src="vendors/scripts/core.js"></script>
    <script src="vendors/scripts/script.min.js"></script>
    <script src="vendors/scripts/process.js"></script>
    <script src="vendors/scripts/layout-settings.js"></script>
    <script src="src/plugins/apexcharts/apexcharts.min.js"></script>
    <script src="src/plugins/datatables/js/jquery.dataTables.min.js"></script>
    <script src="src/plugins/datatables/js/dataTables.bootstrap4.min.js"></script>
    <script src="src/plugins/datatables/js/dataTables.responsive.min.js"></script>
    <script src="src/plugins/datatables/js/responsive.bootstrap4.min.js"></script>
    <script src="vendors/scripts/dashboard.js"></script>

    <!-- JavaScript for Date Restrictions -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Select all parole-from and parole-to inputs
            const fromInputs = document.querySelectorAll('.parole-from');
            fromInputs.forEach(fromInput => {
                const modal = fromInput.closest('.modal-content');
                const toInput = modal.querySelector('.parole-to');

                fromInput.addEventListener('change', function() {
                    const fromDate = new Date(this.value);
                    if (fromDate) {
                        // Set min for toDate as fromDate + 1 day
                        const minToDate = new Date(fromDate);
                        minToDate.setDate(fromDate.getDate() + 1);
                        toInput.min = minToDate.toISOString().split('T')[0];
                        
                        // Clear toDate if it's on or before fromDate
                        if (toInput.value && new Date(toInput.value) <= fromDate) {
                            toInput.value = '';
                        }
                    } else {
                        toInput.min = '';
                    }
                });
            });
        });
    </script>
</body>
</html>
<?php ob_end_flush(); // Ensure buffer is flushed at the end ?>
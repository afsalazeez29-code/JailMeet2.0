<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
include('db.php');

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appid = isset($_POST['appid']) ? (int)$_POST['appid'] : 0;

    if ($appid <= 0) {
        echo "<script>alert('Invalid Appointment ID');</script>";
    } else {
        if (isset($_POST['accept_btn'])) {
            // Accept appointment
            $query = "UPDATE appointments SET accept='Accepted' WHERE id=?";
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, "i", $appid);

            if (mysqli_stmt_execute($stmt)) {
                echo "<script>
                    alert('Appointment Accepted');
                    window.location.href='newappointment.php';
                </script>";
                exit();
            } else {
                echo "<script>alert('Error accepting appointment: " . mysqli_error($connection) . "');</script>";
            }
        } 
        elseif (isset($_POST['reject_btn'])) {
            // Reject appointment with reason
            $reply = mysqli_real_escape_string($connection, $_POST['reply_msg']);
            $query = "UPDATE appointments SET reply=?, accept='Rejected' WHERE id=?";
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, "si", $reply, $appid);

            if (mysqli_stmt_execute($stmt)) {
                echo "<script>
                    alert('Appointment Rejected');
                    window.location.href='newappointment.php';
                </script>";
                exit();
            } else {
                echo "<script>alert('Error rejecting appointment: " . mysqli_error($connection) . "');</script>";
            }
        }
        elseif (isset($_POST['visited_btn'])) {
            // Mark as visited (without deleting)
            $query = "UPDATE appointments SET visit_status='Visited' WHERE id=?";
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, "i", $appid);
            
            if (mysqli_stmt_execute($stmt)) {
                echo "<script>
                    alert('Appointment marked as Visited');
                    window.location.href='newappointment.php';
                </script>";
                exit();
            } else {
                echo "<script>alert('Error marking as visited: " . mysqli_error($connection) . "');</script>";
            }
        }
        elseif (isset($_POST['not_visited_btn'])) {
            // Mark as not visited (without deleting)
            $query = "UPDATE appointments SET visit_status='Not Visited' WHERE id=?";
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, "i", $appid);
            
            if (mysqli_stmt_execute($stmt)) {
                echo "<script>
                    alert('Appointment marked as Not Visited');
                    window.location.href='newappointment.php';
                </script>";
                exit();
            } else {
                echo "<script>alert('Error marking as not visited: " . mysqli_error($connection) . "');</script>";
            }
        }
        elseif (isset($_POST['delete_btn'])) {
            // Delete appointment
            $query = "DELETE FROM appointments WHERE id=?";
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, "i", $appid);
            
            if (mysqli_stmt_execute($stmt)) {
                echo "<script>
                    alert('Appointment Deleted');
                    window.location.href='newappointment.php';
                </script>";
                exit();
            } else {
                echo "<script>alert('Error deleting appointment: " . mysqli_error($connection) . "');</script>";
            }
        }
    }
}

// Include header files
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
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
<body style="padding-left: 250px; padding-top: 53px;">
<div class="container mt-5">
    <h4 class="mb-4"><i class="fas fa-calendar-check mr-2"></i>Visit Appointment Management</h4>
    
    <!-- Tabs for different appointment statuses -->
    <ul class="nav nav-tabs" id="appointmentTabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab">
                <i class="fas fa-list mr-1"></i> All Appointments
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="pending-tab" data-toggle="tab" href="#pending" role="tab">
                <i class="fas fa-hourglass-half mr-1"></i> Pending
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="accepted-tab" data-toggle="tab" href="#accepted" role="tab">
                <i class="fas fa-check-circle mr-1"></i> Accepted
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="rejected-tab" data-toggle="tab" href="#rejected" role="tab">
                <i class="fas fa-times-circle mr-1"></i> Rejected
            </a>
        </li>
    </ul>
    
    <div class="tab-content" id="appointmentTabsContent">
        <!-- All Appointments Tab -->
        <div class="tab-pane fade show active" id="all" role="tabpanel">
            <div class="row mt-3">
                <?php
                $query = "SELECT * FROM appointments ORDER BY date DESC";
                $result = mysqli_query($connection, $query);

                if (!$result) {
                    die("Database error: " . mysqli_error($connection));
                }

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $modalId = $row['id'];
                        $name = htmlspecialchars($row['name']);
                        $email = htmlspecialchars($row['email']);
                        $prisid = htmlspecialchars($row['prisid']);
                        $phno = htmlspecialchars($row['phno']);
                        $date = htmlspecialchars($row['date']);
                        $message = htmlspecialchars($row['message']);
                        $status = htmlspecialchars($row['accept']);
                        $visitStatus = htmlspecialchars($row['visit_status'] ?? 'Pending');
                ?>
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0"><i class="fas fa-user mr-2"></i><?= $name ?></h5>
                        </div>
                        <div class="card-body">
                            <div class="card-text">
                                <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                <p><i class="fas fa-info-circle mr-2"></i> <strong>Status:</strong> 
                                    <span class="badge badge-<?= $status === 'Accepted' ? 'success' : ($status === 'Rejected' ? 'danger' : 'warning') ?>">
                                        <i class="fas <?= $status === 'Accepted' ? 'fa-check' : ($status === 'Rejected' ? 'fa-times' : 'fa-clock') ?> mr-1"></i> <?= $status ?: 'Pending' ?>
                                    </span>
                                </p>
                                <p><i class="fas fa-user-clock text-info mr-2"></i> <strong>Visit Status:</strong> 
                                    <span class="badge badge-<?= $visitStatus === 'Visited' ? 'success' : ($visitStatus === 'Not Visited' ? 'danger' : 'secondary') ?>">
                                        <i class="fas <?= $visitStatus === 'Visited' ? 'fa-check-circle' : ($visitStatus === 'Not Visited' ? 'fa-times-circle' : 'fa-hourglass-half') ?> mr-1"></i> <?= $visitStatus ?>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100">
                                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#allViewModal<?= $modalId ?>">
                                    <i class="fas fa-eye mr-1"></i> View
                                </button>
                                <?php if ($status !== 'Rejected') { ?>
                                <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#allRejectModal<?= $modalId ?>">
                                    <i class="fas fa-times mr-1"></i> Reject
                                </button>
                                <?php } ?>
                                <button class="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#allDeleteModal<?= $modalId ?>">
                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Modal for All -->
                <div class="modal fade" id="allViewModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-primary text-white">
                                    <h5 class="modal-title"><i class="fas fa-calendar-alt mr-2"></i>Appointment Details</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p><i class="fas fa-user text-primary mr-2"></i> <strong>Name:</strong> <?= $name ?></p>
                                            <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                            <p><i class="fas fa-phone text-primary mr-2"></i> <strong>Phone:</strong> <?= $phno ?></p>
                                        </div>
                                        <div class="col-md-6">
                                            <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                            <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                            <p><i class="fas fa-info-circle mr-2"></i> <strong>Status:</strong> 
                                                <span class="badge badge-<?= $status === 'Accepted' ? 'success' : ($status === 'Rejected' ? 'danger' : 'warning') ?>">
                                                    <i class="fas <?= $status === 'Accepted' ? 'fa-check' : ($status === 'Rejected' ? 'fa-times' : 'fa-clock') ?> mr-1"></i> <?= $status ?: 'Pending' ?>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="form-group mt-3">
                                        <label><i class="fas fa-comment-dots text-secondary mr-2"></i> <strong>Message:</strong></label>
                                        <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <?php if ($status === 'Pending') { ?>
                                        <button type="submit" name="accept_btn" class="btn btn-success">
                                            <i class="fas fa-check mr-1"></i> Accept
                                        </button>
                                    <?php } ?>
                                    <?php if ($status === 'Accepted') { ?>
                                        <button type="submit" name="visited_btn" class="btn btn-success">
                                            <i class="fas fa-check-circle mr-1"></i> Mark Visited
                                        </button>
                                        <button type="submit" name="not_visited_btn" class="btn btn-warning">
                                            <i class="fas fa-times-circle mr-1"></i> Mark Not Visited
                                        </button>
                                    <?php } ?>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Reject Modal for All -->
                <div class="modal fade" id="allRejectModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-danger text-white">
                                    <h5 class="modal-title"><i class="fas fa-ban mr-2"></i>Reject Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-exclamation-triangle text-danger mr-2"></i> Are you sure you want to reject this appointment?</p>
                                    <p><i class="fas fa-user mr-2"></i> <strong>Visitor:</strong> <?= $name ?></p>
                                    <p><i class="fas fa-id-card mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                    <div class="form-group mt-3">
                                        <label><i class="fas fa-comment-medical text-danger mr-2"></i> <strong>Reason for rejection:</strong></label>
                                        <textarea class="form-control" name="reply_msg" rows="3" required placeholder="Enter reason for rejection..."></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="reject_btn" class="btn btn-danger">
                                        <i class="fas fa-ban mr-1"></i> Confirm Reject
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Delete Modal for All -->
                <div class="modal fade" id="allDeleteModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-danger text-white">
                                    <h5 class="modal-title"><i class="fas fa-trash-alt mr-2"></i>Delete Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-exclamation-circle text-danger mr-2"></i> Are you sure you want to permanently delete this appointment?</p>
                                    <p class="text-danger"><i class="fas fa-exclamation-triangle mr-2"></i> <strong>This action cannot be undone!</strong></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="delete_btn" class="btn btn-danger">
                                        <i class="fas fa-trash-alt mr-1"></i> Delete
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <?php 
                    }
                } else {
                    echo '<div class="col-12"><div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i> No appointments found.</div></div>';
                }
                ?>
            </div>
        </div>
        
        <!-- Pending Appointments Tab -->
        <div class="tab-pane fade" id="pending" role="tabpanel">
            <div class="row mt-3">
                <?php
                $query = "SELECT * FROM appointments WHERE accept = 'Pending' ORDER BY date DESC";
                $result = mysqli_query($connection, $query);

                if (!$result) {
                    die("Database error: " . mysqli_error($connection));
                }

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $modalId = $row['id'];
                        $name = htmlspecialchars($row['name']);
                        $email = htmlspecialchars($row['email']);
                        $prisid = htmlspecialchars($row['prisid']);
                        $phno = htmlspecialchars($row['phno']);
                        $date = htmlspecialchars($row['date']);
                        $message = htmlspecialchars($row['message']);
                ?>
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0"><i class="fas fa-user mr-2"></i><?= $name ?></h5>
                        </div>
                        <div class="card-body">
                            <div class="card-text">
                                <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                <p><i class="fas fa-info-circle text-warning mr-2"></i> <strong>Status:</strong> 
                                    <span class="badge badge-warning"><i class="fas fa-clock mr-1"></i> Pending</span>
                                </p>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100">
                                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#viewModal<?= $modalId ?>">
                                    <i class="fas fa-eye mr-1"></i> View
                                </button>
                                <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#acceptModal<?= $modalId ?>">
                                    <i class="fas fa-check mr-1"></i> Accept
                                </button>
                                <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#rejectModal<?= $modalId ?>">
                                    <i class="fas fa-times mr-1"></i> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Modal -->
                <div class="modal fade" id="viewModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title"><i class="fas fa-calendar-alt mr-2"></i>Appointment Details</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">×</button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><i class="fas fa-user text-primary mr-2"></i> <strong>Name:</strong> <?= $name ?></p>
                                        <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                        <p><i class="fas fa-phone text-primary mr-2"></i> <strong>Phone:</strong> <?= $phno ?></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                        <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                        <p><i class="fas fa-info-circle text-warning mr-2"></i> <strong>Status:</strong> 
                                            <span class="badge badge-warning"><i class="fas fa-clock mr-1"></i> Pending</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <label><i class="fas fa-comment-dots text-secondary mr-2"></i> <strong>Message:</strong></label>
                                    <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fas fa-times mr-1"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Accept Modal -->
                <div class="modal fade" id="acceptModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-success text-white">
                                    <h5 class="modal-title"><i class="fas fa-check-circle mr-2"></i>Accept Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-question-circle text-success mr-2"></i> Are you sure you want to accept this appointment?</p>
                                    <p><i class="fas fa-user mr-2"></i> <strong>Visitor:</strong> <?= $name ?></p>
                                    <p><i class="fas fa-id-card mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                    <p><i class="fas fa-calendar mr-2"></i> <strong>Visit Date:</strong> <?= $date ?></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="accept_btn" class="btn btn-success">
                                        <i class="fas fa-check mr-1"></i> Confirm Accept
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Reject Modal -->
                <div class="modal fade" id="rejectModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-danger text-white">
                                    <h5 class="modal-title"><i class="fas fa-ban mr-2"></i>Reject Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-exclamation-triangle text-danger mr-2"></i> Are you sure you want to reject this appointment?</p>
                                    <p><i class="fas fa-user mr-2"></i> <strong>Visitor:</strong> <?= $name ?></p>
                                    <p><i class="fas fa-id-card mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                    <div class="form-group mt-3">
                                        <label><i class="fas fa-comment-medical text-danger mr-2"></i> <strong>Reason for rejection:</strong></label>
                                        <textarea class="form-control" name="reply_msg" rows="3" required placeholder="Enter reason for rejection..."></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="reject_btn" class="btn btn-danger">
                                        <i class="fas fa-ban mr-1"></i> Confirm Reject
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <?php 
                    }
                } else {
                    echo '<div class="col-12"><div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i> No pending appointments found.</div></div>';
                }
                ?>
            </div>
        </div>
        
        <!-- Accepted Appointments Tab -->
        <div class="tab-pane fade" id="accepted" role="tabpanel">
            <div class="row mt-3">
                <?php
                $query = "SELECT * FROM appointments WHERE accept = 'Accepted' ORDER BY date DESC";
                $result = mysqli_query($connection, $query);

                if (!$result) {
                    die("Database error: " . mysqli_error($connection));
                }

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $modalId = $row['id'];
                        $name = htmlspecialchars($row['name']);
                        $email = htmlspecialchars($row['email']);
                        $prisid = htmlspecialchars($row['prisid']);
                        $phno = htmlspecialchars($row['phno']);
                        $date = htmlspecialchars($row['date']);
                        $message = htmlspecialchars($row['message']);
                        $visitStatus = htmlspecialchars($row['visit_status'] ?? 'Pending');
                ?>
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0"><i class="fas fa-user-check mr-2"></i><?= $name ?></h5>
                        </div>
                        <div class="card-body">
                            <div class="card-text">
                                <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                <p><i class="fas fa-info-circle text-success mr-2"></i> <strong>Status:</strong> 
                                    <span class="badge badge-success"><i class="fas fa-check mr-1"></i> Accepted</span>
                                </p>
                                <p><i class="fas fa-user-clock text-info mr-2"></i> <strong>Visit Status:</strong> 
                                    <span class="badge badge-<?= $visitStatus === 'Visited' ? 'success' : ($visitStatus === 'Not Visited' ? 'danger' : 'secondary') ?>">
                                        <i class="fas <?= $visitStatus === 'Visited' ? 'fa-check-circle' : ($visitStatus === 'Not Visited' ? 'fa-times-circle' : 'fa-hourglass-half') ?> mr-1"></i> <?= $visitStatus ?>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100">
                                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#acceptedViewModal<?= $modalId ?>">
                                    <i class="fas fa-eye mr-1"></i> View
                                </button>
                                <button class="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#acceptedDeleteModal<?= $modalId ?>">
                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Modal for Accepted -->
                <div class="modal fade" id="acceptedViewModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-primary text-white">
                                    <h5 class="modal-title"><i class="fas fa-calendar-check mr-2"></i>Appointment Details</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p><i class="fas fa-user text-primary mr-2"></i> <strong>Name:</strong> <?= $name ?></p>
                                            <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                            <p><i class="fas fa-phone text-primary mr-2"></i> <strong>Phone:</strong> <?= $phno ?></p>
                                        </div>
                                        <div class="col-md-6">
                                            <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                            <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                            <p><i class="fas fa-info-circle text-success mr-2"></i> <strong>Status:</strong> 
                                                <span class="badge badge-success"><i class="fas fa-check mr-1"></i> Accepted</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="form-group mt-3">
                                        <label><i class="fas fa-comment-dots text-secondary mr-2"></i> <strong>Message:</strong></label>
                                        <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="visited_btn" class="btn btn-success">
                                        <i class="fas fa-check-circle mr-1"></i> Mark Visited
                                    </button>
                                    <button type="submit" name="not_visited_btn" class="btn btn-warning">
                                        <i class="fas fa-times-circle mr-1"></i> Mark Not Visited
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Delete Modal for Accepted -->
                <div class="modal fade" id="acceptedDeleteModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-danger text-white">
                                    <h5 class="modal-title"><i class="fas fa-trash-alt mr-2"></i>Delete Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-exclamation-circle text-danger mr-2"></i> Are you sure you want to permanently delete this appointment?</p>
                                    <p class="text-danger"><i class="fas fa-exclamation-triangle mr-2"></i> <strong>This action cannot be undone!</strong></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="delete_btn" class="btn btn-danger">
                                        <i class="fas fa-trash-alt mr-1"></i> Delete
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <?php 
                    }
                } else {
                    echo '<div class="col-12"><div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i> No accepted appointments found.</div></div>';
                }
                ?>
            </div>
        </div>

        <!-- Rejected Appointments Tab -->
        <div class="tab-pane fade" id="rejected" role="tabpanel">
            <div class="row mt-3">
                <?php
                $query = "SELECT * FROM appointments WHERE accept = 'Rejected' ORDER BY date DESC";
                $result = mysqli_query($connection, $query);

                if (!$result) {
                    die("Database error: " . mysqli_error($connection));
                }

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $modalId = $row['id'];
                        $name = htmlspecialchars($row['name']);
                        $email = htmlspecialchars($row['email']);
                        $prisid = htmlspecialchars($row['prisid']);
                        $phno = htmlspecialchars($row['phno']);
                        $date = htmlspecialchars($row['date']);
                        $message = htmlspecialchars($row['message']);
                        $reply = htmlspecialchars($row['reply']);
                ?>
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0"><i class="fas fa-user-times mr-2"></i><?= $name ?></h5>
                        </div>
                        <div class="card-body">
                            <div class="card-text">
                                <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                <p><i class="fas fa-info-circle text-danger mr-2"></i> <strong>Status:</strong> 
                                    <span class="badge badge-danger"><i class="fas fa-ban mr-1"></i> Rejected</span>
                                </p>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100">
                                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#rejectedViewModal<?= $modalId ?>">
                                    <i class="fas fa-eye mr-1"></i> View
                                </button>
                                <button class="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#rejectedDeleteModal<?= $modalId ?>">
                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Modal for Rejected -->
                <div class="modal fade" id="rejectedViewModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title"><i class="fas fa-calendar-times mr-2"></i>Appointment Details</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">×</button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><i class="fas fa-user text-primary mr-2"></i> <strong>Name:</strong> <?= $name ?></p>
                                        <p><i class="fas fa-envelope text-primary mr-2"></i> <strong>Email:</strong> <?= $email ?></p>
                                        <p><i class="fas fa-phone text-primary mr-2"></i> <strong>Phone:</strong> <?= $phno ?></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><i class="fas fa-id-card text-info mr-2"></i> <strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                        <p><i class="fas fa-calendar-day text-success mr-2"></i> <strong>Date:</strong> <?= $date ?></p>
                                        <p><i class="fas fa-info-circle text-danger mr-2"></i> <strong>Status:</strong> 
                                            <span class="badge badge-danger"><i class="fas fa-ban mr-1"></i> Rejected</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <label><i class="fas fa-comment-dots text-secondary mr-2"></i> <strong>Message:</strong></label>
                                    <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                </div>
                                <?php if (!empty($reply)): ?>
                                <div class="form-group mt-3">
                                    <label><i class="fas fa-comment-slash text-danger mr-2"></i> <strong>Rejection Reason:</strong></label>
                                    <textarea class="form-control" rows="3" readonly><?= $reply ?></textarea>
                                </div>
                                <?php endif; ?>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fas fa-times mr-1"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delete Modal for Rejected -->
                <div class="modal fade" id="rejectedDeleteModal<?= $modalId ?>" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <form method="POST" action="">
                                <input type="hidden" name="appid" value="<?= $modalId ?>">
                                <div class="modal-header bg-danger text-white">
                                    <h5 class="modal-title"><i class="fas fa-trash-alt mr-2"></i>Delete Appointment</h5>
                                    <button type="button" class="close text-white" data-dismiss="modal">×</button>
                                </div>
                                <div class="modal-body">
                                    <p><i class="fas fa-exclamation-circle text-danger mr-2"></i> Are you sure you want to permanently delete this appointment?</p>
                                    <p class="text-danger"><i class="fas fa-exclamation-triangle mr-2"></i> <strong>This action cannot be undone!</strong></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" name="delete_btn" class="btn btn-danger">
                                        <i class="fas fa-trash-alt mr-1"></i> Delete
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        <i class="fas fa-times mr-1"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <?php 
                    }
                } else {
                    echo '<div class="col-12"><div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i> No rejected appointments found.</div></div>';
                }
                ?>
            </div>
        </div>
    </div>
</div>

<!-- JavaScript -->
<script src="vendors/scripts/core.js"></script>
<script src="vendors/scripts/script.min.js"></script>
<script src="vendors/scripts/process.js"></script>
<script src="vendors/scripts/layout-settings.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    // Activate the appropriate tab based on URL hash
    $(document).ready(function() {
        if (window.location.hash) {
            $('.nav-tabs a[href="' + window.location.hash + '"]').tab('show');
        }
        
        // Change URL hash when tab changes
        $('.nav-tabs a').on('shown.bs.tab', function(e) {
            window.location.hash = e.target.hash;
        });
    });
</script>
</body>
</html>
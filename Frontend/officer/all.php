<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appid = $_POST['appid'];

    if (isset($_POST['visited_btn'])) {
        // Update visit_status column to 'Visited'
        $query = "UPDATE appointments SET visit_status='Visited' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "i", $appid);
        mysqli_stmt_execute($stmt);
        echo "<script>alert('Marked as Visited'); window.location.href='all.php';</script>";
        exit();
    } elseif (isset($_POST['not_visited_btn'])) {
        // Update visit_status column to 'Not Visited'
        $query = "UPDATE appointments SET visit_status='Not Visited' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "i", $appid);
        mysqli_stmt_execute($stmt);
        echo "<script>alert('Marked as Not Visited'); window.location.href='all.php';</script>";
        exit();
    } elseif (isset($_POST['reject_btn'])) {
        $reply = $_POST['reply_msg'];
        $query = "UPDATE appointments SET reply=?, accept='Rejected' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "si", $reply, $appid);
        mysqli_stmt_execute($stmt);
        echo "<script>alert('Appointment Rejected'); window.location.href='all.php';</script>";
        exit();
    } elseif (isset($_POST['delete_btn'])) {
        $appid = (int)$_POST['appid'];
        $deleteQuery = "DELETE FROM appointments WHERE id = $appid";
        $deleteResult = mysqli_query($connection, $deleteQuery);
        if ($deleteResult) {
            echo "<script>alert('Appointment Deleted'); window.location.href='all.php';</script>";
        } else {
            echo "Error deleting record: " . mysqli_error($connection);
        }
        exit();
    }
}
?>

<?php include('navbar.php'); ?>
<?php include('sidebar.php'); ?>

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
    <h4 class="mb-4">Appointment Requests</h4>
    <div class="row">
        <?php
        $appointmentQuery = "SELECT * FROM appointments ORDER BY date DESC";
        $appointmentResult = mysqli_query($connection, $appointmentQuery);

        if (!$appointmentResult) {
            die("Query failed: " . mysqli_error($connection));
        }

        while ($row = mysqli_fetch_assoc($appointmentResult)) {
            $appid = $row['id'];
            $name = htmlspecialchars($row['name']);
            $email = htmlspecialchars($row['email']);
            $prisid = htmlspecialchars($row['prisid']);
            $phno = htmlspecialchars($row['phno']);
            $date = htmlspecialchars($row['date']);
            $message = htmlspecialchars($row['message']);
            $status = htmlspecialchars($row['accept']);
            $visitStatus = htmlspecialchars($row['visit_status'] ?? 'Pending');
        ?>
            <div class="col-md-4">
                <div class="card shadow p-3 mb-4">
                    <h5><?= $name ?></h5>
                    <p><strong>Email:</strong> <?= $email ?></p>
                    <p><strong>Prisoner ID:</strong> <?= $prisid ?></p>
                    <p><strong>Status:</strong> 
                        <span class="badge <?= $status === 'Accepted' ? 'badge-success' : ($status === 'Rejected' ? 'badge-danger' : 'badge-warning') ?>">
                            <?= $status ?: 'Pending' ?>
                        </span>
                    </p>
                    <p><strong>Visit Status:</strong> 
                        <span class="badge <?= $visitStatus === 'Visited' ? 'badge-success' : ($visitStatus === 'Not Visited' ? 'badge-danger' : 'badge-secondary') ?>">
                            <?= $visitStatus ?>
                        </span>
                    </p>
                    <p><strong>Date:</strong> <?= $date ?></p>
                    
                    <div class="btn-group w-100">
                        <button class="btn btn-primary" data-toggle="modal" data-target="#viewModal<?= $appid ?>">
                            <i class="fa fa-eye"></i> View
                        </button>
                        <button class="btn btn-danger" data-toggle="modal" data-target="#rejectModal<?= $appid ?>">
                            <i class="fa fa-times"></i> Reject
                        </button>
                        <button class="btn btn-outline-danger" data-toggle="modal" data-target="#deleteModal<?= $appid ?>">
                            <i class="fa fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>

            <!-- View Modal -->
            <div class="modal fade" id="viewModal<?= $appid ?>" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <form method="POST" action="">
                            <input type="hidden" name="appid" value="<?= $appid ?>">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">Appointment Details</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Name:</strong> <?= $name ?></p>
                                        <p><strong>Email:</strong> <?= $email ?></p>
                                        <p><strong>Phone:</strong> <?= $phno ?></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                        <p><strong>Date:</strong> <?= $date ?></p>
                                        <p><strong>Status:</strong> <?= $status ?: 'Pending' ?></p>
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <label><strong>Message:</strong></label>
                                    <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <?php if ($status === 'Accepted') { ?>
                                    <button type="submit" name="visited_btn" class="btn btn-success">
                                        <i class="fa fa-check"></i> Mark Visited
                                    </button>
                                    <button type="submit" name="not_visited_btn" class="btn btn-warning">
                                        <i class="fa fa-times"></i> Mark Not Visited
                                    </button>
                                <?php } ?>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fa fa-close"></i> Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Reject Modal -->
            <div class="modal fade" id="rejectModal<?= $appid ?>" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <form method="POST" action="">
                            <input type="hidden" name="appid" value="<?= $appid ?>">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title">Reject Appointment</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to reject this appointment?</p>
                                <div class="form-group">
                                    <label for="rejectReason<?= $appid ?>"><strong>Reason for rejection:</strong></label>
                                    <textarea class="form-control" id="rejectReason<?= $appid ?>" name="reply_msg" rows="3" required></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" name="reject_btn" class="btn btn-danger">
                                    <i class="fa fa-times"></i> Confirm Reject
                                </button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fa fa-close"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Delete Modal -->
            <div class="modal fade" id="deleteModal<?= $appid ?>" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <form method="POST" action="">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title">Delete Appointment</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" name="appid" value="<?= $appid ?>">
                                <p>Are you sure you want to permanently delete this appointment?</p>
                                <p class="text-danger"><strong>This action cannot be undone!</strong></p>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" name="delete_btn" class="btn btn-danger">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fa fa-close"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
    </div>
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
<!-- Font Awesome -->
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
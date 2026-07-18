<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appid = $_POST['appid'];

    if (isset($_POST['visited_btn'])) {
        // Update visit_status to 'Visited'
        $query = "UPDATE appointments SET visit_status='Visited' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "i", $appid);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        echo "<script>alert('Marked as Visited'); window.location.href='accepted.php';</script>";
        exit();
    } elseif (isset($_POST['not_visited_btn'])) {
        // Update visit_status to 'Not Visited'
        $query = "UPDATE appointments SET visit_status='Not Visited' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "i", $appid);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        echo "<script>alert('Marked as Not Visited'); window.location.href='accepted.php';</script>";
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
    <h4 class="mb-4">Accepted Appointment Requests</h4>
    <div class="row">
        <?php
        $appointmentQuery = "SELECT * FROM appointments WHERE accept = 'Accepted' ORDER BY date DESC";
        $appointmentResult = mysqli_query($connection, $appointmentQuery);

        if (!$appointmentResult) {
            die("Query failed: " . mysqli_error($connection));
        }

        if (mysqli_num_rows($appointmentResult) > 0) {
            while ($row = mysqli_fetch_assoc($appointmentResult)) {
                $appid = $row['id'];
                $name = htmlspecialchars($row['name']);
                $email = htmlspecialchars($row['email']);
                $prisid = htmlspecialchars($row['prisid']);
                $phno = htmlspecialchars($row['phno']);
                $date = htmlspecialchars($row['date']);
                $message = htmlspecialchars($row['message']);
                $status = htmlspecialchars($row['accept']);
        ?>
            <div class="col-md-4">
                <div class="card shadow p-3 mb-4">
                    <h5><?= $name ?></h5>
                    <p><strong>Email:</strong> <?= $email ?></p>
                    <p><strong>Prisoner ID:</strong> <?= $prisid ?></p>
                    <p><strong>Status:</strong> 
                        <span class="badge badge-success"><?= $status ?></span>
                    </p>
                    <p><strong>Date:</strong> <?= $date ?></p>
                    
                    <button class="btn btn-primary w-100" data-toggle="modal" data-target="#viewModal<?= $appid ?>">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>

            <!-- View Modal -->
            <div class="modal fade" id="viewModal<?= $appid ?>" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <form method="POST" action="accepted.php">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">Appointment Details</h5>
                                <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" name="appid" value="<?= $appid ?>">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Name:</strong> <?= $name ?></p>
                                        <p><strong>Email:</strong> <?= $email ?></p>
                                        <p><strong>Phone:</strong> <?= $phno ?></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Prisoner ID:</strong> <?= $prisid ?></p>
                                        <p><strong>Date:</strong> <?= $date ?></p>
                                        <p><strong>Status:</strong> <?= $status ?></p>
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <label><strong>Message:</strong></label>
                                    <textarea class="form-control" rows="3" readonly><?= $message ?></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" name="visited_btn" class="btn btn-success">
                                    <i class="fas fa-check"></i> Mark Visited
                                </button>
                                <button type="submit" name="not_visited_btn" class="btn btn-warning">
                                    <i class="fas fa-times"></i> Mark Not Visited
                                </button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="fas fa-times"></i> Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <?php 
            }
        } else {
            echo '<div class="col-12"><div class="alert alert-info">No accepted appointments found.</div></div>';
        }
        ?>
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
</body>
</html>
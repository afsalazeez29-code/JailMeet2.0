<?php
session_start();

// Redirect to login if not authenticated
if (!isset($_SESSION['id'])) {
    header("Location: officerlogin.php");
    exit();
}

include('navbar.php');
include('sidebar.php');
include('db.php'); // Include database connection

$logged_in_username = isset($_SESSION['ofname']) ? $_SESSION['ofname'] : 'Officer';
$logged_in_email = isset($_SESSION['ofemail']) ? $_SESSION['ofemail'] : '';
$logged_in_id = isset($_SESSION['id']) ? $_SESSION['id'] : '';

// Get statistics from database
$total_appointments = 0;
$visited_count = 0;
$not_visited_count = 0;
$rejected_count = 0;
$pending_count = 0;
$accepted_count = 0;

// Total appointments
$query = "SELECT COUNT(*) as total FROM appointments";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $total_appointments = $row['total'];
}

// Visited count
$query = "SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Visited'";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $visited_count = $row['count'];
}

// Not visited count
$query = "SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Not Visited'";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $not_visited_count = $row['count'];
}

// Rejected count
$query = "SELECT COUNT(*) as count FROM appointments WHERE accept = 'Rejected'";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $rejected_count = $row['count'];
}

// Pending count
$query = "SELECT COUNT(*) as count FROM appointments WHERE accept = 'Pending'";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $pending_count = $row['count'];
}

// Accepted count
$query = "SELECT COUNT(*) as count FROM appointments WHERE accept = 'Accepted'";
$result = mysqli_query($connection, $query);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $accepted_count = $row['count'];
}

mysqli_close($connection);
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
<body>
	<div class="main-container">
		<div class="pd-20">
			<div class="alert alert-success">
				Welcome, <?php echo htmlspecialchars($logged_in_username); ?>!<br>
				Email: <?php echo htmlspecialchars($logged_in_email); ?><br>
				Officer ID: <?php echo htmlspecialchars($logged_in_id); ?>
			</div>
		</div>
			
		<div class="row">
			<!-- Total Appointments Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-primary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $total_appointments; ?></div>
							<div class="weight-600 font-14">Total Appointments</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-calendar-alt fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Visited Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-success text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $visited_count; ?></div>
							<div class="weight-600 font-14">Visited</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-check-circle fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Not Visited Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-warning text-dark">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $not_visited_count; ?></div>
							<div class="weight-600 font-14">Not Visited</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-clock fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Rejected Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-danger text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $rejected_count; ?></div>
							<div class="weight-600 font-14">Rejected</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-times-circle fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Pending Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-info text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $pending_count; ?></div>
							<div class="weight-600 font-14">Pending</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-hourglass-half fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Accepted Card -->
			<div class="col-xl-3 mb-30">
				<div class="card-box height-100-p widget-style1 bg-secondary text-white">
					<div class="d-flex flex-wrap align-items-center">
						<div class="widget-data">
							<div class="h4 mb-0"><?php echo $accepted_count; ?></div>
							<div class="weight-600 font-14">Accepted</div>
						</div>
						<div class="progress-data">
							<i class="fas fa-thumbs-up fa-3x opacity-50"></i>
						</div>
					</div>
				</div>
			</div>
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
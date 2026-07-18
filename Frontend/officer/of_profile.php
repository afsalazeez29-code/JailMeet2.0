<?php
session_start();
include('navbar.php');
include('sidebar.php');
include('db.php');


// Get officer ID from session
$officerId = $_SESSION['id'] ?? '';

// Initialize variables
$ofname = $ofemail = $ofpass = $ofphno = '';

// Fetch officer details
if (!empty($officerId)) {
    $query = "SELECT * FROM officer WHERE id = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, 's', $officerId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $ofname = $row['ofname'];
        $ofemail = $row['ofemail'];
        $ofpass = $row['ofpass'];
        $ofphno = $row['ofphno'];
    }
}
?>

<!DOCTYPE html>
<html>
<head>
	<!-- Basic Page Info -->
	<meta charset="utf-8">
	<title>JailMeet Admin</title>

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
<body style="padding-left: 250px; padding-top: 53px;">
</div>
	</div>

    
   

    <div class="container mt-5">
    <h4>Officer Details</h4>
    <form style="max-width: 600px;">
        <!-- Name -->
        <div class="form-group">
            <label for="ofname">Name</label>
            <input type="text" class="form-control" id="ofname" value="<?php echo htmlspecialchars($ofname); ?>" readonly>
        </div>

        <!-- Email -->
        <div class="form-group">
            <label for="ofemail">Email</label>
            <input type="email" class="form-control" id="ofemail" value="<?php echo htmlspecialchars($ofemail); ?>" readonly>
        </div>

        <!-- Password -->
        <div class="form-group">
            <label for="ofpass">Password</label>
            <input type="password" class="form-control" id="ofpass" value="<?php echo htmlspecialchars($ofpass); ?>" readonly>
        </div>

        <!-- Phone Number -->
        <div class="form-group">
            <label for="ofphno">Phone Number</label>
            <input type="text" class="form-control" id="ofphno" value="<?php echo htmlspecialchars($ofphno); ?>" readonly>
        </div>
    </form>
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

   
  

    <!-- Initialize DataTable -->
<script>
    $(document).ready(function() {
        $('#prisonerTable').DataTable();
    });
    </script>
</body>
</html>
	
			
	
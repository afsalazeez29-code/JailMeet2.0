<?php
include('navbar.php');
include('sidebar.php');
include('db.php');

// Fetch only ACCEPTED parole requests with prisoner details
$query = "SELECT pris_id, par_name, par_rel, par_purp, par_status, par_msg FROM prisoner WHERE par_status = 'Accepted'";
$result = mysqli_query($connection, $query);

// Handle form submission to update parole status (Accept, Reject, or Returned)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = $_POST['pris_id'];
    $action = $_POST['action'];

    // Update parole status based on action
    if ($action === 'accept') {
        $parole_status = 'Accepted';
    } elseif ($action === 'reject') {
        $parole_status = 'Rejected';
    } elseif ($action === 'returned') {
        $parole_status = 'Returned';
    }

    $updateQuery = "UPDATE prisoner SET par_status = '$parole_status' WHERE pris_id = '$pris_id'";
    $result = mysqli_query($connection, $updateQuery);

    if ($result) {
        echo "<script>alert('Parole status updated successfully'); window.location.href='requests.php';</script>";
    } else {
        echo "Error updating record: " . mysqli_error($connection);
    }
}
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
        <h2 class="mb-4">Accepted Parole Requests</h2>

        <?php 
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)): 
                // Check if required values are not null or empty
                if (!empty($row['par_name']) && !empty($row['par_rel']) && !empty($row['par_purp'])): 
        ?>
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Parole Request - <?php echo htmlspecialchars($row['par_name']); ?></h5>
                </div>
                <div class="card-body">
                    <p><strong>Purpose of Parole: </strong><?php echo htmlspecialchars($row['par_purp']); ?></p>
                    <p><strong>Status: </strong>
                        <span class="badge badge-success">
                            <?php echo htmlspecialchars($row['par_status']); ?>
                        </span>
                    </p>

                    <div class="btn-group" role="group">
                        <!-- View Button opens a modal -->
                        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#viewModal<?php echo $row['pris_id']; ?>">View Details</button>
                        
                        <!-- Returned Button -->
                        <form method="POST" style="display: inline;">
                            <input type="hidden" name="pris_id" value="<?php echo $row['pris_id']; ?>">
                            <input type="hidden" name="action" value="returned">
                            <button type="submit" class="btn btn-warning" onclick="return confirm('Mark this parole as Returned?')">Mark as Returned</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal for Viewing Parole Request -->
            <div class="modal fade" id="viewModal<?php echo $row['pris_id']; ?>" tabindex="-1" role="dialog" aria-labelledby="viewModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="viewModalLabel">Parole Request Details</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Name:</strong> <?php echo htmlspecialchars($row['par_name']); ?></p>
                            <p><strong>Relation:</strong> <?php echo htmlspecialchars($row['par_rel']); ?></p>
                            <p><strong>Purpose:</strong> <?php echo htmlspecialchars($row['par_purp']); ?></p>
                            <p><strong>Message:</strong> <?php echo htmlspecialchars($row['par_msg']); ?></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <?php 
                endif;
            endwhile;
        } else {
            echo '<div class="alert alert-info">No accepted parole requests found.</div>';
        }
        ?>
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
<?php
include('navbar.php');
include('sidebar.php');
include('db.php');

// Fetch prisoner details
$query = "SELECT * FROM prisoner";
$result = mysqli_query($connection, $query);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = $_POST['pris_id'];
    $crime_type = $_POST['crime_type'];
    $message = $_POST['message'];
    $parole_from = $_POST['parole_from'];
    $parole_to = $_POST['parole_to'];
    $parole_status = $_POST['parole_status'];

    $updateQuery = "UPDATE prisoner SET 
        pris_case = '$crime_type',
        parole_msg = '$message',
        parole_from = '$parole_from',
        parole_to = '$parole_to',
        parole_status = '$parole_status'
        WHERE pris_id = '$pris_id'";

    $result = mysqli_query($connection, $updateQuery);

    if ($result) {
        echo "<script>alert('Parole report updated successfully'); window.location.href='parole_log.php';</script>";
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
<body style="
    padding-left: 250px;
    padding-top: 53px;
">
</div>
	</div>

    <div class="container mt-5">
    <h4>Log Prisoner Parole Detail</h4>
    <form action="parole_report.php" method="post" style="max-width: 600px;">
        <!-- Select Prisoner -->
        <div class="form-group">
            <label for="pris_id">Select Prisoner</label>
            <select name="pris_id" id="pris_id" class="form-control" onchange="updateFields()" required>
                <option value="">-- Select Prisoner --</option>
                <?php
                mysqli_data_seek($result, 0);
                $prisonersData = [];
                $paroleData = [];

                while ($row = mysqli_fetch_assoc($result)) {
                    $pris_id = $row['pris_id'];
                    $pris_name = $row['pris_name'];
                    $pris_case = $row['pris_case'];

                    // Collect data
                    $prisonersData[$pris_id] = $pris_case;
                    $paroleData[$pris_id] = [
                        'msg' => $row['parole_msg'],
                        'from' => $row['parole_from'],
                        'to' => $row['parole_to']
                    ];

                    echo "<option value='$pris_id'>$pris_id - $pris_name</option>";
                }
                ?>
            </select>
        </div>

        <!-- Crime / Case -->
        <div class="form-group">
            <label for="crime_type">Crime / Case</label>
            <input type="text" class="form-control" name="crime_type" id="crime_type" readonly>
        </div>

        
        <!-- Message -->
        <div class="form-group">
            <label for="message">Message</label>
            <textarea name="message" id="message" class="form-control" rows="4" placeholder="Enter a message..." required></textarea>
        </div>

        <!-- Parole From -->
        <div class="form-group">
            <label for="parole_from">Parole From Date</label>
            <input type="date" class="form-control" name="parole_from" id="parole_from">
        </div>

        <!-- Parole To -->
        <div class="form-group">
            <label for="parole_to">Parole To Date</label>
            <input type="date" class="form-control" name="parole_to" id="parole_to">
        </div>

        <button type="submit" class="btn btn-primary">Submit Report</button>
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

   
    <script>
    const prisoners = <?php echo json_encode($prisonersData); ?>;
    const paroleData = <?php echo json_encode($paroleData); ?>;

    function updateFields() {
        const prisId = document.getElementById('pris_id').value;

        document.getElementById('crime_type').value = prisoners[prisId] || '';
        document.getElementById('message').value = paroleData[prisId]?.msg || '';
        document.getElementById('parole_from').value = paroleData[prisId]?.from || '';
        document.getElementById('parole_to').value = paroleData[prisId]?.to || '';
    }
</script>

    <!-- Initialize DataTable -->
<script>
    $(document).ready(function() {
        $('#prisonerTable').DataTable();
    });
    </script>
</body>
</html>
	
			
	
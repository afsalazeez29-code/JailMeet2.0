<?php
include('navbar.php');
include('sidebar.php');
include('db.php');

// Fetch all prisoners
$query = "SELECT * FROM prisoner";
$result = mysqli_query($connection, $query);

// Handle parole update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pris_id']) && isset($_POST['parole_status'])) {
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
    echo "<script>
            alert('Parole report updated successfully');
            window.location.href = 'eligibility.php?pris_id=" . $pris_id . "';
          </script>";
} else {
    echo "Error updating record: " . mysqli_error($connection);
}
}

// Handle prisoner search
$searchResult = null;
if (isset($_POST['search_btn'])) {
    $searchId = mysqli_real_escape_string($connection, $_POST['pris_search']);
    $searchQuery = "SELECT pris_id, pris_name, pris_age, pris_gender, pris_case, pris_adm, pris_period, jailtype, jailname 
                    FROM prisoner WHERE pris_id = '$searchId'";
    $searchResult = mysqli_query($connection, $searchQuery);
}

// Prepare JS object for prisoner dropdown
mysqli_data_seek($result, 0);
$prisonersData = [];
while ($row = mysqli_fetch_assoc($result)) {
    $pris_id = $row['pris_id'];
    $prisonersData[$pris_id] = [
        'name' => $row['pris_name'],
        'case' => $row['pris_case'],
        'age' => $row['pris_age'],
        'gender' => $row['pris_gender'],
        'adm' => $row['pris_adm'],
        'period' => $row['pris_period'],
        'jailtype' => $row['jailtype'],
        'jailname' => $row['jailname'],
        'status' => $row['parole_status'],
        'msg' => $row['parole_msg'],
        'from' => $row['parole_from'],
        'to' => $row['parole_to']
    ];
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


<body style="padding-left: 250px; padding-top: 53px;">
<div class="container mt-5">
    <h4>Prisoner Parole Eligibility</h4>

   

    <div class="form-group">
        <label for="pris_id">Select Prisoner</label>
        <select name="pris_id" id="pris_id" class="form-control" onchange="updateFields()" required>
            <option value="">-- Select Prisoner --</option>
            <?php foreach ($prisonersData as $id => $data): ?>
                <option value="<?php echo $id; ?>"><?php echo $id . ' - ' . $data['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <!-- Parole Info -->
    <div id="prisonerDetails" style="display: none;">
    <div class="form-group">
        <label for="pris_name">Name:</label>
        <input type="text" id="pris_name" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="pris_age">Age:</label>
        <input type="text" id="pris_age" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="pris_gender">Gender:</label>
        <input type="text" id="pris_gender" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="pris_adm">Admission Date:</label>
        <input type="text" id="pris_adm" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="pris_period">Sentence Duration:</label>
        <input type="text" id="pris_period" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="jailtype">Jail Type:</label>
        <input type="text" id="jailtype" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="jailname">Jail Name:</label>
        <input type="text" id="jailname" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="crime_type">Crime Type:</label>
        <input type="text" id="crime_type" class="form-control" readonly>
    </div>
    <div class="form-group">
        <label for="status">Parole Status:</label>
        <input type="text" id="status" class="form-control" readonly>
    </div>


        <form method="post" action="">
            <input type="hidden" name="pris_id" id="hidden_pris_id">
            <input type="hidden" name="crime_type" id="hidden_crime_type">
            <input type="hidden" name="message" id="hidden_message">
            <input type="hidden" name="parole_from" id="hidden_parole_from">
            <input type="hidden" name="parole_to" id="hidden_parole_to">
            <input type="hidden" name="parole_status" id="hidden_parole_status">

            <button type="submit" class="btn btn-success" onclick="setStatus('Eligible (Not Applied)')">Mark as Eligible</button>
            <button type="submit" class="btn btn-danger" onclick="setStatus('Not Eligible')">Mark as Not Eligible</button>
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

function updateFields() {
    const prisId = document.getElementById('pris_id').value;
    const data = prisoners[prisId];

    if (!prisId || !data) {
        document.getElementById('prisonerDetails').style.display = 'none';
        return;
    }

    // Show prisoner details by updating the input fields
    document.getElementById('pris_name').value = data.name;
    document.getElementById('pris_age').value = data.age;
    document.getElementById('pris_gender').value = data.gender;
    document.getElementById('pris_adm').value = data.adm;
    document.getElementById('pris_period').value = data.period;
    document.getElementById('jailtype').value = data.jailtype;
    document.getElementById('jailname').value = data.jailname;
    document.getElementById('crime_type').value = data.case;
    document.getElementById('status').value = data.status;

    // Hidden form values for submission
    document.getElementById('hidden_pris_id').value = prisId;
    document.getElementById('hidden_crime_type').value = data.case;
    document.getElementById('hidden_message').value = data.msg || '';
    document.getElementById('hidden_parole_from').value = data.from || '';
    document.getElementById('hidden_parole_to').value = data.to || '';

    document.getElementById('prisonerDetails').style.display = 'block';
}

function setStatus(status) {
    document.getElementById('hidden_parole_status').value = status;
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
	
			
	
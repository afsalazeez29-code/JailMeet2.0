<?php
include('navbar.php');
include('sidebar.php');
include('db.php');

// Initialize variables
$success_message = '';
$error_message = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['pris_id'])) {
    $pris_id = mysqli_real_escape_string($connection, $_POST['pris_id']);
    $crime_type = mysqli_real_escape_string($connection, $_POST['crime_type']);
    $message = mysqli_real_escape_string($connection, $_POST['message']);
    $fir_date = mysqli_real_escape_string($connection, $_POST['fir_date']);
    
    // Create FIR number in format: YYYY-MM-DD/pris_id
    $fir_number = $fir_date . '/' . $pris_id;
    
    // Update query to include fir_date and fir_number
    $query = "UPDATE prisoner SET 
              pris_case = '$crime_type', 
              fir = '$message',
              fir_date = '$fir_date',
              fir_number = '$fir_number'
              WHERE pris_id = '$pris_id'";
    
    $result = mysqli_query($connection, $query);
    
    if ($result) {
        $success_message = 'Prisoner FIR details logged successfully! FIR Number: ' . $fir_number;
    } else {
        $error_message = 'Error: ' . mysqli_error($connection);
    }
}

// Fetch prisoner details for the form
$query = "SELECT * FROM prisoner";
$result = mysqli_query($connection, $query);
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
<body style="padding-left: 250px; padding-top: 53px;">
    <div class="container mt-5">
    <h4 class="text-center my-4" style="font-weight: bold;">Prisoner FIR</h4>

        
        <?php if ($success_message): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success_message; ?>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        <?php endif; ?>
        
        <?php if ($error_message): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error_message; ?>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        <?php endif; ?>
        
        <form method="post" style="max-width: 600px;">
        <div class="form-group" style="display: none;">
    <label for="pris_id_display">Prisoner ID</label>
    <input type="text" class="form-control" id="pris_id_display" readonly>
    <input type="hidden" name="pris_id" id="pris_id">
</div>


            <div class="form-group">
                <label for="pris_select">Select Prisoner</label>
                <select id="pris_select" class="form-control" onchange="updateFields()" required>
                    <option value="">-- Select Prisoner --</option>
                    <?php
                    $prisonersData = [];
                    $firData = [];
                    mysqli_data_seek($result, 0); // Reset result pointer
                    
                    while ($row = mysqli_fetch_assoc($result)) {
                        $pris_id = $row['pris_id'];
                        $pris_name = $row['pris_name'];
                        $pris_case = $row['pris_case'];
                        $fir = $row['fir'];

                        echo "<option value='$pris_id'>$pris_name (ID: $pris_id)</option>";

                        $prisonersData[$pris_id] = $pris_case;
                        $firData[$pris_id] = $fir;
                    }
                    ?>
                </select>
            </div>

            <div class="form-group">
                <label for="crime_type">Crime / Case</label>
                <input type="text" class="form-control" name="crime_type" id="crime_type" readonly>
            </div>

            <div class="form-group">
                <label for="message">Message / Report (FIR)</label>
                <textarea name="message" id="message" class="form-control" rows="4" placeholder="Enter details about the prisoner or case..." required></textarea>
            </div>

            <div class="form-group">
                <label for="fir_date">FIR Date</label>
                <input type="date" class="form-control" name="fir_date" id="fir_date" value="<?php echo date('Y-m-d'); ?>" onchange="updateFirNumber()" required>
            </div>

            <div class="form-group">
                <label for="fir_number">FIR Number (auto-generated)</label>
                <input type="text" class="form-control" id="fir_number" readonly>
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
        const firData = <?php echo json_encode($firData); ?>;

        function updateFields() {
            const prisSelect = document.getElementById('pris_select');
            const prisId = prisSelect.value;
            const prisIdDisplay = document.getElementById('pris_id_display');
            const prisIdHidden = document.getElementById('pris_id');
            const crimeField = document.getElementById('crime_type');
            const firField = document.getElementById('message');
            
            prisIdDisplay.value = prisId;
            prisIdHidden.value = prisId;
            crimeField.value = prisoners[prisId] || '';
            firField.value = firData[prisId] || '';
            
            // Update FIR number when prisoner changes
            updateFirNumber();
        }
        
        function updateFirNumber() {
            const prisId = document.getElementById('pris_id').value;
            const firDate = document.getElementById('fir_date').value;
            const firNumberField = document.getElementById('fir_number');
            
            if (prisId && firDate) {
                firNumberField.value = firDate + '/' + prisId;
            } else {
                firNumberField.value = '';
            }
        }
        
        // Initialize fields on page load
        document.addEventListener('DOMContentLoaded', function() {
            updateFields();
        });
    </script>
</body>
</html>
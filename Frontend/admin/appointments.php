<?php
session_start();

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

include('includes/navbar.php');
include('includes/sidebar.php');

// Fetch appointments
$appointmentsQuery = "SELECT id, name, email, phno FROM appointments";
$appointmentsResult = mysqli_query($connection, $appointmentsQuery);

// Fetch single appointment details if ID is provided via AJAX
if (isset($_GET['ajax_id'])) {
    $id = intval($_GET['ajax_id']);
    $appointmentQuery = "SELECT * FROM appointments WHERE id = $id";
    $appointmentResult = mysqli_query($connection, $appointmentQuery);
    
    if ($appointmentResult && mysqli_num_rows($appointmentResult) > 0) {
        $appointment = mysqli_fetch_assoc($appointmentResult);
        echo json_encode($appointment);
    } else {
        echo json_encode(['error' => 'No appointment found']);
    }
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>JailMeet Admin - Appointments</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <link rel="icon" href="assets1/img/kaiadmin/favicon.ico" type="image/x-icon">

    <!-- CSS Files -->
    <link rel="stylesheet" href="assets1/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets1/css/plugins.min.css">
    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">
    <link rel="stylesheet" href="assets1/css/demo.css">
    <link rel="stylesheet" href="assets1/css/plugin/datatables/datatables.min.css">
    <link rel="stylesheet" href="assets1/css/plugin/sweetalert/sweetalert.min.css">

    <style>
         .main {
    padding-top: 100px; /* adjust this to match the height of your navbar */
}
        .card {
            transition: transform 0.2s, box-shadow 0.2s;
            border-radius: 10px;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .card-title {
            font-weight: 600;
            color: #177dff;
        }
        .modal-content {
            border-radius: 10px;
        }
        .form-control[readonly] {
            background-color: #f8f9fa;
            border-color: #e9ecef;
        }
        .detail-label {
            font-weight: 500;
            color: #495057;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <?php include('includes/sidebar.php'); ?>
        
        <div class="main">
           
            
            <div class="content">
                <div class="container-fluid">
                    <div class="page-header">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h1 class="page-title">Appointments Management</h1>
                                <ul class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="dashboard.php">Dashboard</a></li>
                                    <li class="breadcrumb-item active">Appointments</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">All Appointments</h4>
                                    <p class="card-category">Manage visitor appointment requests</p>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <?php while ($appointment = mysqli_fetch_assoc($appointmentsResult)): ?>
                                            <div class="col-lg-4 col-md-6 mb-4">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h5 class="card-title"><?= htmlspecialchars($appointment['name']) ?></h5>
                                                        <p class="card-text"><i class="fas fa-envelope mr-2"></i><?= htmlspecialchars($appointment['email']) ?></p>
                                                        <p class="card-text"><i class="fas fa-phone mr-2"></i><?= htmlspecialchars($appointment['phno']) ?></p>
                                                        <button class="btn btn-primary view-appointment" data-id="<?= $appointment['id'] ?>">
                                                            <i class="fas fa-eye mr-2"></i>View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endwhile; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Appointment Details Modal -->
    <div class="modal fade" id="appointmentModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Appointment Details</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="detail-label">Full Name</label>
                                    <input type="text" class="form-control" id="modal-name" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Prisoner ID</label>
                                    <input type="text" class="form-control" id="modal-prisid" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Email Address</label>
                                    <input type="email" class="form-control" id="modal-email" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Phone Number</label>
                                    <input type="text" class="form-control" id="modal-phno" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="detail-label">Relation to Prisoner</label>
                                    <input type="text" class="form-control" id="modal-relation" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Jail Type</label>
                                    <input type="text" class="form-control" id="modal-jtype" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Jail Name</label>
                                    <input type="text" class="form-control" id="modal-jname" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="detail-label">Appointment Date</label>
                                    <input type="text" class="form-control" id="modal-date" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label class="detail-label">Message</label>
                                    <textarea class="form-control" id="modal-message" rows="3" readonly></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="approve-btn">Approve Appointment</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Core JS Files -->
    <script src="assets1/js/core/jquery-3.7.1.min.js"></script>
    <script src="assets1/js/core/popper.min.js"></script>
    <script src="assets1/js/core/bootstrap.min.js"></script>
    
    <!-- Sweet Alert -->
    <script src="assets1/js/plugin/sweetalert/sweetalert.min.js"></script>
    
    <script>
        $(document).ready(function() {
            // Handle view appointment button click
            $(document).on('click', '.view-appointment', function() {
                var appointmentId = $(this).data('id');
                
                // Show loading state
                $('#appointmentModal').modal('show');
                $('.modal-body').html('<div class="text-center py-4"><i class="fas fa-spinner fa-spin fa-3x"></i><p class="mt-3">Loading appointment details...</p></div>');
                
                // Fetch appointment details via AJAX
                $.get('appointments.php', { ajax_id: appointmentId }, function(data) {
                    if (data.error) {
                        $('.modal-body').html('<div class="alert alert-danger">' + data.error + '</div>');
                    } else {
                        // Populate modal with data
                        $('#modal-name').val(data.name);
                        $('#modal-prisid').val(data.prisid);
                        $('#modal-email').val(data.email);
                        $('#modal-phno').val(data.phno);
                        $('#modal-relation').val(data.relation);
                        $('#modal-jtype').val(data.jtype);
                        $('#modal-jname').val(data.jname);
                        $('#modal-date').val(data.date);
                        $('#modal-message').val(data.message);
                        
                        // Show the actual content
                        $('.modal-body').html($('.modal-body').html()); // Refresh to show the populated fields
                    }
                }, 'json').fail(function() {
                    $('.modal-body').html('<div class="alert alert-danger">Failed to load appointment details.</div>');
                });
            });
            
            // Approve appointment button
            $('#approve-btn').click(function() {
                Swal.fire({
                    title: 'Approve Appointment?',
                    text: "Are you sure you want to approve this appointment request?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#177dff',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Yes, approve it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Here you would typically make an AJAX call to update the status
                        Swal.fire(
                            'Approved!',
                            'The appointment has been approved.',
                            'success'
                        ).then(() => {
                            $('#appointmentModal').modal('hide');
                            // Optionally refresh the page or update the UI
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>
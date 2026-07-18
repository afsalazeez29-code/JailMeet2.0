<?php
// Start session at the very top with no whitespace before
session_start();

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Handle form submissions before any HTML output
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["officer_btn"])) {
        // Add officer logic
        $ofname = mysqli_real_escape_string($connection, trim($_POST["officername"]));
        $ofemail = mysqli_real_escape_string($connection, trim($_POST["officeremail"]));
        $ofpass = mysqli_real_escape_string($connection, trim($_POST["officerpass"]));
        $ofphno = mysqli_real_escape_string($connection, trim($_POST["officerphno"]));

        if (empty($ofname) || empty($ofemail) || empty($ofpass) || empty($ofphno)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'All fields are required!'
            ];
        } elseif (!preg_match('/^[0-9]{10}$/', $ofphno)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'Phone number must be exactly 10 digits!'
            ];
        } else {
            $check_email = "SELECT * FROM officer WHERE ofemail = '$ofemail'";
            $result = mysqli_query($connection, $check_email);

            if (mysqli_num_rows($result) > 0) {
                $_SESSION['alert'] = [
                    'type' => 'error',
                    'title' => 'Error!',
                    'message' => 'Email already exists!'
                ];
            } else {
                $query = "INSERT INTO officer (ofname, ofemail, ofpass, ofphno) 
                          VALUES ('$ofname', '$ofemail', '$ofpass', '$ofphno')";

                if (mysqli_query($connection, $query)) {
                    $_SESSION['alert'] = [
                        'type' => 'success',
                        'title' => 'Success!',
                        'message' => 'Officer added successfully!'
                    ];
                    header("Location: officersdetails.php");
                    exit();
                } else {
                    $_SESSION['alert'] = [
                        'type' => 'error',
                        'title' => 'Error!',
                        'message' => 'Error saving data: ' . mysqli_error($connection)
                    ];
                }
            }
        }
    }
    elseif (isset($_POST["edit_officer_btn"])) {
        // Edit officer logic
        $id = $_POST["officer_id"];
        $name = mysqli_real_escape_string($connection, $_POST["edit_officername"]);
        $email = mysqli_real_escape_string($connection, $_POST["edit_officeremail"]);
        $pass = mysqli_real_escape_string($connection, $_POST["edit_officerpass"]);
        $phone = mysqli_real_escape_string($connection, $_POST["edit_officerphno"]);

        if (empty($name) || empty($email) || empty($pass) || empty($phone)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'All fields are required!'
            ];
        } elseif (!preg_match('/^[0-9]{10}$/', $phone)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'Phone number must be exactly 10 digits!'
            ];
        } else {
            $update_query = "UPDATE officer SET ofname='$name', ofemail='$email', ofpass='$pass', ofphno='$phone' WHERE id='$id'";
            if (mysqli_query($connection, $update_query)) {
                $_SESSION['alert'] = [
                    'type' => 'success',
                    'title' => 'Success!',
                    'message' => 'Officer details updated successfully!'
                ];
                header("Location: officersdetails.php");
                exit();
            } else {
                $_SESSION['alert'] = [
                    'type' => 'error',
                    'title' => 'Error!',
                    'message' => 'Error updating data: ' . mysqli_error($connection)
                ];
            }
        }
    }
    elseif (isset($_POST["delete_officer_btn"])) {
        // Delete officer logic
        $id = $_POST["officer_id"];
        $delete_query = "DELETE FROM officer WHERE id='$id'";
        if (mysqli_query($connection, $delete_query)) {
            $_SESSION['alert'] = [
                'type' => 'success',
                'title' => 'Success!',
                'message' => 'Officer deleted successfully!'
            ];
        } else {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'Error deleting officer: ' . mysqli_error($connection)
            ];
        }
        exit();
    }
}

// Now include other files after processing form submissions
include('includes/navbar.php');
include('includes/sidebar.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Officers Management | JailMeet Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets1/img/kaiadmin/favicon.ico" type="image/x-icon">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- DataTables -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css">
    
    <style>
        :root {
            --primary: #4361ee;
            --primary-light: #e1e7ff;
            --secondary: #3f37c9;
            --success: #4cc9f0;
            --danger: #f72585;
            --warning: #f8961e;
            --info: #4895ef;
            --light: #f8f9fa;
            --dark: #212529;
            --gray: #6c757d;
            --gray-light: #e9ecef;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f5f7fb;
            color: #333;
        }
        
        .sidebar {
            background-color: #fff;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
        }
        
        .main-content {
            padding: 30px;
            margin-left: 280px;
            min-height: 100vh;
        }
        
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
        }
        
        .card-header {
            background-color: #fff;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            padding: 20px 25px;
            border-radius: 12px 12px 0 0 !important;
        }
        
        .card-title {
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 0.25rem;
        }
        
        .card-category {
            color: var(--gray);
            font-size: 0.875rem;
        }
        
        .btn-primary {
            background-color: var(--primary);
            border-color: var(--primary);
            padding: 8px 20px;
            font-weight: 500;
            border-radius: 8px;
        }
        
        .btn-primary:hover {
            background-color: var(--secondary);
            border-color: var(--secondary);
        }
        
        .btn-outline-primary {
            color: var(--primary);
            border-color: var(--primary);
        }
        
        .btn-outline-primary:hover {
            background-color: var(--primary);
            border-color: var(--primary);
        }
        
        .badge {
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
        }
        
        .badge-primary {
            background-color: var(--primary-light);
            color: var(--primary);
        }
        
        .badge-success {
            background-color: rgba(76, 201, 240, 0.1);
            color: var(--success);
        }
        
        .badge-warning {
            background-color: rgba(248, 150, 30, 0.1);
            color: var(--warning);
        }
        
        .table th {
            border-top: none;
            font-weight: 600;
            color: var(--gray);
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.5px;
            background-color: #f8f9fa;
        }
        
        .table td {
            vertical-align: middle;
        }
        
        .action-btn {
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin: 0 3px;
        }
        
        .action-btn i {
            font-size: 14px;
        }
        
        .modal-content {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .form-control, .form-select {
            border-radius: 8px;
            padding: 10px 15px;
            border: 1px solid #e0e0e0;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.15);
        }
        
        .breadcrumb {
            background-color: transparent;
            padding: 0;
            font-size: 0.875rem;
        }
        
        .breadcrumb-item a {
            color: var(--gray);
            text-decoration: none;
        }
        
        .breadcrumb-item.active {
            color: var(--primary);
        }
        
        .page-title {
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }
        
        #officersTable_filter input {
            border-radius: 8px;
            padding: 5px 15px;
            border: 1px solid #e0e0e0;
        }
        
        .dataTables_info, .dataTables_length select {
            font-size: 0.875rem;
            color: var(--gray);
        }
        
        .pagination .page-item .page-link {
            border-radius: 8px;
            margin: 0 3px;
            border: none;
            color: var(--gray);
        }
        
        .pagination .page-item.active .page-link {
            background-color: var(--primary);
            color: white;
        }
        
        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--primary-light);
            color: var(--primary);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 10px;
        }
        
        /* Error message styling */
        .error-message {
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
    </style>
</head>
<body>
    <div class="wrapper d-flex">
        <?php include('includes/sidebar.php'); ?>
        
        <div class="main-content w-100" style="margin-left: 0px;">
            <div class="container-fluid p-0">
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="page-title">Officers Management</h2>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="adindex.php">Dashboard</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Officers</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Officers List</h5>
                                    <p class="card-category">Manage all officers in the system</p>
                                </div>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addOfficerModal">
                                    <i class="bi bi-plus-lg me-2"></i>Add Officer
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="officersTable" class="table table-hover w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Officer</th>
                                                <th>Contact</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $query = "SELECT * FROM officer ORDER BY id DESC";
                                            $query_run = mysqli_query($connection, $query);
                                            while ($row = mysqli_fetch_assoc($query_run)) {
                                                $initials = substr($row['ofname'], 0, 1);
                                                echo "<tr>
                                                        <td>#{$row['id']}</td>
                                                        <td>
                                                            <div class='d-flex align-items-center'>
                                                                <div class='avatar'>{$initials}</div>
                                                                <div>
                                                                    <div class='fw-semibold'>{$row['ofname']}</div>
                                                                    <div class='text-muted small'>{$row['ofemail']}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{$row['ofphno']}</td>
                                                        <td><span class='badge badge-success'>Active</span></td>
                                                        <td>
                                                            <button class='btn btn-sm btn-outline-primary action-btn edit-btn' 
                                                                data-id='{$row['id']}' 
                                                                data-name='{$row['ofname']}' 
                                                                data-email='{$row['ofemail']}' 
                                                                data-pass='{$row['ofpass']}'
                                                                data-phone='{$row['ofphno']}'>
                                                                <i class='bi bi-pencil'></i>
                                                            </button>
                                                            <button class='btn btn-sm btn-outline-danger action-btn delete-btn' data-id='{$row['id']}'>
                                                                <i class='bi bi-trash'></i>
                                                            </button>
                                                        </td>
                                                      </tr>";
                                            }
                                            ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Officer Modal -->
    <div class="modal fade" id="addOfficerModal" tabindex="-1" aria-labelledby="addOfficerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addOfficerModalLabel">Add New Officer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" id="addOfficerForm">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="officername" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="officername" name="officername" placeholder="Enter full name" required>
                        </div>
                        <div class="mb-3">
                            <label for="officeremail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="officeremail" name="officeremail" placeholder="Enter email address" required>
                        </div>
                        <div class="mb-3">
                            <label for="officerpass" class="form-label">Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="officerpass" name="officerpass" placeholder="Enter password" required>
                                <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="officerphno" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="officerphno" name="officerphno" 
                                   placeholder="Enter phone number" required maxlength="10"
                                   pattern="[0-9]{10}" title="Please enter exactly 10 digits">
                            <div class="error-message" id="phoneError"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" name="officer_btn" class="btn btn-primary">Add Officer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Officer Modal -->
    <div class="modal fade" id="editOfficerModal" tabindex="-1" aria-labelledby="editOfficerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editOfficerModalLabel">Edit Officer Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" id="editOfficerForm">
                    <div class="modal-body">
                        <input type="hidden" name="officer_id" id="edit_officer_id">
                        <div class="mb-3">
                            <label for="edit_officername" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="edit_officername" name="edit_officername" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_officeremail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="edit_officeremail" name="edit_officeremail" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_officerpass" class="form-label">Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="edit_officerpass" name="edit_officerpass" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleEditPassword">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="edit_officerphno" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="edit_officerphno" name="edit_officerphno" 
                                   required maxlength="10" pattern="[0-9]{10}" 
                                   title="Please enter exactly 10 digits">
                            <div class="error-message" id="editPhoneError"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" name="edit_officer_btn" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- DataTables -->
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>
    
    <script>
        $(document).ready(function() {
            // Show alert if exists
            <?php if(isset($_SESSION['alert'])): ?>
                Swal.fire({
                    icon: '<?php echo $_SESSION['alert']['type']; ?>',
                    title: '<?php echo $_SESSION['alert']['title']; ?>',
                    text: '<?php echo $_SESSION['alert']['message']; ?>',
                    confirmButtonColor: '#4361ee',
                    timer: 3000
                });
                <?php unset($_SESSION['alert']); ?>
            <?php endif; ?>
            
            // Initialize DataTable
            $('#officersTable').DataTable({
                responsive: true,
                "order": [[0, "desc"]],
                "pageLength": 10,
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search officers...",
                    "lengthMenu": "Show _MENU_ entries",
                    "info": "Showing _START_ to _END_ of _TOTAL_ officers",
                    "infoEmpty": "No officers found",
                    "infoFiltered": "(filtered from _MAX_ total officers)",
                    "paginate": {
                        "previous": "<i class='bi bi-chevron-left'></i>",
                        "next": "<i class='bi bi-chevron-right'></i>"
                    }
                },
                "dom": "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                       "<'row'<'col-sm-12'tr>>" +
                       "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
            });
            
            // Show Edit Modal
            $(document).on('click', '.edit-btn', function() {
                $('#edit_officer_id').val($(this).data('id'));
                $('#edit_officername').val($(this).data('name'));
                $('#edit_officeremail').val($(this).data('email'));
                $('#edit_officerpass').val($(this).data('pass'));
                $('#edit_officerphno').val($(this).data('phone'));
                var editModal = new bootstrap.Modal(document.getElementById('editOfficerModal'));
                editModal.show();
            });
            
            // Delete Confirmation
            $(document).on('click', '.delete-btn', function() {
                var officerId = $(this).data('id');
                
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This officer will be permanently deleted!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4361ee',
                    cancelButtonColor: '#f72585',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'btn btn-danger me-2',
                        cancelButton: 'btn btn-secondary'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.post("officersdetails.php", {
                            delete_officer_btn: true,
                            officer_id: officerId
                        }, function(response) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Officer has been removed.',
                                icon: 'success',
                                confirmButtonColor: '#4361ee',
                                confirmButtonText: 'OK',
                                timer: 3000
                            }).then(() => {
                                location.reload();
                            });
                        }).fail(function() {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to delete officer.',
                                icon: 'error',
                                confirmButtonColor: '#4361ee'
                            });
                        });
                    }
                });
            });
            
            // Toggle password visibility
            $('#togglePassword').on('click', function() {
                const passwordInput = $('#officerpass');
                const icon = $(this).find('i');
                
                if (passwordInput.attr('type') === 'password') {
                    passwordInput.attr('type', 'text');
                    icon.removeClass('bi-eye').addClass('bi-eye-slash');
                } else {
                    passwordInput.attr('type', 'password');
                    icon.removeClass('bi-eye-slash').addClass('bi-eye');
                }
            });
            
            $('#toggleEditPassword').on('click', function() {
                const passwordInput = $('#edit_officerpass');
                const icon = $(this).find('i');
                
                if (passwordInput.attr('type') === 'password') {
                    passwordInput.attr('type', 'text');
                    icon.removeClass('bi-eye').addClass('bi-eye-slash');
                } else {
                    passwordInput.attr('type', 'password');
                    icon.removeClass('bi-eye-slash').addClass('bi-eye');
                }
            });
            
            // Phone number validation
            function validatePhoneNumber(phoneInput, errorElement) {
                const phoneValue = phoneInput.val();
                const phoneRegex = /^[0-9]{10}$/;
                
                if (!phoneRegex.test(phoneValue)) {
                    errorElement.text('Phone number must be exactly 10 digits');
                    return false;
                } else {
                    errorElement.text('');
                    return true;
                }
            }
            
            // Real-time phone number validation for add form
            $('#officerphno').on('input', function() {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
                if ($(this).val().length > 10) {
                    $(this).val($(this).val().slice(0, 10));
                }
                validatePhoneNumber($(this), $('#phoneError'));
            });
            
            // Real-time phone number validation for edit form
            $('#edit_officerphno').on('input', function() {
                $(this).val($(this).val().replace(/[^0-9]/g, ''));
                if ($(this).val().length > 10) {
                    $(this).val($(this).val().slice(0, 10));
                }
                validatePhoneNumber($(this), $('#editPhoneError'));
            });
            
            // Form validation before submission
            $('#addOfficerForm').on('submit', function(e) {
                if (!validatePhoneNumber($('#officerphno'), $('#phoneError'))) {
                    e.preventDefault();
                }
            });
            
            $('#editOfficerForm').on('submit', function(e) {
                if (!validatePhoneNumber($('#edit_officerphno'), $('#editPhoneError'))) {
                    e.preventDefault();
                }
            });
        });
    </script>
</body>
</html>
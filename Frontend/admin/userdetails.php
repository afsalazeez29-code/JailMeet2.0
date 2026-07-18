<?php
// Start session at the very top with no whitespace before
session_start();

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Kerala districts array
$kerala_districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

// Handle form submissions before any HTML output
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["visitor_btn"])) {
        // Add visitor logic
        $usrname = mysqli_real_escape_string($connection, trim($_POST["username"]));
        $usrpass = mysqli_real_escape_string($connection, trim($_POST["userpass"]));
        $usremail = mysqli_real_escape_string($connection, trim($_POST["useremail"]));
        $usrphno = mysqli_real_escape_string($connection, trim($_POST["userphno"]));
        $usrdist = mysqli_real_escape_string($connection, trim($_POST["userdist"]));
        $usradd = mysqli_real_escape_string($connection, trim($_POST["useradd"]));
        $usrzip = mysqli_real_escape_string($connection, trim($_POST["userzip"]));

        if (empty($usrname) || empty($usremail) || empty($usrpass) || empty($usrphno)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'All fields are required!'
            ];
        } elseif (!preg_match('/^[0-9]{10}$/', $usrphno)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'Phone number must be exactly 10 digits!'
            ];
        } else {
            $check_email = "SELECT * FROM visitors WHERE vemail = ?";
            $stmt = mysqli_prepare($connection, $check_email);
            mysqli_stmt_bind_param($stmt, "s", $usremail);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if (mysqli_num_rows($result) > 0) {
                $_SESSION['alert'] = [
                    'type' => 'error',
                    'title' => 'Error!',
                    'message' => 'Email already exists!'
                ];
            } else {
                $plain_password = $usrpass;
                $query = "INSERT INTO visitors (vname, vpass, vemail, vphno, vstate, vadd, vzip) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = mysqli_prepare($connection, $query);
                mysqli_stmt_bind_param($stmt, "sssssss", $usrname, $plain_password, $usremail, $usrphno, $usrdist, $usradd, $usrzip);

                if (mysqli_stmt_execute($stmt)) {
                    $_SESSION['alert'] = [
                        'type' => 'success',
                        'title' => 'Success!',
                        'message' => 'Visitor added successfully!'
                    ];
                    header("Location: userdetails.php");
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
    elseif (isset($_POST["edit_visitor_btn"])) {
        // Edit visitor logic
        if (!isset($_POST["visitor_id"]) || empty($_POST["visitor_id"])) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => 'Visitor ID is missing!'
            ];
        } else {
            $id = mysqli_real_escape_string($connection, $_POST["visitor_id"]);
            $name = mysqli_real_escape_string($connection, $_POST["edit_username"]);
            $email = mysqli_real_escape_string($connection, $_POST["edit_useremail"]);
            $phone = mysqli_real_escape_string($connection, $_POST["edit_userphno"]);
            $add = mysqli_real_escape_string($connection, $_POST["edit_useradd"]);
            $dist = mysqli_real_escape_string($connection, $_POST["edit_userdist"]);
            $zip = mysqli_real_escape_string($connection, $_POST["edit_userzip"]);
            $pass = !empty($_POST["edit_userpass"]) ? $_POST["edit_userpass"] : NULL;

            if (!preg_match('/^[0-9]{10}$/', $phone)) {
                $_SESSION['alert'] = [
                    'type' => 'error',
                    'title' => 'Error!',
                    'message' => 'Phone number must be exactly 10 digits!'
                ];
            } else {
                if ($pass) {
                    $update_query = "UPDATE visitors SET vname=?, vemail=?, vpass=?, vphno=?, vadd=?, vstate=?, vzip=? WHERE vid=?";
                    $stmt = mysqli_prepare($connection, $update_query);
                    mysqli_stmt_bind_param($stmt, "sssssssi", $name, $email, $pass, $phone, $add, $dist, $zip, $id);
                } else {
                    $update_query = "UPDATE visitors SET vname=?, vemail=?, vphno=?, vadd=?, vstate=?, vzip=? WHERE vid=?";
                    $stmt = mysqli_prepare($connection, $update_query);
                    mysqli_stmt_bind_param($stmt, "ssssssi", $name, $email, $phone, $add, $dist, $zip, $id);
                }

                if (mysqli_stmt_execute($stmt)) {
                    $_SESSION['alert'] = [
                        'type' => 'success',
                        'title' => 'Success!',
                        'message' => 'Visitor details updated successfully!'
                    ];
                    header("Location: userdetails.php");
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
    }
    elseif (isset($_POST['delete_btn'])) {
        // Delete visitor logic
        if (isset($_POST['delete_id']) && !empty($_POST['delete_id'])) {
            $visitor_id = mysqli_real_escape_string($connection, $_POST['delete_id']);
            $delete_query = "DELETE FROM visitors WHERE vid = ?";
            $stmt = mysqli_prepare($connection, $delete_query);
            mysqli_stmt_bind_param($stmt, "i", $visitor_id);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['error' => 'Error deleting visitor: ' . mysqli_error($connection)]);
            }
        } else {
            echo json_encode(['error' => 'Visitor ID is missing!']);
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
    <title>Visitor Management | JailMeet Admin</title>
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
        
        #visitorsTable_filter input {
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
        
        /* Add Visitor Button */
        .btn-add-visitor {
            background-color: var(--primary);
            border-color: var(--primary);
            padding: 8px 20px;
            font-weight: 500;
            border-radius: 8px;
        }
        
        .btn-add-visitor:hover {
            background-color: var(--secondary);
            border-color: var(--secondary);
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
                        <h2 class="page-title">Visitor Management</h2>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="adindex.php">Dashboard</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Visitors</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Visitors List</h5>
                                    <p class="card-category">Manage all visitors in the system</p>
                                </div>
                                
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="visitorsTable" class="table table-hover w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Visitor</th>
                                                <th>Contact</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $query = "SELECT * FROM visitors ORDER BY vid DESC";
                                            $query_run = mysqli_query($connection, $query);
                                            while ($row = mysqli_fetch_assoc($query_run)) {
                                                $initials = substr($row['vname'], 0, 1);
                                                echo "<tr>
                                                        <td>#{$row['vid']}</td>
                                                        <td>
                                                            <div class='d-flex align-items-center'>
                                                                <div class='avatar'>{$initials}</div>
                                                                <div>
                                                                    <div class='fw-semibold'>{$row['vname']}</div>
                                                                    <div class='text-muted small'>{$row['vemail']}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>{$row['vphno']}</div>
                                                        </td>
                                                        <td>
                                                            <div class='fw-semibold'>{$row['vstate']}</div>
                                                            <div class='text-muted small'>{$row['vzip']}</div>
                                                        </td>
                                                        <td><span class='badge badge-success'>Active</span></td>
                                                        <td>
                                                            <button class='btn btn-sm btn-outline-primary action-btn edit-btn' 
                                                                data-id='{$row['vid']}' 
                                                                data-name='{$row['vname']}' 
                                                                data-email='{$row['vemail']}' 
                                                                data-pass='{$row['vpass']}'
                                                                data-phone='{$row['vphno']}'
                                                                data-address='{$row['vadd']}'
                                                                data-district='{$row['vstate']}'
                                                                data-zip='{$row['vzip']}'>
                                                                <i class='bi bi-pencil'></i>
                                                            </button>
                                                            <button class='btn btn-sm btn-outline-danger action-btn delete-btn' data-id='{$row['vid']}'>
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

    <!-- Add Visitor Modal -->
    <div class="modal fade" id="addVisitorModal" tabindex="-1" aria-labelledby="addVisitorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addVisitorModalLabel">Add New Visitor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" id="addVisitorForm">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="username" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="username" name="username" placeholder="Enter full name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="useremail" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="useremail" name="useremail" placeholder="Enter email address" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="userpass" class="form-label">Password</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="userpass" name="userpass" placeholder="Enter password" required>
                                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="userphno" class="form-label">Phone Number</label>
                                <input type="text" class="form-control" id="userphno" name="userphno" 
                                       placeholder="Enter phone number" required maxlength="10"
                                       pattern="[0-9]{10}" title="Please enter exactly 10 digits">
                                <div class="error-message" id="phoneError"></div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="useradd" class="form-label">Address</label>
                            <textarea class="form-control" id="useradd" name="useradd" rows="2" required></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="userdist" class="form-label">District</label>
                                <select class="form-select" id="userdist" name="userdist" required>
                                    <option value="">Select District</option>
                                    <?php foreach ($kerala_districts as $district): ?>
                                        <option value="<?= $district ?>"><?= $district ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="userzip" class="form-label">Zip Code</label>
                                <input type="text" class="form-control" id="userzip" name="userzip" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" name="visitor_btn" class="btn btn-primary">Add Visitor</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Visitor Modal -->
    <div class="modal fade" id="editVisitorModal" tabindex="-1" aria-labelledby="editVisitorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editVisitorModalLabel">Edit Visitor Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" id="editVisitorForm">
                    <div class="modal-body">
                        <input type="hidden" name="visitor_id" id="edit_visitor_id">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit_username" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="edit_username" name="edit_username" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit_useremail" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="edit_useremail" name="edit_useremail" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit_userpass" class="form-label">Password (Leave blank to keep current)</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="edit_userpass" name="edit_userpass">
                                    <button class="btn btn-outline-secondary" type="button" id="toggleEditPassword">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit_userphno" class="form-label">Phone Number</label>
                                <input type="text" class="form-control" id="edit_userphno" name="edit_userphno" 
                                       required maxlength="10" pattern="[0-9]{10}" 
                                       title="Please enter exactly 10 digits">
                                <div class="error-message" id="editPhoneError"></div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="edit_useradd" class="form-label">Address</label>
                            <textarea class="form-control" id="edit_useradd" name="edit_useradd" rows="2" required></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit_userdist" class="form-label">District</label>
                                <select class="form-select" id="edit_userdist" name="edit_userdist" required>
                                    <option value="">Select District</option>
                                    <?php foreach ($kerala_districts as $district): ?>
                                        <option value="<?= $district ?>"><?= $district ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit_userzip" class="form-label">Zip Code</label>
                                <input type="text" class="form-control" id="edit_userzip" name="edit_userzip" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" name="edit_visitor_btn" class="btn btn-primary">Update Visitor</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this visitor? This action cannot be undone.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                </div>
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
        $('#visitorsTable').DataTable({
            responsive: true,
            "order": [[0, "desc"]],
            "pageLength": 10,
            "language": {
                "search": "",
                "searchPlaceholder": "Search visitors...",
                "lengthMenu": "Show _MENU_ entries",
                "info": "Showing _START_ to _END_ of _TOTAL_ visitors",
                "infoEmpty": "No visitors found",
                "infoFiltered": "(filtered from _MAX_ total visitors)",
                "paginate": {
                    "previous": "<i class='bi bi-chevron-left'></i>",
                    "next": "<i class='bi bi-chevron-right'></i>"
                }
            },
            "dom": "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                   "<'row'<'col-sm-12'tr>>" +
                   "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
        });
        
        // Edit button click handler - FIXED
        $(document).on('click', '.edit-btn', function() {
            var visitorId = $(this).data("id");
            var visitorName = $(this).data("name");
            var visitorEmail = $(this).data("email");
            var visitorPass = $(this).data("pass");
            var visitorPhone = $(this).data("phone");
            var visitorAddress = $(this).data("address");
            var visitorDistrict = $(this).data("district");
            var visitorZip = $(this).data("zip");

            $("#edit_visitor_id").val(visitorId);
            $("#edit_username").val(visitorName);
            $("#edit_useremail").val(visitorEmail);
            $("#edit_userpass").val(visitorPass);
            $("#edit_userphno").val(visitorPhone);
            $("#edit_useradd").val(visitorAddress);
            $("#edit_userzip").val(visitorZip);
            $("#edit_userdist").val(visitorDistrict);
            
            var editModal = new bootstrap.Modal(document.getElementById('editVisitorModal'));
            editModal.show();
        });

        // Delete button click handler - FIXED
        var deleteId;
        $(document).on('click', '.delete-btn', function() {
            deleteId = $(this).data("id");
            var deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            deleteModal.show();
        });

        // Confirm delete button click handler - FIXED
        $("#confirmDelete").click(function() {
            $.ajax({
                url: "userdetails.php", // Changed to the correct file name
                type: "POST",
                data: {
                    delete_btn: true,
                    delete_id: deleteId
                },
                dataType: 'json', // Ensure we're expecting JSON response
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Visitor has been removed.',
                            icon: 'success',
                            confirmButtonColor: '#4361ee',
                            confirmButtonText: 'OK',
                            timer: 3000
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: response.error || 'Error deleting visitor',
                            icon: 'error',
                            confirmButtonColor: '#4361ee'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error deleting visitor: ' + error,
                        icon: 'error',
                        confirmButtonColor: '#4361ee'
                    });
                }
            });
        });
        
        // Toggle password visibility
        $('#togglePassword').on('click', function() {
            const passwordInput = $('#userpass');
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
            const passwordInput = $('#edit_userpass');
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
        $('#userphno').on('input', function() {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
            if ($(this).val().length > 10) {
                $(this).val($(this).val().slice(0, 10));
            }
            validatePhoneNumber($(this), $('#phoneError'));
        });
        
        // Real-time phone number validation for edit form
        $('#edit_userphno').on('input', function() {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
            if ($(this).val().length > 10) {
                $(this).val($(this).val().slice(0, 10));
            }
            validatePhoneNumber($(this), $('#editPhoneError'));
        });
        
        // Form validation before submission
        $('#addVisitorForm').on('submit', function(e) {
            if (!validatePhoneNumber($('#userphno'), $('#phoneError'))) {
                e.preventDefault();
            }
        });
        
        $('#editVisitorForm').on('submit', function(e) {
            if (!validatePhoneNumber($('#edit_userphno'), $('#editPhoneError'))) {
                e.preventDefault();
            }
        });
    });
</script>
</body>
</html>
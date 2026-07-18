<?php
// Enable error reporting for debugging


// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'jailmeet';
$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

// Test database connection
$test_query = "SELECT 1";
if (!$conn->query($test_query)) {
    error_log("Database test query failed: " . $conn->error);
    die("Database test query failed: " . $conn->error);
}

// Path configuration
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$uploadsDir = '/Project/JailMeet/officer/uploads/';
$uploadsDirServer = $_SERVER['DOCUMENT_ROOT'] . '/Project/JailMeet/officer/uploads/';
$defaultImage = '/Project/JailMeet/images/default_prisoner.png';
$defaultImageServer = $_SERVER['DOCUMENT_ROOT'] . '/Project/JailMeet/images/default_prisoner.png';
$placeholderImage = '/Project/JailMeet/images/placeholder.png';

// Log path checks
error_log("Uploads directory: $uploadsDirServer, exists: " . (is_dir($uploadsDirServer) ? 'yes' : 'no'));
error_log("Default image: $defaultImageServer, exists: " . (file_exists($defaultImageServer) ? 'yes' : 'no'));

// Ensure uploads directory exists and is writable
if (!is_dir($uploadsDirServer)) {
    if (!mkdir($uploadsDirServer, 0755, true)) {
        error_log("Failed to create uploads directory: $uploadsDirServer");
        die("Failed to create uploads directory: $uploadsDirServer");
    }
}
if (!is_writable($uploadsDirServer)) {
    error_log("Uploads directory is not writable: $uploadsDirServer");
    die("Uploads directory is not writable: $uploadsDirServer");
}

// Verify default image exists
if (!file_exists($defaultImageServer)) {
    error_log("Default image not found: $defaultImageServer");
}

// Handle delete request
if (isset($_POST['delete_btn']) && isset($_POST['delete_id'])) {
    $pris_id = $conn->real_escape_string($_POST['delete_id']);
    
    // Get the prisoner's image to delete it
    $query = "SELECT dp FROM prisoner WHERE pris_id = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        error_log("Prepare failed for delete image query: " . $conn->error);
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        exit();
    }
    $stmt->bind_param("s", $pris_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $image_filename = basename($row['dp']);
        $image_path = !empty($row['dp']) ? $uploadsDirServer . $image_filename : null;
        
        // Delete the prisoner record
        $delete_query = "DELETE FROM prisoner WHERE pris_id = ?";
        $delete_stmt = $conn->prepare($delete_query);
        if (!$delete_stmt) {
            error_log("Prepare failed for delete query: " . $conn->error);
            echo json_encode(['error' => 'Database error: ' . $conn->error]);
            exit();
        }
        $delete_stmt->bind_param("s", $pris_id);
        
        if ($delete_stmt->execute()) {
            // Delete the image file if it exists
            if ($image_path && file_exists($image_path)) {
                unlink($image_path);
                error_log("Deleted image for prisoner $pris_id: $image_path");
            }
            echo json_encode(['success' => true]);
            error_log("Deleted prisoner $pris_id successfully");
        } else {
            echo json_encode(['error' => "Error deleting prisoner: " . $delete_stmt->error]);
            error_log("Error deleting prisoner $pris_id: " . $delete_stmt->error);
        }
        $delete_stmt->close();
    } else {
        echo json_encode(['error' => 'Prisoner not found']);
        error_log("Prisoner not found for deletion: $pris_id");
    }
    $stmt->close();
    exit();
}

// Handle form submission for update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_prisoner'])) {
    error_log("Update form submitted: " . print_r($_POST, true));
    error_log("Files: " . print_r($_FILES, true));

    $pris_id = $conn->real_escape_string($_POST['pris_id'] ?? '');
    
    // Validate required fields
    $required_fields = ['pris_name', 'pris_age', 'pris_gender', 'pris_case', 'pris_adm', 'pris_period', 'jailtype', 'jailname'];
    $errors = [];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $errors[] = "Field '$field' is required";
        }
    }
    // Validate pris_age
    $pris_age = isset($_POST['pris_age']) ? (int)$_POST['pris_age'] : 0;
    if ($pris_age < 1 || $pris_age > 150) {
        $errors[] = "Age must be between 1 and 150";
    }
    
    if (!empty($errors)) {
        $_SESSION['alert'] = [
            'type' => 'error',
            'title' => 'Error!',
            'message' => "Validation errors: " . implode(", ", $errors)
        ];
        error_log("Validation errors: " . implode(", ", $errors));
        header("Location: prisonerdetails.php");
        exit();
    }

    // Prepare form data
    $pris_name = $conn->real_escape_string($_POST['pris_name']);
    $pris_gender = $conn->real_escape_string($_POST['pris_gender']);
    $pris_case = $conn->real_escape_string($_POST['pris_case']);
    $pris_adm = $conn->real_escape_string($_POST['pris_adm']);
    $pris_period = $conn->real_escape_string($_POST['pris_period']);
    $jailtype = $conn->real_escape_string($_POST['jailtype']);
    $jailname = $conn->real_escape_string($_POST['jailname']);
    $pris_cell = $conn->real_escape_string($_POST['pris_cell'] ?? '');
    $checkup = $conn->real_escape_string($_POST['checkup'] ?? '');
    $blood = $conn->real_escape_string($_POST['blood'] ?? '');
    $allergies = $conn->real_escape_string($_POST['allergies'] ?? '');

    // Fetch current dp value to retain if no new image
    $query = "SELECT dp FROM prisoner WHERE pris_id = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        $_SESSION['alert'] = [
            'type' => 'error',
            'title' => 'Error!',
            'message' => "Database error: " . $conn->error
        ];
        error_log("Prepare failed for fetch dp: " . $conn->error);
        header("Location: prisonerdetails.php");
        exit();
    }
    $stmt->bind_param("s", $pris_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $current_dp = $result->num_rows > 0 ? $result->fetch_assoc()['dp'] : '';
    $stmt->close();

    // Handle file upload
    $dp = $current_dp; // Default to current dp
    if (!empty($_FILES['dp']['name']) && $_FILES['dp']['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxSize = 5 * 1024 * 1024; // 5MB
        if (!in_array($_FILES['dp']['type'], $allowedTypes)) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => "Invalid file type. Only JPG, PNG, GIF allowed."
            ];
            error_log("Invalid file type for prisoner $pris_id: " . $_FILES['dp']['type']);
            header("Location: prisonerdetails.php");
            exit();
        }
        if ($_FILES['dp']['size'] > $maxSize) {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => "File size exceeds 5MB limit."
            ];
            error_log("File size too large for prisoner $pris_id: " . $_FILES['dp']['size']);
            header("Location: prisonerdetails.php");
            exit();
        }

        $filename = uniqid() . '_' . basename($_FILES['dp']['name']);
        $targetPath = $uploadsDirServer . $filename;
        
        if (move_uploaded_file($_FILES['dp']['tmp_name'], $targetPath)) {
            $dp = $filename; // Use new filename
            error_log("Uploaded new image for prisoner $pris_id: $targetPath");
        } else {
            $_SESSION['alert'] = [
                'type' => 'error',
                'title' => 'Error!',
                'message' => "Failed to upload image."
            ];
            error_log("Failed to move uploaded file to: $targetPath");
            header("Location: prisonerdetails.php");
            exit();
        }
    }

    // Prepare update query
    $query = "UPDATE prisoner SET pris_name = ?, pris_age = ?, pris_gender = ?, pris_case = ?, pris_adm = ?, pris_period = ?, jailtype = ?, jailname = ?, pris_cell = ?, checkup = ?, blood = ?, allergies = ?, dp = ? WHERE pris_id = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        $_SESSION['alert'] = [
            'type' => 'error',
            'title' => 'Error!',
            'message' => "Database error: " . $conn->error
        ];
        error_log("Prepare failed for update prisoner $pris_id: " . $conn->error);
        header("Location: prisonerdetails.php");
        exit();
    }

    // Bind parameters
    $stmt->bind_param(
        "sissssssssssss",
        $pris_name,
        $pris_age,
        $pris_gender,
        $pris_case,
        $pris_adm,
        $pris_period,
        $jailtype,
        $jailname,
        $pris_cell,
        $checkup,
        $blood,
        $allergies,
        $dp,
        $pris_id
    );

    if ($stmt->execute()) {
        // Delete old image if a new one was uploaded
        if ($dp !== $current_dp && !empty($current_dp) && file_exists($uploadsDirServer . $current_dp)) {
            unlink($uploadsDirServer . $current_dp);
            error_log("Deleted old image for prisoner $pris_id: $uploadsDirServer$current_dp");
        }
        $_SESSION['alert'] = [
            'type' => 'success',
            'title' => 'Success!',
            'message' => "Prisoner updated successfully"
        ];
        error_log("Updated prisoner $pris_id successfully, dp set to: $dp");
    } else {
        $_SESSION['alert'] = [
            'type' => 'error',
            'title' => 'Error!',
            'message' => "Error updating prisoner: " . $stmt->error
        ];
        error_log("Error updating prisoner $pris_id: " . $stmt->error);
    }
    $stmt->close();
    
    header("Location: prisonerdetails.php");
    exit();
}

// Handle AJAX request for fetching prisoner data
if (isset($_GET['action']) && $_GET['action'] === 'fetch_prisoner' && isset($_GET['id'])) {
    header('Content-Type: application/json');
    $id = $conn->real_escape_string($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM prisoner WHERE pris_id = ?");
    if (!$stmt) {
        error_log("Prepare failed for fetch prisoner: " . $conn->error);
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        exit();
    }
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (!$result) {
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        error_log("Database error for prisoner $id: " . $conn->error);
    } elseif ($result->num_rows === 0) {
        echo json_encode(['error' => 'Prisoner not found']);
        error_log("Prisoner not found: $id");
    } else {
        $prisoner = $result->fetch_assoc();
        $filename = basename($prisoner['dp']);
        $imagePath = !empty($prisoner['dp']) && file_exists($uploadsDirServer . $filename)
            ? $baseUrl . $uploadsDir . rawurlencode($filename)
            : $baseUrl . $defaultImage;
        $prisoner['image_url'] = $imagePath;
        error_log("AJAX image URL for prisoner $id: $imagePath (dp: {$prisoner['dp']})");
        echo json_encode($prisoner);
    }
    $stmt->close();
    $conn->close();
    exit();
}

include('includes/navbar.php');
include('includes/sidebar.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Prisoner Management | JailMeet Admin</title>
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
        
        #prisonersTable_filter input {
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
        
        .error-message {
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }
        
        .preview-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid var(--primary);
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="wrapper d-flex">
        <?php include('includes/sidebar.php'); ?>
        
        <div class="main-content w-100" style="
    margin-left: 0px;
    padding-top: 100px;
">
            <div class="container-fluid p-0">
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="page-title">Prisoner Management</h2>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="adindex.php">Dashboard</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Prisoners</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Prisoners List</h5>
                                    <p class="card-category">Manage all prisoners in the system</p>
                                </div>
                                
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="prisonersTable" class="table table-hover w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Prisoner</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Crime</th>
                                                <th>Admission</th>
                                                <th>Release Date</th>
                                                <th>Jail</th>
                                                <th>Health</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $query = "SELECT pris_id, dp, pris_name, pris_age, pris_gender, pris_case, pris_adm, pris_period, jailtype, jailname, pris_cell, checkup, blood, allergies FROM prisoner";
                                            $result = $conn->query($query);
                                            
                                            if (!$result) {
                                                error_log("Table query failed: " . $conn->error);
                                                echo "<tr><td colspan='10' class='text-danger'>Database Error: " . htmlspecialchars($conn->error) . "</td></tr>";
                                            } elseif ($result->num_rows === 0) {
                                                echo "<tr><td colspan='10'>No prisoner records found</td></tr>";
                                            } else {
                                                while ($row = $result->fetch_assoc()) {
                                                    $filename = basename($row['dp']);
                                                    $imagePath = !empty($row['dp']) && file_exists($uploadsDirServer . $filename)
                                                        ? $baseUrl . $uploadsDir . rawurlencode($filename)
                                                        : $baseUrl . $defaultImage;
                                                    $initials = substr($row['pris_name'], 0, 1);
                                                    error_log("Table image path for prisoner {$row['pris_id']}: $imagePath (dp: {$row['dp']})");
                                                    
                                                    echo "<tr>";
                                                    echo "<td>#" . htmlspecialchars($row['pris_id'] ?? 'Unknown') . "</td>";
                                                    echo "<td>
                                                            <div class='d-flex align-items-center'>
                                                                <img src='$imagePath' class='avatar' alt='Profile Picture' onerror=\"console.error('Failed to load image: $imagePath'); this.src='$baseUrl$placeholderImage'; this.onerror=null;\">
                                                                <div>
                                                                    <div class='fw-semibold'>" . htmlspecialchars($row['pris_name'] ?? 'Unknown') . "</div>
                                                                    <div class='text-muted small'>ID: {$row['pris_id']}</div>
                                                                </div>
                                                            </div>
                                                          </td>";
                                                    echo "<td>" . htmlspecialchars($row['pris_age'] ?? 'Unknown') . "</td>";
                                                    echo "<td>" . htmlspecialchars($row['pris_gender'] ?? 'Unknown') . "</td>";
                                                    echo "<td>" . htmlspecialchars($row['pris_case'] ?? 'Unknown') . "</td>";
                                                    echo "<td>" . htmlspecialchars($row['pris_adm'] ?? 'Unknown') . "</td>";
                                                    echo "<td>" . htmlspecialchars($row['pris_period'] ?? 'Unknown') . "</td>";
                                                    echo "<td>
                                                            <div class='fw-semibold'>" . htmlspecialchars($row['jailname'] ?? 'Unknown') . "</div>
                                                            <div class='text-muted small'>" . htmlspecialchars($row['jailtype'] ?? 'Unknown') . "</div>
                                                          </td>";
                                                    echo "<td>
                                                            <div>Blood: " . htmlspecialchars($row['blood'] ?? 'Unknown') . "</div>
                                                            <div class='text-muted small'>Allergies: " . htmlspecialchars($row['allergies'] ?? 'None') . "</div>
                                                          </td>";
                                                    echo "<td>
                                                            <button class='btn btn-sm btn-outline-primary action-btn edit-btn' data-id='" . htmlspecialchars($row['pris_id']) . "'>
                                                                <i class='bi bi-pencil'></i>
                                                            </button>
                                                            <button class='btn btn-sm btn-outline-danger action-btn delete-btn' data-id='" . htmlspecialchars($row['pris_id']) . "'>
                                                                <i class='bi bi-trash'></i>
                                                            </button>
                                                          </td>";
                                                    echo "</tr>";
                                                }
                                            }
                                            $result->free();
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

    <!-- Add Prisoner Modal (Placeholder) -->
    <div class="modal fade" id="addPrisonerModal" tabindex="-1" aria-labelledby="addPrisonerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addPrisonerModalLabel">Add New Prisoner</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Feature not implemented in the original code. Please add the form and backend logic to enable adding new prisoners.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Prisoner Modal -->
    <div class="modal fade" id="editPrisonerModal" tabindex="-1" aria-labelledby="editPrisonerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editPrisonerModalLabel">Edit Prisoner Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" id="editPrisonerForm" enctype="multipart/form-data" novalidate>
                    <div class="modal-body">
                        <div class="error-message" id="modalError"></div>
                        <input type="hidden" name="pris_id" id="pris_id">
                        <input type="hidden" name="update_prisoner" value="1">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <img src="<?= $baseUrl . $defaultImage ?>" class="preview-image" id="imagePreview" alt="Profile Picture">
                                <div class="mb-3">
                                    <label for="dp" class="form-label">Profile Picture</label>
                                    <input type="file" class="form-control" id="dp" name="dp" accept="image/jpeg,image/png,image/gif">
                                    <small class="text-muted">Max 5MB, JPG/PNG/GIF only</small>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label for="pris_name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="pris_name" name="pris_name" required>
                                    <div class="error-message">Please enter a name.</div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="pris_age" class="form-label">Age</label>
                                        <input type="number" class="form-control" id="pris_age" name="pris_age" required min="1" max="150">
                                        <div class="error-message">Please enter a valid age (1-150).</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="pris_gender" class="form-label">Gender</label>
                                        <select class="form-select" id="pris_gender" name="pris_gender" required>
                                            <option value="" disabled selected>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div class="error-message">Please select a gender.</div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="pris_case" class="form-label">Crime</label>
                                    <input type="text" class="form-control" id="pris_case" name="pris_case" required>
                                    <div class="error-message">Please enter the crime.</div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="pris_adm" class="form-label">Admission Date</label>
                                        <input type="date" class="form-control" id="pris_adm" name="pris_adm" required>
                                        <div class="error-message">Please select an admission date.</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="pris_period" class="form-label">Release Date</label>
                                        <input type="date" class="form-control" id="pris_period" name="pris_period" required>
                                        <div class="error-message">Please select a release date after admission date.</div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="jailtype" class="form-label">Jail Type</label>
                                        <select class="form-select" id="jailtype" name="jailtype" required>
                                            <option value="" disabled selected>Select Jail Type</option>
                                            <option value="Central Jails">Central Jails</option>
                                            <option value="Sub Jails">Sub Jails</option>
                                            <option value="District Jails">District Jails</option>
                                            <option value="Special Sub Jails">Special Sub Jails</option>
                                            <option value="Women's Jails">Women's Jails</option>
                                            <option value="Open Jails">Open Jails</option>
                                            <option value="Other Jails">Other Jails</option>
                                        </select>
                                        <div class="error-message">Please select a jail type.</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="jailname" class="form-label">Jail Name</label>
                                        <select class="form-select" id="jailname" name="jailname" required>
                                            <option value="" disabled selected>Select Jail Name</option>
                                        </select>
                                        <div class="error-message">Please select a jail name.</div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="pris_cell" class="form-label">Cell Block</label>
                                    <input type="text" class="form-control" id="pris_cell" name="pris_cell">
                                </div>
                                <div class="mb-3">
                                    <label for="checkup" class="form-label">Last Checkup</label>
                                    <input type="date" class="form-control" id="checkup" name="checkup">
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="blood" class="form-label">Blood Type</label>
                                        <select class="form-select" id="blood" name="blood">
                                            <option value="" selected>Select Blood Type</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="allergies" class="form-label">Allergies</label>
                                        <input type="text" class="form-control" id="allergies" name="allergies">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
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
                    Are you sure you want to delete this prisoner? This action cannot be undone.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>

    <script>
        // Jail options data
        const jailOptions = {
            "Central Jails": [
                "Central Prison & Correctional Home, Poojappura, Thiruvananthapuram",
                "Central Prison & Correctional Home, Viyyur, Thrissur",
                "Central Prison & Correctional Home, Pallikkunnu, Kannur",
                "Central Prison & Correctional Home, Tavanur, Malappuram"
            ],
            "Sub Jails": [
                "Sub Jail, Attingal", "Sub Jail, Meenachil", "Sub Jail, Peerumade", "Sub Jail, Mattancherry",
                "Sub Jail, Ernakulam", "Sub Jail, Aluva", "Sub Jail, Chavakkad", "Sub Jail, Viyyur",
                "Sub Jail, Alathur", "Sub Jail, Ottappalam", "Sub Jail, Perinthalmanna", "Sub Jail, Ponnani",
                "Sub Jail, Tirur", "Sub Jail, Koyilandy", "Sub Jail, Vatakara", "Sub Jail, Kannur"
            ],
            "District Jails": [
                "District Jail, Thiruvananthapuram (Poojappura)", "District Jail, Kollam", "District Jail, Pathanamthitta",
                "District Jail, Alappuzha", "District Jail, Kottayam", "District Jail, Idukki (Muttom)",
                "District Jail, Ernakulam", "District Jail, Thrissur (Viyyur)", "District Jail, Palakkad (Malampuzha)",
                "District Jail, Kozhikode", "District Jail, Kannur", "District Jail, Wayanad (Mananthavady)",
                "District Jail, Kasaragod (Hosdurg)"
            ],
            "Special Sub Jails": [
                "Special Sub Jail, Thiruvananthapuram (Poojappura)", "Special Sub Jail, Neyyattinkara", "Special Sub Jail, Kottarakkara",
                "Special Sub Jail, Mavelikkara", "Special Sub Jail, Ponkunnam", "Special Sub Jail, Devikulam",
                "Special Sub Jail, Muvattupuzha", "Special Sub Jail, Irinjalakkuda", "Special Sub Jail, Chittoor",
                "Special Sub Jail, Manjeri", "Special Sub Jail, Kozhikode", "Special Sub Jail, Vythiri",
                "Special Sub Jail, Kannur", "Special Sub Jail, Thalassery", "Special Sub Jail, Koothuparambu",
                "Special Sub Jail, Kasaragod"
            ],
            "Women's Jails": [
                "Women Prison & Correctional Home, Thiruvananthapuram",
                "Women Prison & Correctional Home, Viyyur",
                "Women Prison & Correctional Home, Kannur"
            ],
            "Open Jails": [
                "Open Prison & Correctional Home, Nettukaltheri, Thiruvananthapuram",
                "Open Prison & Correctional Home, Cheemeni, Kasaragod",
                "Women Open Prison & Correctional Home, Poojappura, Thiruvananthapuram"
            ],
            "Other Jails": [
                "Borstal School, Kakkanad"
            ]
        };

        // Update jail names based on selected jail type
        function updateJailNames(jailType, jailName = '') {
            const jailNameSelect = document.getElementById("jailname");
            jailNameSelect.innerHTML = "<option value='' disabled selected>Select Jail Name</option>";

            if (jailOptions[jailType]) {
                jailOptions[jailType].forEach(jail => {
                    const option = document.createElement("option");
                    option.value = jail;
                    option.textContent = jail;
                    if (jail === jailName) {
                        option.selected = true;
                    }
                    jailNameSelect.appendChild(option);
                });
            }
        }

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
            $('#prisonersTable').DataTable({
                responsive: true,
                order: [[0, "asc"]],
                pageLength: 10,
                language: {
                    search: "",
                    searchPlaceholder: "Search prisoners...",
                    lengthMenu: "Show _MENU_ entries",
                    info: "Showing _START_ to _END_ of _TOTAL_ prisoners",
                    infoEmpty: "No prisoners found",
                    infoFiltered: "(filtered from _MAX_ total prisoners)",
                    paginate: {
                        previous: "<i class='bi bi-chevron-left'></i>",
                        next: "<i class='bi bi-chevron-right'></i>"
                    }
                },
                dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                     "<'row'<'col-sm-12'tr>>" +
                     "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                columnDefs: [
                    { orderable: false, targets: [9] },
                    { responsivePriority: 1, targets: [0, 1, 9] }
                ]
            });

            // Handle jail type change
            $('#jailtype').on('change', function() {
                updateJailNames(this.value);
            });

            // Handle image preview for file input
            $('#dp').on('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $('#imagePreview').attr('src', e.target.result);
                        console.log('Preview image set to:', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Update release date min attribute based on admission date
            $('#pris_adm').on('change', function() {
                const admDate = $(this).val();
                if (admDate) {
                    $('#pris_period').attr('min', admDate);
                    const releaseDate = $('#pris_period').val();
                    if (releaseDate && releaseDate < admDate) {
                        $('#pris_period').val('');
                    }
                } else {
                    $('#pris_period').removeAttr('min');
                }
            });

            // Client-side form validation
            $('#editPrisonerForm').on('submit', function(e) {
                const form = this;
                const admDate = $('#pris_adm').val();
                const releaseDate = $('#pris_period').val();
                
                if (admDate && releaseDate && releaseDate < admDate) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#pris_period').addClass('is-invalid');
                    $('#modalError').text('Release date must be after admission date.').show();
                    return;
                }

                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(form).find('.form-control:invalid, .form-select:invalid').each(function() {
                        $(this).siblings('.error-message').show();
                    });
                } else {
                    const formData = new FormData(form);
                    console.log('Submitting form data:', Object.fromEntries(formData));
                }
                form.classList.add('was-validated');
            });

            // Handle edit button click
            $(document).on('click', '.edit-btn', function() {
                const prisonerId = $(this).data('id');
                $('#modalError').hide();
                
                const modal = new bootstrap.Modal(document.getElementById('editPrisonerModal'));
                modal.show();

                // Reset image to default
                $('#imagePreview').attr('src', '<?= $baseUrl . $defaultImage ?>');

                $.ajax({
                    url: `?action=fetch_prisoner&id=${prisonerId}`,
                    method: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        if (data.error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: data.error,
                                confirmButtonColor: '#4361ee'
                            });
                            return;
                        }

                        console.log('Prisoner image URL:', data.image_url);
                        console.log('Prisoner gender:', data.pris_gender);

                        $('#pris_id').val(data.pris_id || '');
                        $('#pris_name').val(data.pris_name || '');
                        $('#pris_age').val(data.pris_age || '');
                        
                        let gender = data.pris_gender || '';
                        if (gender) {
                            gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
                            if (!['Male', 'Female', 'Other'].includes(gender)) {
                                gender = '';
                            }
                        }
                        $('#pris_gender').val(gender);
                        
                        $('#pris_case').val(data.pris_case || '');
                        $('#pris_adm').val(data.pris_adm || '');
                        $('#pris_period').val(data.pris_period || '');
                        $('#jailtype').val(data.jailtype || '');
                        updateJailNames(data.jailtype || '', data.jailname || '');
                        $('#pris_cell').val(data.pris_cell || '');
                        $('#checkup').val(data.checkup || '');
                        $('#blood').val(data.blood || '');
                        $('#allergies').val(data.allergies || '');

                        if (data.pris_adm) {
                            $('#pris_period').attr('min', data.pris_adm);
                            if (data.pris_period && data.pris_period < data.pris_adm) {
                                $('#pris_period').val('');
                            }
                        } else {
                            $('#pris_period').removeAttr('min');
                        }

                        const imageUrl = data.image_url || '<?= $baseUrl . $defaultImage ?>';
                        $('#imagePreview').attr('src', imageUrl).on('error', function() {
                            console.error('Failed to load modal image:', imageUrl);
                            this.src = '<?= $baseUrl . $placeholderImage ?>';
                            this.onerror = null;
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('AJAX error:', textStatus, errorThrown);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to fetch prisoner data',
                            confirmButtonColor: '#4361ee'
                        });
                    }
                });
            });

            // Delete button click handler
            let deleteId;
            $(document).on('click', '.delete-btn', function() {
                deleteId = $(this).data('id');
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
                deleteModal.show();
            });

            // Confirm delete button click handler
            $('#confirmDelete').click(function() {
                $.ajax({
                    url: 'prisonerdetails.php',
                    type: 'POST',
                    data: {
                        delete_btn: true,
                        delete_id: deleteId
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Prisoner has been removed.',
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
                                text: response.error || 'Error deleting prisoner',
                                icon: 'error',
                                confirmButtonColor: '#4361ee'
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Delete AJAX error:', status, error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error deleting prisoner: ' + error,
                            icon: 'error',
                            confirmButtonColor: '#4361ee'
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>
<?php
$conn->close();
ob_end_flush(); // Flush output buffer
?>
<?php
// Start output buffering
ob_start();
session_start();

// Include database connection
include('db.php');

// Initialize messages
$error = '';
$success = '';

// Base URL for image paths
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

// Path configuration
$uploadsDir = '/Project/JailMeet/officer/uploads/';
$uploadsDirServer = $_SERVER['DOCUMENT_ROOT'] . '/Project/JailMeet/officer/uploads/';
$defaultImage = '/Project/JailMeet/images/default_prisoner.png';
$defaultImageServer = $_SERVER['DOCUMENT_ROOT'] . '/Project/JailMeet/images/default_prisoner.png';
$placeholderImage = '/Project/JailMeet/images/placeholder.png';

// Ensure uploads directory exists and is writable
if (!is_dir($uploadsDirServer)) {
    if (!mkdir($uploadsDirServer, 0755, true)) {
        die("Failed to create uploads directory: $uploadsDirServer. Please create it manually with 755 permissions.");
    }
}
if (!is_writable($uploadsDirServer)) {
    if (!chmod($uploadsDirServer, 0755)) {
        die("Uploads directory is not writable: $uploadsDirServer. Please set permissions to 755.");
    }
}

// Verify default image exists
if (!file_exists($defaultImageServer)) {
    error_log("Default image not found: $defaultImageServer. Please create /Project/JailMeet/images/default_prisoner.png.");
}

// Process form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_prisoner'])) {
        // Validate and sanitize all inputs
        $name = isset($_POST['pris_name']) ? mysqli_real_escape_string($connection, trim($_POST['pris_name'])) : '';
        $age = isset($_POST['pris_age']) ? intval($_POST['pris_age']) : 0;
        $gender = isset($_POST['pris_gender']) ? mysqli_real_escape_string($connection, $_POST['pris_gender']) : '';
        $crime = isset($_POST['pris_case']) ? mysqli_real_escape_string($connection, trim($_POST['pris_case'])) : '';
        $adm_date = isset($_POST['pris_adm']) ? mysqli_real_escape_string($connection, $_POST['pris_adm']) : '';
        $period = isset($_POST['pris_period']) ? mysqli_real_escape_string($connection, $_POST['pris_period']) : '';
        $jailtype = isset($_POST['jailtype']) ? mysqli_real_escape_string($connection, $_POST['jailtype']) : '';
        $jailname = isset($_POST['jailname']) ? mysqli_real_escape_string($connection, $_POST['jailname']) : '';
        $cellblock = isset($_POST['pris_cell']) ? mysqli_real_escape_string($connection, $_POST['pris_cell']) : '';
        $checkup = isset($_POST['checkup']) ? mysqli_real_escape_string($connection, $_POST['checkup']) : '';
        $blood = isset($_POST['blood']) ? mysqli_real_escape_string($connection, $_POST['blood']) : '';
        $allergies = isset($_POST['allergies']) ? mysqli_real_escape_string($connection, $_POST['allergies']) : '';
        
        // Handle file upload
        $dp = '';
        if (isset($_FILES['dp']) && $_FILES['dp']['error'] === UPLOAD_ERR_OK) {
            $file_name = basename($_FILES["dp"]["name"]);
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (in_array($file_ext, $allowed_ext)) {
                $unique_name = uniqid() . '_' . time() . '.' . $file_ext;
                $target_file = $uploadsDirServer . $unique_name;
                
                if (move_uploaded_file($_FILES["dp"]["tmp_name"], $target_file)) {
                    $dp = $unique_name; // Store only filename
                    error_log("Uploaded image: $target_file (stored as $dp)");
                } else {
                    $error = "Sorry, there was an error uploading your file.";
                    error_log("File upload error: " . $_FILES['dp']['error']);
                }
            } else {
                $error = "Only JPG, JPEG, PNG & GIF files are allowed.";
            }
        }

        // Validate required fields
        if (empty($name) || empty($age) || empty($gender) || empty($crime) || 
            empty($adm_date) || empty($period) || empty($jailtype) || empty($jailname)) {
            $error = "All required fields must be filled!";
        } else {
            // Use prepared statement for security
            $query = "INSERT INTO prisoner 
                     (pris_name, pris_age, pris_gender, pris_case, pris_adm, pris_period, 
                      jailtype, jailname, pris_cell, checkup, blood, allergies, dp, par_status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '')";
            
            $stmt = mysqli_prepare($connection, $query);
            if (!$stmt) {
                $error = "Database error: " . mysqli_error($connection);
            } else {
                mysqli_stmt_bind_param($stmt, 'sisssssssssss', 
                    $name, $age, $gender, $crime, $adm_date, $period,
                    $jailtype, $jailname, $cellblock, $checkup, $blood, $allergies, $dp);
                
                if (mysqli_stmt_execute($stmt)) {
                    $_SESSION['success'] = "New Prisoner Added Successfully";
                    header("Location: prisoners.php");
                    exit();
                } else {
                    $error = "Database error: " . mysqli_error($connection);
                }
                mysqli_stmt_close($stmt);
            }
        }
    } elseif (isset($_POST['update_prisoner'])) {
        // Handle update
        $id = intval($_POST['pris_id']);
        $name = mysqli_real_escape_string($connection, trim($_POST['pris_name']));
        $age = intval($_POST['pris_age']);
        $gender = mysqli_real_escape_string($connection, $_POST['pris_gender']);
        $crime = mysqli_real_escape_string($connection, trim($_POST['pris_case']));
        $adm_date = mysqli_real_escape_string($connection, $_POST['pris_adm']);
        $period = mysqli_real_escape_string($connection, $_POST['pris_period']);
        $jailtype = mysqli_real_escape_string($connection, $_POST['jailtype']);
        $jailname = mysqli_real_escape_string($connection, $_POST['jailname']);
        $cellblock = mysqli_real_escape_string($connection, $_POST['pris_cell']);
        $checkup = mysqli_real_escape_string($connection, $_POST['checkup']);
        $blood = mysqli_real_escape_string($connection, $_POST['blood']);
        $allergies = mysqli_real_escape_string($connection, $_POST['allergies']);
        
        // Fetch old image path
        $query = "SELECT dp FROM prisoner WHERE pris_id = ?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $old_img_data = mysqli_fetch_assoc($result);
        $old_img_path = $old_img_data['dp'];
        mysqli_stmt_close($stmt);
        
        // Handle file upload
        $dp = $old_img_path;
        if (isset($_FILES['dp']) && $_FILES['dp']['error'] === UPLOAD_ERR_OK) {
            $file_name = basename($_FILES["dp"]["name"]);
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (in_array($file_ext, $allowed_ext)) {
                $unique_name = uniqid() . '_' . time() . '.' . $file_ext;
                $target_file = $uploadsDirServer . $unique_name;
                
                if (move_uploaded_file($_FILES["dp"]["tmp_name"], $target_file)) {
                    $dp = $unique_name; // Store only filename
                    // Delete old image if it exists
                    if (!empty($old_img_path) && file_exists($uploadsDirServer . $old_img_path)) {
                        unlink($uploadsDirServer . $old_img_path);
                        error_log("Deleted old image: $uploadsDirServer$old_img_path");
                    }
                } else {
                    $error = "Sorry, there was an error uploading your file.";
                    error_log("File upload error: " . $_FILES['dp']['error']);
                }
            } else {
                $error = "Only JPG, JPEG, PNG & GIF files are allowed.";
            }
        }

        if (empty($error)) {
            $query = "UPDATE prisoner SET 
                      pris_name = ?,
                      pris_age = ?,
                      pris_gender = ?,
                      pris_case = ?,
                      pris_adm = ?,
                      pris_period = ?,
                      jailtype = ?,
                      jailname = ?,
                      pris_cell = ?,
                      checkup = ?,
                      blood = ?,
                      allergies = ?,
                      dp = ?
                      WHERE pris_id = ?";
            
            $stmt = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, 'sisssssssssssi', 
                $name, $age, $gender, $crime, $adm_date, $period,
                $jailtype, $jailname, $cellblock, $checkup, $blood, $allergies, $dp, $id);
            
            if (mysqli_stmt_execute($stmt)) {
                $_SESSION['success'] = "Prisoner Updated Successfully";
                header("Location: prisoners.php");
                exit();
            } else {
                $error = "Error updating record: " . mysqli_error($connection);
            }
            mysqli_stmt_close($stmt);
        }
    }
}

// Handle delete
if (isset($_GET['delete_id'])) {
    $id = intval($_GET['delete_id']);
    
    // Get the image path to delete it from server
    $query = "SELECT dp FROM prisoner WHERE pris_id = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $dp_data = mysqli_fetch_assoc($result);
    $dp_path = $dp_data['dp'];
    mysqli_stmt_close($stmt);
    
    // Delete the record
    $query = "DELETE FROM prisoner WHERE pris_id = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, 'i', $id);
    
    if (mysqli_stmt_execute($stmt)) {
        // Delete the image file if it exists
        if (!empty($dp_path) && file_exists($uploadsDirServer . $dp_path)) {
            unlink($uploadsDirServer . $dp_path);
            error_log("Deleted image: $uploadsDirServer$dp_path");
        }
        $_SESSION['success'] = "Prisoner deleted successfully!";
        header("Location: prisoners.php");
        exit();
    } else {
        $error = "Error deleting record: " . mysqli_error($connection);
    }
    mysqli_stmt_close($stmt);
}

// Handle AJAX request for fetching prisoner data
if (isset($_GET['action']) && $_GET['action'] === 'fetch_prisoner' && isset($_GET['id'])) {
    header('Content-Type: application/json');
    $id = mysqli_real_escape_string($connection, $_GET['id']);
    $stmt = mysqli_prepare($connection, "SELECT * FROM prisoner WHERE pris_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (!$result) {
        echo json_encode(['error' => 'Database error: ' . mysqli_error($connection)]);
        error_log("Database error for prisoner $id: " . mysqli_error($connection));
    } elseif (mysqli_num_rows($result) === 0) {
        echo json_encode(['error' => 'Prisoner not found']);
        error_log("Prisoner not found: $id");
    } else {
        $prisoner = mysqli_fetch_assoc($result);
        $filename = basename($prisoner['dp']);
        $imagePath = !empty($prisoner['dp']) && file_exists($uploadsDirServer . $filename)
            ? $baseUrl . $uploadsDir . rawurlencode($filename)
            : $baseUrl . $defaultImage;
        $prisoner['image_url'] = $imagePath;
        error_log("AJAX image URL for prisoner $id: $imagePath (dp: {$prisoner['dp']})");
        echo json_encode($prisoner);
    }
    mysqli_stmt_close($stmt);
    mysqli_close($connection);
    exit();
}

// Include other files
include('navbar.php');
include('sidebar.php');

// Check for success message in session
if (isset($_SESSION['success'])) {
    $success = $_SESSION['success'];
    unset($_SESSION['success']);
}

// Fetch prisoners
$query = "SELECT * FROM prisoner ORDER BY pris_id DESC";
$result = mysqli_query($connection, $query);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>JailMeet Officer</title>
    <link rel="apple-touch-icon" sizes="180x180" href="vendors/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="vendors/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="vendors/images/favicon-16x16.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="vendors/styles/core.css">
    <link rel="stylesheet" type="text/css" href="vendors/styles/icon-font.min.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/styles/style.css">
    <style>
        .main-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 90px 30px 30px 230px;
        }
        .table-responsive {
            overflow-x: auto;
        }
        .img-thumbnail {
            max-width: 100px;
            max-height: 100px;
        }
    </style>
</head>
<body>
<div class="main-container">
    <?php if (!empty($error)): ?>
        <div class="alert alert-danger alert-dismissible fade show">
            <?php echo htmlspecialchars($error); ?>
            <button type="button" class="close" data-dismiss="alert">×</button>
        </div>
    <?php endif; ?>
    
    <?php if (!empty($success)): ?>
        <div class="alert alert-success alert-dismissible fade show">
            <?php echo htmlspecialchars($success); ?>
            <button type="button" class="close" data-dismiss="alert">×</button>
        </div>
    <?php endif; ?>

    <div class="main-header d-flex justify-content-between align-items-center mb-4">
        <h2>Prisoner List</h2>
        <button class="btn btn-primary" data-toggle="modal" data-target="#addPrisonerModal">Add Prisoner</button>
    </div>

    <div class="table-responsive">
        <table id="prisonerTable" class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Profile Pic</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Crime</th>
                    <th>Admission Date</th>
                    <th>Period</th>
                    <th>Jail Type</th>
                    <th>Jail Name</th>
                    <th>Cell Block</th>
                    <th>Medical Checkup</th>
                    <th>Blood Type</th>
                    <th>Allergies</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (mysqli_num_rows($result) > 0): ?>
                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($row['pris_id']); ?></td>
                            <td>
                                <?php
                                $filename = basename($row['dp']);
                                $image_path = !empty($row['dp']) && file_exists($uploadsDirServer . $filename)
                                    ? $baseUrl . $uploadsDir . rawurlencode($filename)
                                    : $baseUrl . $defaultImage;
                                error_log("Table image path for prisoner {$row['pris_id']}: $image_path (dp: {$row['dp']})");
                                ?>
                                <img src="<?php echo $image_path; ?>" alt="Profile Pic" class="img-thumbnail" 
                                     onerror="console.error('Failed to load image: <?php echo $image_path; ?>'); this.src='<?php echo $baseUrl . $placeholderImage; ?>'; this.onerror=null;">
                            </td>
                            <td><?php echo htmlspecialchars($row['pris_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_age']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_gender']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_case']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_adm']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_period']); ?></td>
                            <td><?php echo htmlspecialchars($row['jailtype']); ?></td>
                            <td><?php echo htmlspecialchars($row['jailname']); ?></td>
                            <td><?php echo htmlspecialchars($row['pris_cell'] ?: 'Not assigned'); ?></td>
                            <td><?php echo htmlspecialchars($row['checkup'] ?: 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($row['blood'] ?: 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($row['allergies'] ?: 'None'); ?></td>
                            <td>
                                <button class="btn btn-warning edit-button" 
                                        data-id="<?php echo $row['pris_id']; ?>">
                                    Edit
                                </button>
                                <a href="prisoners.php?delete_id=<?php echo $row['pris_id']; ?>" 
                                   class="btn btn-danger" 
                                   onclick="return confirm('Are you sure you want to delete this prisoner?')">
                                    Delete
                                </a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="15" class="text-center">No prisoners found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Add Prisoner Modal -->
<div class="modal fade" id="addPrisonerModal" tabindex="-1" role="dialog" aria-labelledby="addPrisonerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addPrisonerModalLabel">Add Prisoner</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <form id="addPrisonerForm" action="prisoners.php" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    <div class="modal-error alert alert-danger" id="addModalError" style="display: none;"></div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="pris_name">Name *</label>
                                <input type="text" class="form-control" id="pris_name" name="pris_name" required>
                            </div>
                            <div class="form-group">
                                <label for="pris_age">Age *</label>
                                <input type="number" class="form-control" id="pris_age" name="pris_age" min="18" max="100" required>
                            </div>
                            <div class="form-group">
                                <label for="pris_gender">Gender *</label>
                                <select class="form-control" id="pris_gender" name="pris_gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="pris_case">Crime *</label>
                                <input type="text" class="form-control" id="pris_case" name="pris_case" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="pris_adm">Admission Date *</label>
                                <input type="date" class="form-control" id="pris_adm" name="pris_adm" required>
                            </div>
                            <div class="form-group">
                                <label for="pris_period">Prison Period *</label>
                                <input type="date" class="form-control" id="pris_period" name="pris_period" required>
                            </div>
                            <div class="form-group">
                                <label for="jailType">Jail Type *</label>
                                <select id="jailType" name="jailtype" class="form-control" onchange="updateJailNames()" required>
                                    <option value="">Select Jail Type</option>
                                    <option value="Central Jails">Central Jails</option>
                                    <option value="Sub Jails">Sub Jails</option>
                                    <option value="District Jails">District Jails</option>
                                    <option value="Special Sub Jails">Special Sub Jails</option>
                                    <option value="Women's Jails">Women's Jails</option>
                                    <option value="Open Jails">Open Jails</option>
                                    <option value="Other Jails">Other Jails</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="jailName">Jail Name *</label>
                                <select id="jailName" name="jailname" class="form-control" required>
                                    <option value="">Select Jail Name</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="pris_cell">Cell Block</label>
                                <input type="text" class="form-control" id="pris_cell" name="pris_cell">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="checkup">Medical Checkup</label>
                                <input type="date" class="form-control" id="checkup" name="checkup">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="blood">Blood Type</label>
                                <select class="form-control" id="blood" name="blood">
                                    <option value="">Select Blood Type</option>
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
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="allergies">Allergies</label>
                                <input type="text" class="form-control" id="allergies" name="allergies">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dp">Profile Picture</label>
                        <input type="file" class="form-control-file" id="dp" name="dp" accept="image/*">
                        <small class="form-text text-muted">Max file size: 5MB. Allowed types: JPG, JPEG, PNG, GIF</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" name="add_prisoner">Save Prisoner</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Prisoner Modal -->
<div class="modal fade" id="editPrisonerModal" tabindex="-1" role="dialog" aria-labelledby="editPrisonerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editPrisonerModalLabel">Edit Prisoner</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <form id="editPrisonerForm" action="prisoners.php" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    <div class="modal-error alert alert-danger" id="editModalError" style="display: none;"></div>
                    <input type="hidden" id="edit_pris_id" name="pris_id">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit_pris_name">Name *</label>
                                <input type="text" class="form-control" id="edit_pris_name" name="pris_name" required>
                            </div>
                            <div class="form-group">
                                <label for="edit_pris_age">Age *</label>
                                <input type="number" class="form-control" id="edit_pris_age" name="pris_age" min="18" max="100" required>
                            </div>
                            <div class="form-group">
                                <label for="edit_pris_gender">Gender *</label>
                                <select class="form-control" id="edit_pris_gender" name="pris_gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit_pris_case">Crime *</label>
                                <input type="text" class="form-control" id="edit_pris_case" name="pris_case" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit_pris_adm">Admission Date *</label>
                                <input type="date" class="form-control" id="edit_pris_adm" name="pris_adm" required>
                            </div>
                            <div class="form-group">
                                <label for="edit_pris_period">Prison Period *</label>
                                <input type="date" class="form-control" id="edit_pris_period" name="pris_period" required>
                            </div>
                            <div class="form-group">
                                <label for="edit_jailtype">Jail Type *</label>
                                <select id="edit_jailtype" name="jailtype" class="form-control" onchange="updateEditJailNames()" required>
                                    <option value="">Select Jail Type</option>
                                    <option value="Central Jails">Central Jails</option>
                                    <option value="Sub Jails">Sub Jails</option>
                                    <option value="District Jails">District Jails</option>
                                    <option value="Special Sub Jails">Special Sub Jails</option>
                                    <option value="Women's Jails">Women's Jails</option>
                                    <option value="Open Jails">Open Jails</option>
                                    <option value="Other Jails">Other Jails</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit_jailname">Jail Name *</label>
                                <select id="edit_jailname" name="jailname" class="form-control" required>
                                    <option value="">Select Jail Name</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="edit_pris_cell">Cell Block</label>
                                <input type="text" class="form-control" id="edit_pris_cell" name="pris_cell">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="edit_checkup">Medical Checkup</label>
                                <input type="date" class="form-control" id="edit_checkup" name="checkup">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="edit_blood">Blood Type</label>
                                <select class="form-control" id="edit_blood" name="blood">
                                    <option value="">Select Blood Type</option>
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
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="edit_allergies">Allergies</label>
                                <input type="text" class="form-control" id="edit_allergies" name="allergies">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit_dp">Profile Picture</label>
                        <input type="file" class="form-control-file" id="edit_dp" name="dp" accept="image/*">
                        <small class="form-text text-muted">Max file size: 5MB. Allowed types: JPG, JPEG, PNG, GIF</small>
                        <div id="current_image" class="mt-2">
                            <img src="<?php echo $baseUrl . $defaultImage; ?>" id="imagePreview" class="img-thumbnail" alt="Profile Picture">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" name="update_prisoner">Update Prisoner</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
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

function updateJailNames() {
    const jailType = document.getElementById("jailType").value;
    const jailNameSelect = document.getElementById("jailName");
    jailNameSelect.innerHTML = "<option value=''>Select Jail Name</option>";

    if (jailOptions[jailType]) {
        jailOptions[jailType].forEach(jail => {
            const option = document.createElement("option");
            option.value = jail;
            option.textContent = jail;
            jailNameSelect.appendChild(option);
        });
    }
}

function updateEditJailNames(currentJailName) {
    const jailType = document.getElementById("edit_jailtype").value;
    const jailNameSelect = document.getElementById("edit_jailname");
    
    jailNameSelect.innerHTML = "<option value=''>Select Jail Name</option>";

    if (jailOptions[jailType]) {
        jailOptions[jailType].forEach(jail => {
            const option = document.createElement("option");
            option.value = jail;
            option.textContent = jail;
            if (jail === currentJailName) {
                option.selected = true;
            }
            jailNameSelect.appendChild(option);
        });
    }
}

function validateImage(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Only JPG, PNG, and GIF images are allowed!');
            input.value = '';
            return false;
        }
        if (file.size > 5000000) { // 5MB
            alert('File is too large! Max size is 5MB.');
            input.value = '';
            return false;
        }
    }
    return true;
}
</script>

<!-- JavaScript -->
<script src="vendors/scripts/core.js"></script>
<script src="vendors/scripts/script.min.js"></script>
<script src="src/plugins/datatables/js/jquery.dataTables.min.js"></script>
<script src="src/plugins/datatables/js/dataTables.bootstrap4.min.js"></script>
<script>
$(document).ready(function() {
    // Initialize DataTable
    $('#prisonerTable').DataTable({
        responsive: true,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Add Prisoner Modal: Set initial min for pris_period and update on pris_adm change
    $('#pris_adm').on('change', function() {
        const admDate = $(this).val();
        if (admDate) {
            $('#pris_period').attr('min', admDate);
            // If pris_period is before admDate, clear it
            const periodDate = $('#pris_period').val();
            if (periodDate && periodDate < admDate) {
                $('#pris_period').val('');
            }
        } else {
            $('#pris_period').attr('min', today);
        }
    });

    // Set initial min for pris_period to today
    $('#pris_period').attr('min', today);

    // Edit Prisoner Modal: Set initial min for edit_pris_period and update on edit_pris_adm change
    $('#edit_pris_adm').on('change', function() {
        const admDate = $(this).val();
        if (admDate) {
            $('#edit_pris_period').attr('min', admDate);
            // If edit_pris_period is before admDate, clear it
            const periodDate = $('#edit_pris_period').val();
            if (periodDate && periodDate < admDate) {
                $('#edit_pris_period').val('');
            }
        } else {
            $('#edit_pris_period').attr('min', today);
        }
    });

    // Set initial min for edit_pris_period when modal opens
    $('#editPrisonerModal').on('show.bs.modal', function() {
        const admDate = $('#edit_pris_adm').val();
        $('#edit_pris_period').attr('min', admDate || today);
    });

    // Validate form submission for Add Prisoner Modal
    $('#addPrisonerForm').on('submit', function(e) {
        const admDate = $('#pris_adm').val();
        const periodDate = $('#pris_period').val();
        if (admDate && periodDate && periodDate < admDate) {
            e.preventDefault();
            $('#addModalError').text('Prison Period cannot be before Admission Date.').show();
            setTimeout(function() {
                $('#addModalError').fadeOut('slow');
            }, 5000);
            return false;
        }
    });

    // Validate form submission for Edit Prisoner Modal
    $('#editPrisonerForm').on('submit', function(e) {
        const admDate = $('#edit_pris_adm').val();
        const periodDate = $('#edit_pris_period').val();
        if (admDate && periodDate && periodDate < admDate) {
            e.preventDefault();
            $('#editModalError').text('Prison Period cannot be before Admission Date.').show();
            setTimeout(function() {
                $('#editModalError').fadeOut('slow');
            }, 5000);
            return false;
        }
    });

    // Handle edit button click
    $(document).on('click', '.edit-button', function() {
        const prisonerId = $(this).data('id');
        $('#editModalError').hide();
        
        $('#editPrisonerModal').modal('show');
        
        // Reset image to default
        $('#imagePreview').attr('src', '<?php echo $baseUrl . $defaultImage; ?>');
        
        $.ajax({
            url: `?action=fetch_prisoner&id=${prisonerId}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.error) {
                    $('#editModalError').text(data.error).show();
                    alert('Error: ' + data.error);
                    return;
                }
                
                // Log image URL for debugging
                console.log('Prisoner image URL:', data.image_url);
                
                // Populate form fields
                $('#edit_pris_id').val(data.pris_id || '');
                $('#edit_pris_name').val(data.pris_name || '');
                $('#edit_pris_age').val(data.pris_age || '');
                $('#edit_pris_gender').val(data.pris_gender || '');
                $('#edit_pris_case').val(data.pris_case || '');
                $('#edit_pris_adm').val(data.pris_adm || '');
                $('#edit_pris_period').val(data.pris_period || '');
                $('#edit_jailtype').val(data.jailtype || '');
                updateEditJailNames(data.jailname || '');
                $('#edit_pris_cell').val(data.pris_cell || '');
                $('#edit_checkup').val(data.checkup || '');
                $('#edit_blood').val(data.blood || '');
                $('#edit_allergies').val(data.allergies || '');
                
                // Update min attribute for edit_pris_period
                const admDate = data.pris_adm || today;
                $('#edit_pris_period').attr('min', admDate);
                
                // Set modal image with fallback
                const imageUrl = data.image_url || '<?php echo $baseUrl . $defaultImage; ?>';
                $('#imagePreview').attr('src', imageUrl).on('error', function() {
                    console.error('Failed to load modal image:', imageUrl);
                    this.src = '<?php echo $baseUrl . $placeholderImage; ?>';
                    this.onerror = null;
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX error:', textStatus, errorThrown);
                $('#editModalError').text('Failed to fetch prisoner data').show();
                alert('Failed to fetch prisoner data. Please try again.');
            }
        });
    });

    // Handle image preview for file input
    $('#edit_dp').on('change', function(event) {
        if (validateImage(this)) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#imagePreview').attr('src', e.target.result);
                    console.log('Preview image set to:', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});
</script>
</body>
</html>
<?php
// Close database connection
mysqli_close($connection);
// End output buffering
ob_end_flush();
?>
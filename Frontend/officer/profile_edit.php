<?php
session_start();
include('navbar.php');
include('sidebar.php');
include('db.php');

// Redirect if not logged in
if (!isset($_SESSION['id'])) {
    header("Location: officerlogin.php");
    exit();
}

// Get officer ID from session
$officerId = $_SESSION['id'];

// Initialize variables
$ofname = $ofemail = $ofphno = $ofpass = '';
$updateSuccess = false;
$updateError = '';

// Fetch officer details
if (!empty($officerId)) {
    $query = "SELECT ofname, ofemail, ofphno, ofpass FROM officer WHERE id = ?";
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, 's', $officerId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $ofname = $row['ofname'];
        $ofemail = $row['ofemail'];
        $ofphno = $row['ofphno'];
        $ofpass = $row['ofpass'];
    }
}

// Handle form submission for updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_btn'])) {
    $newName = $_POST['ofname'];
    $newEmail = $_POST['ofemail'];
    $newPhone = $_POST['ofphno'];

    if (!empty($_POST['newpass'])) {
        $newPassword = $_POST['newpass']; // No hashing
        $updateQuery = "UPDATE officer SET ofname=?, ofemail=?, ofpass=?, ofphno=? WHERE id=?";
        $stmt = mysqli_prepare($connection, $updateQuery);
        mysqli_stmt_bind_param($stmt, 'sssss', $newName, $newEmail, $newPassword, $newPhone, $officerId);
    } else {
        $updateQuery = "UPDATE officer SET ofname=?, ofemail=?, ofphno=? WHERE id=?";
        $stmt = mysqli_prepare($connection, $updateQuery);
        mysqli_stmt_bind_param($stmt, 'ssss', $newName, $newEmail, $newPhone, $officerId);
    }

    if (mysqli_stmt_execute($stmt)) {
        $updateSuccess = true;
        $ofname = $newName;
        $ofemail = $newEmail;
        $ofphno = $newPhone;
        if (!empty($_POST['newpass'])) {
            $ofpass = $newPassword;
        }
    } else {
        $updateError = "Error updating record: " . mysqli_error($connection);
    }
    mysqli_stmt_close($stmt);
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
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css">
    
    <style>
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            z-index: 5;
        }
        .password-input-group {
            position: relative;
        }
    </style>
</head>
<body style="padding-left: 250px; padding-top: 53px;">
    <div class="container mt-5">
        <h4>Officer Details</h4>

        <?php if ($updateSuccess): ?>
            <div class="alert alert-success">Profile updated successfully!</div>
        <?php elseif (!empty($updateError)): ?>
            <div class="alert alert-danger"><?php echo htmlspecialchars($updateError); ?></div>
        <?php endif; ?>

        <form method="POST" style="max-width: 600px;">
            <!-- Name -->
            <div class="form-group">
                <label for="ofname">Name</label>
                <input type="text" class="form-control" id="ofname" name="ofname" value="<?php echo htmlspecialchars($ofname); ?>" required>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="ofemail">Email</label>
                <input type="email" class="form-control" id="ofemail" name="ofemail" value="<?php echo htmlspecialchars($ofemail); ?>" required>
            </div>

            <!-- Current Password -->
            <div class="form-group password-input-group">
                <label for="currentPassword">Current Password</label>
                <input type="text" class="form-control" id="currentPassword" value="<?php echo htmlspecialchars($ofpass); ?>" readonly>
                <span class="password-toggle" onclick="togglePassword('currentPassword', 'currentPassIcon')">
                    <i id="currentPassIcon" class="bi bi-eye-slash"></i>
                </span>
            </div>

            <!-- New Password -->
            <div class="form-group password-input-group">
                <label for="newpass">New Password (leave blank to keep current)</label>
                <input type="text" class="form-control" id="newpass" name="newpass">
                <span class="password-toggle" onclick="togglePassword('newpass', 'newPassIcon')">
                    <i id="newPassIcon" class="bi bi-eye-slash"></i>
                </span>
            </div>

            <!-- Phone Number -->
            <div class="form-group">
                <label for="ofphno">Phone Number</label>
                <input type="text" class="form-control" id="ofphno" name="ofphno" value="<?php echo htmlspecialchars($ofphno); ?>" required>
            </div>

            <button type="submit" name="update_btn" class="btn btn-primary">Update Profile</button>
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
        function togglePassword(fieldId, iconId) {
            const field = document.getElementById(fieldId);
            const icon = document.getElementById(iconId);
            if (field.type === "text") {
                field.type = "password";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            } else {
                field.type = "text";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            }
        }
        
        // Initialize all password fields as visible
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('currentPassword').type = 'text';
            document.getElementById('newpass').type = 'text';
        });
    </script>

    <!-- Initialize DataTable -->
    <script>
        $(document).ready(function() {
            $('#prisonerTable').DataTable();
        });
    </script>
</body>
</html>
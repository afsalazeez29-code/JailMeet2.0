<?php
session_start(); // Start the session

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Handle form submission
if (isset($_POST['visitor_btn'])) {
    $name = mysqli_real_escape_string($connection, $_POST['username']);
    $email = mysqli_real_escape_string($connection, $_POST['useremail']);
    $password = mysqli_real_escape_string($connection, $_POST['userpass']); // No hashing here

    // Insert the new admin into the database
    $query = "INSERT INTO admin (ad_name, ad_email, ad_password) VALUES ('$name', '$email', '$password')";
    if (mysqli_query($connection, $query)) {
        $_SESSION['message'] = "Admin added successfully!";
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit(); // Prevents further script execution
    } else {
        $_SESSION['message'] = "Error: " . mysqli_error($connection);
    }
}
if (isset($_POST['update_btn'])) {
    $id = mysqli_real_escape_string($connection, $_POST['admin_id']); // Make sure this matches your hidden input's name
    $name = mysqli_real_escape_string($connection, $_POST['edit_username']);
    $email = mysqli_real_escape_string($connection, $_POST['edit_useremail']);
    $password = mysqli_real_escape_string($connection, $_POST['edit_userpass']);

    // Update the admin in the database
    $query = "UPDATE admin SET ad_name='$name', ad_email='$email', ad_password='$password' WHERE ad_id='$id'";
    if (mysqli_query($connection, $query)) {
        $_SESSION['message'] = "Admin updated successfully!";
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $_SESSION['message'] = "Error updating admin: " . mysqli_error($connection);
    }
}
// Handle form submission for adding admin
if (isset($_POST['visitor_btn'])) {
    $name = mysqli_real_escape_string($connection, $_POST['username']);
    $email = mysqli_real_escape_string($connection, $_POST['useremail']);
    $password = mysqli_real_escape_string($connection, $_POST['userpass']); // No hashing here

    // Insert the new admin into the database
    $query = "INSERT INTO admin (ad_name, ad_email, ad_password) VALUES ('$name', '$email', '$password')";
    if (mysqli_query($connection, $query)) {
        $_SESSION['message'] = "Admin added successfully!";
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $_SESSION['message'] = "Error: " . mysqli_error($connection);
    }
}

// Fetch admin details
$query = "SELECT ad_id, ad_name, ad_email, ad_password FROM admin";
$result = mysqli_query($connection, $query);

if (!$result) {
    die("Query failed: " . mysqli_error($connection));
}

// Include navigation and sidebar AFTER the logic
include('includes/navbar.php');
include('includes/sidebar.php');
?>



<body>
    
<div class="container mt-10">
    <h2 class="mb-4">Admin Details</h2>
    <!-- Show success or error message -->
    <?php if (isset($_SESSION['message'])): ?>
        <div class="alert alert-info">
            <?= $_SESSION['message']; ?>
            <?php unset($_SESSION['message']); ?>
        </div>
    <?php endif; ?>
    
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addadminModal">Add Admin</button>
    
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Action</th> <!-- New Action column -->
            </tr>
        </thead>
        <tbody>
    <?php while ($row = mysqli_fetch_assoc($result)) { ?>
        <tr>
            <td><?php echo htmlspecialchars($row['ad_name']); ?></td>
            <td><?php echo htmlspecialchars($row['ad_email']); ?></td>
            <td><?php echo htmlspecialchars($row['ad_password']); ?></td>
            <td>
                <button class="btn btn-warning btn-sm" 
                        onclick="editAdmin('<?php echo htmlspecialchars($row['ad_name']); ?>', 
                                           '<?php echo htmlspecialchars($row['ad_email']); ?>', 
                                           '<?php echo htmlspecialchars($row['ad_password']); ?>', 
                                           '<?php echo $row['ad_id']; ?>')" 
                        data-toggle="modal" data-target="#editAdminModal">Edit</button>
                <button class="btn btn-danger btn-sm" 
                        onclick="deleteAdmin(<?php echo $row['ad_id']; ?>)">Delete</button>
            </td>
        </tr>
    <?php } ?>
</tbody>
    </table>
</div>

<!-- Modal for adding admin -->
<div class="modal fade" id="addadminModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Admin</h5>
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <form method="POST">
                <div class="modal-body">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="useremail" class="form-control" required>
                    </div>
                    <div class="input-group">
                    <label>Password: </label>
                        <input type="password" name="userpass" class="form-control" id="passwordField" required>
                        <div class="input-group-append">
                            <span class="input-group-text" onclick="togglePassword()" style="cursor: pointer;">
                                <i class="fa fa-eye" id="eyeIcon"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" name="visitor_btn" class="btn btn-success">Add Admin</button>
                </div>
            </form>
        </div>
    </div>
</div>


<!-- Modal for editing admin -->
<div class="modal fade" id="editAdminModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Admin</h5>
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <form method="POST" id="editForm">
                <div class="modal-body">
                    <input type="hidden" name="admin_id" id="admin_id">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="edit_username" id="edit_username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="edit_useremail" id="edit_useremail" class="form-control" required>
                    </div>
                    <div class="input-group">
                        <input type="password" name="edit_userpass" id="edit_userpass" class="form-control" required>
                        <div class="input-group-append">
                            <span class="input-group-text" onclick="togglePassword('edit_userpass', this)" style="cursor: pointer;">
                                <i class="fa fa-eye" id="eyeIconEdit"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" name="update_btn" class="btn btn-success">Update Admin</button>
                </div>
            </form>
        </div>
    </div>
</div>




</style>
<!-- Bootstrap and Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

<script>
    $(document).ready(function () {
        $('.btn-primary').click(function () {
            $('#addadminModal').modal('show');
        });
    });
</script>
<script>
function editAdmin(name, email, password, id) {
    document.getElementById('edit_username').value = name;
    document.getElementById('edit_useremail').value = email;
    document.getElementById('edit_userpass').value = password;
    document.getElementById('admin_id').value = id; // Set the hidden field value for admin_id
}

function deleteAdmin(id) {
    if (confirm("Are you sure you want to delete this admin?")) {
        window.location.href = 'delete_admin.php?id=' + id; // Adjust if you have a different URL or method
    }
}

</script>

<script>
function togglePassword(inputId, icon) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.innerHTML = '<i class="fa fa-eye-slash"></i>'; // Change to eye slash
    } else {
        input.type = "password";
        icon.innerHTML = '<i class="fa fa-eye"></i>'; // Change back to eye
    }
}
</script>
<!-- Core JS Files -->
<script src="assets1/js/core/jquery-3.7.1.min.js"></script>
<script src="assets1/js/core/popper.min.js"></script>
<script src="assets1/js/core/bootstrap.min.js"></script>

<!-- jQuery Scrollbar -->
<script src="assets1/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>

<!-- Chart JS -->
<script src="assets1/js/plugin/chart.js/chart.min.js"></script>

<!-- jQuery Sparkline -->
<script src="assets1/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>

<!-- Chart Circle -->
<script src="assets1/js/plugin/chart-circle/circles.min.js"></script>

<!-- Datatables -->
<script src="assets1/js/plugin/datatables/datatables.min.js"></script>

<!-- jQuery Vector Maps -->
<script src="assets1/js/plugin/jsvectormap/jsvectormap.min.js"></script>
<script src="assets1/js/plugin/jsvectormap/world.js"></script>

<!-- Sweet Alert -->
<script src="assets1/js/plugin/sweetalert/sweetalert.min.js"></script>

<!-- Kaiadmin JS -->
<script src="assets1/js/kaiadmin.min.js"></script>

<!-- Kaiadmin DEMO methods, don't include it in your project! -->
<script src="assets1/js/setting-demo.js"></script>
<script src="assets1/js/demo.js"></script>
<script>
    $("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#177dff",
        fillColor: "rgba(23, 125, 255, 0.14)",
    });

    $("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#f3545d",
        fillColor: "rgba(243, 84, 93, .14)",
    });

    $("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
        type: "line",
        height: "70",
        width: "100%",
        lineWidth: "2",
        lineColor: "#ffa534",
        fillColor: "rgba(255, 165, 52, .14)",
    });
</script>
</body>
</html>
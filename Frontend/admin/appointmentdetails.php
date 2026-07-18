<?php
session_start();

// Database connection
$connection = mysqli_connect("localhost", "root", "", "jailmeet");
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}
include('includes/navbar.php');
include('includes/sidebar.php');
// Check if the ID is passed in the URL
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Validate and convert the ID to an integer
    // Fetch appointment details
    $appointmentQuery = "SELECT * FROM appointments WHERE id = $id";
    $appointmentResult = mysqli_query($connection, $appointmentQuery);

    if ($appointmentResult && mysqli_num_rows($appointmentResult) > 0) {
        $appointment = mysqli_fetch_assoc($appointmentResult);
    } else {
        die("No appointment found.");
    }
} else {
    die("Invalid request.");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>JailMeet Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <link rel="icon" href="assets1/img/kaiadmin/favicon.ico" type="image/x-icon">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">

    <script src="assets1/js/plugin/webfont/webfont.min.js"></script>
    <script>
        WebFont.load({
            google: { families: ["Public Sans:300,400,500,600,700"] },
            custom: {
                families: [
                    "Font Awesome 5 Solid",
                    "Font Awesome 5 Regular",
                    "Font Awesome 5 Brands",
                    "simple-line-icons"
                ],
                urls: ["assets1/css/fonts.min.css"]
            },
            active: function () {
                sessionStorage.fonts = true;
            }
        });
    </script>

    <link rel="stylesheet" href="assets1/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets1/css/plugins.min.css">
    <link rel="stylesheet" href="assets1/css/kaiadmin.min.css">
    <link rel="stylesheet" href="assets1/css/demo.css">

    
</head>
<body>
    lsadnc;kjaw;jcvb;iajnv
    oeknvoksnoknoknmevr
    lknovkjnwojkvn


<div class="container mt-5">
    <h2>Appointment Details</h2>
    <form>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" value="<?= htmlspecialchars($appointment['name']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="prisid">Prison ID</label>
            <input type="text" class="form-control" id="prisid" value="<?= htmlspecialchars($appointment['prisid']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" value="<?= htmlspecialchars($appointment['email']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="phno">Phone Number</label>
            <input type="text" class="form-control" id="phno" value="<?= htmlspecialchars($appointment['phno']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="message">Message</label>
            <textarea class="form-control" id="message" rows="3" readonly><?= htmlspecialchars($appointment['message']) ?></textarea>
        </div>

        <div class="form-group">
            <label for="relation">Relation</label>
            <input type="text" class="form-control" id="relation" value="<?= htmlspecialchars($appointment['relation']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="jtype">Jail Type</label>
            <input type="text" class="form-control" id="jtype" value="<?= htmlspecialchars($appointment['jtype']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="jname">Jail Name</label>
            <input type="text" class="form-control" id="jname" value="<?= htmlspecialchars($appointment['jname']) ?>" readonly>
        </div>

        <div class="form-group">
            <label for="date">Date</label>
            <input type="text" class="form-control" id="date" value="<?= htmlspecialchars($appointment['date']) ?>" readonly>
        </div>
        
        <a href="appointments.php" class="btn btn-secondary">Back to Appointments</a>
    </form>
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
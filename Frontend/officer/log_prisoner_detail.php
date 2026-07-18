<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $pris_id = $_POST['pris_id'] ?? '';
    $crime_type = $_POST['crime_type'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!empty($pris_id) && !empty($message)) {
        $update = "UPDATE prisoner SET fir = ? WHERE pris_id = ?";
        $stmt = mysqli_prepare($connection, $update);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, 'ss', $message, $pris_id);
            if (mysqli_stmt_execute($stmt)) {
                echo "<script>alert('Report submitted successfully!'); window.location.href='fir.php';</script>";
            } else {
                echo "Error while submitting report: " . mysqli_stmt_error($stmt);
            }
            mysqli_stmt_close($stmt);
        } else {
            echo "Error in query: " . mysqli_error($connection);
        }
    } else {
        echo "<script>alert('Please fill all fields.'); history.back();</script>";
    }
}
?>

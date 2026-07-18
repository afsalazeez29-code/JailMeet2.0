<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pris_id = $_POST['pris_id'] ?? '';
    $parole_msg = $_POST['message'] ?? '';
    $parole_from = $_POST['parole_from'] ?? null;
    $parole_to = $_POST['parole_to'] ?? null;

    // Validate prisoner ID
    if (!empty($pris_id)) {
        // Prepare the update query WITHOUT updating `fir`
        $updateQuery = "UPDATE prisoner SET parole_msg = ?, parole_from = ?, parole_to = ? WHERE pris_id = ?";

        $stmt = mysqli_prepare($connection, $updateQuery);
        mysqli_stmt_bind_param($stmt, 'ssss', $parole_msg, $parole_from, $parole_to, $pris_id);

        if (mysqli_stmt_execute($stmt)) {
            echo "<script>alert('Parole details saved successfully!'); window.location.href='parole.php';</script>";
        } else {
            echo "Error: " . mysqli_error($connection);
        }

        mysqli_stmt_close($stmt);
    } else {
        echo "<script>alert('Prisoner ID is required.'); window.location.href='parole.php';</script>";
    }
}
?>

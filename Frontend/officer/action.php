<?php
include('db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appid = $_POST['appid']; // ✅ Get the appid from the form

    if (isset($_POST['accept_btn'])) {
        $appid = (int)$_POST['appid'];
        $sql = "UPDATE appointments SET accept='Accepted', reply='' WHERE id=$appid";
    
        $result = mysqli_query($connection, $sql);
    
        if ($result) {
            echo "<script>alert('Appointment Accepted'); window.location.href='all.php';</script>";
        } else {
            echo "Error: " . mysqli_error($connection);
        }
        exit();

    } elseif (isset($_POST['reject_btn'])) {
        $reply = $_POST['reply_msg'];
        $query = "UPDATE appointments SET reply=?, accept='Rejected' WHERE id=?";
        $stmt = mysqli_prepare($connection, $query);
        mysqli_stmt_bind_param($stmt, "si", $reply, $appid);
        mysqli_stmt_execute($stmt);
        echo "<script>alert('Appointment Rejected'); window.location.href='all.php';</script>";
        exit();
    }
}
?>
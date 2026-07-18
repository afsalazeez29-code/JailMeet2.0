<?php
session_start(); // Start session at the top
include('includes/header.php');
include('db.php'); // Ensure this file correctly initializes $connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['email']) && !empty($_POST['password'])) {
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);

        // Ensure connection is established
        if (!$connection) {
            die("Database connection failed: " . mysqli_connect_error());
        }

        // Check if email exists in the database
        $query = "SELECT ad_id, ad_email, ad_password FROM admin WHERE ad_email = ?";
        $stmt = mysqli_prepare($connection, $query);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($row = mysqli_fetch_assoc($result)) {
                $stored_password = $row['ad_password']; // Ensure column names match DB
                
                // Check if password has been hashed
                if (strlen($stored_password) == 60) { // Password hash length for default options in bcrypt
                    // Verify hashed password
                    if (password_verify($password, $stored_password)) {
                        // Store admin ID in session
                        $_SESSION['ad_id'] = $row['ad_id']; 
                        $_SESSION['ad_email'] = $row['ad_email'];

                        // Fetch admin name from the database using the admin ID
                        $admin_id = $_SESSION['ad_id'];
                        $name_query = "SELECT ad_name FROM admin WHERE ad_id = ?";
                        $name_stmt = mysqli_prepare($connection, $name_query);

                        if ($name_stmt) {
                            mysqli_stmt_bind_param($name_stmt, "i", $admin_id);
                            mysqli_stmt_execute($name_stmt);
                            $name_result = mysqli_stmt_get_result($name_stmt);

                            if ($name_row = mysqli_fetch_assoc($name_result)) {
                                $_SESSION['ad_name'] = $name_row['ad_name'];  // Store admin name in session
                            }

                            mysqli_stmt_close($name_stmt);
                        }

                        header("Location: adindex.php"); // Redirect to admin dashboard
                        exit();
                    } else {
                        echo "<script>alert('Incorrect password!'); window.location.href='adminlogin.php';</script>";
                    }
                } else {
                    // Assuming plain text for legacy users
                    if ($password === $stored_password) {
                        // Upgrade user's password by hashing it if it's a known plain text password
                        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                        // Update the password in the database
                        $update_query = "UPDATE admin SET ad_password = ? WHERE ad_email = ?";
                        $update_stmt = mysqli_prepare($connection, $update_query);
                        mysqli_stmt_bind_param($update_stmt, "ss", $hashed_password, $email);
                        mysqli_stmt_execute($update_stmt);
                        
                        // Set session variables
                        $_SESSION['ad_id'] = $row['ad_id'];
                        $_SESSION['ad_email'] = $row['ad_email'];

                        // Fetch admin name from the database using the admin ID
                        $admin_id = $_SESSION['ad_id'];
                        $name_query = "SELECT ad_name FROM admin WHERE ad_id = ?";
                        $name_stmt = mysqli_prepare($connection, $name_query);

                        if ($name_stmt) {
                            mysqli_stmt_bind_param($name_stmt, "i", $admin_id);
                            mysqli_stmt_execute($name_stmt);
                            $name_result = mysqli_stmt_get_result($name_stmt);

                            if ($name_row = mysqli_fetch_assoc($name_result)) {
                                $_SESSION['ad_name'] = $name_row['ad_name'];  // Store admin name in session
                            }

                            mysqli_stmt_close($name_stmt);
                        }

                        header("Location: adindex.php"); // Redirect to admin dashboard
                        exit();
                    } else {
                        echo "<script>alert('Incorrect password!'); window.location.href='adminlogin.php';</script>";
                    }
                }
            } else {
                echo "<script>alert('No admin found with this email!'); window.location.href='adminlogin.php';</script>";
            }
            mysqli_stmt_close($stmt);
        } else {
            echo "<script>alert('Database error: " . mysqli_error($connection) . "');</script>";
        }
    } else {
        echo "<script>alert('Please fill in both fields!'); window.location.href='adminlogin.php';</script>";
    }
}
?>

<main class="main">

<!-- Hero Section -->
<section id="hero" class="hero section dark-background">

    <img src="../prison1.jpg" alt="" data-aos="fade-in">

    <div class="container d-flex flex-column align-items-center">
        <h2 data-aos="fade-up" data-aos-delay="100">Admin Login</h2>
        
        <div class="login-box">
        
        <?php if (isset($error)): ?>
            <p class="error"><?= $error ?></p>
        <?php endif; ?>
        <form method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="adlogin">Login</button>
        </form>
        </div>
    </div>

</section><!-- /Hero Section -->

<footer id="footer" class="footer dark-background">
    <div class="container footer-top">
        <div class="row gy-4">
            <div class="col-lg-4 col-md-6 footer-about">
                <a href="index.html" class="logo d-flex align-items-center">
                    <span class="sitename">Dewi</span>
                </a>
                <div class="footer-contact pt-3">
                    <p>A108 Adam Street</p>
                    <p>New York, NY 535022</p>
                    <p class="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
                    <p><strong>Email:</strong> <span>info@example.com</span></p>
                </div>
                <div class="social-links d-flex mt-4">
                    <a href=""><i class="bi bi-twitter-x"></i></a>
                    <a href=""><i class="bi bi-facebook"></i></a>
                    <a href=""><i class="bi bi-instagram"></i></a>
                    <a href=""><i class="bi bi-linkedin"></i></a>
                </div>
            </div>
            
            <div class="col-lg-2 col-md-3 footer-links">
                <h4>Useful Links</h4>
                <ul>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Home</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">About us</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Services</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Terms of service</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Privacy policy</a></li>
                </ul>
            </div>

            <div class="col-lg-2 col-md-3 footer-links">
                <h4>Our Services</h4>
                <ul>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Web Design</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Web Development</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Product Management</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Marketing</a></li>
                    <li><i class="bi bi-chevron-right"></i> <a href="#">Graphic Design</a></li>
                </ul>
            </div>

            <div class="col-lg-4 col-md-12 footer-newsletter">
                <h4>Our Newsletter</h4>
                <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                <form action="forms/newsletter.php" method="post" class="php-email-form">
                    <div class="newsletter-form"><input type="email" name="email"><input type="submit" value="Subscribe"></div>
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">Your subscription request has been sent. Thank you!</div>
                </form>
            </div>
        </div>
    </div>

    <div class="container copyright text-center mt-4">
        <p>© <span>Copyright</span>  <span>All Rights Reserved</span></p>
        <div class="credits">
            Designed by <a href="index.php">JailMeet</a> 
        </div>
    </div>
</footer>

<!-- Scroll Top -->
<a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

<!-- Preloader -->
<div id="preloader"></div>

<!-- Vendor JS Files -->
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/php-email-form/validate.js"></script>
<script src="assets/vendor/aos/aos.js"></script>
<script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
<script src="assets/vendor/purecounter/purecounter_vanilla.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script src="assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
<script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>

<!-- Main JS File -->
<script src="assets/js/main.js"></script>

</body>
</html>
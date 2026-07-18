<?php
include('db.php');
include('includes/header.php');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register_btn'])) {
    // Retrieve and sanitize input
    $username = $connection->real_escape_string($_POST['username']);
    $email = $connection->real_escape_string($_POST['email']);
    $phone = $connection->real_escape_string($_POST['phone']);
    $password = $connection->real_escape_string($_POST['password']);
    $state = $connection->real_escape_string($_POST['district']);

    // Validate phone number (only numbers and exactly 10 digits)
    if (!preg_match("/^[0-9]{10}$/", $phone)) {
        echo "<script>alert('Invalid phone number! Enter exactly 10 digits.');</script>";
    } else {
        // Check if email already exists
        $check_query = "SELECT * FROM visitors WHERE vemail = '$email'";
        $check_result = $connection->query($check_query);

        if ($check_result->num_rows > 0) {
            echo "<script>alert('Email already registered! Please use a different email.');</script>";
        } else {
            // Insert query with empty string for vadd instead of NULL
            $query = "INSERT INTO visitors (vname, vemail, vphno, vpass, vstate, vadd, vzip, profile_pic) 
                      VALUES ('$username', '$email', '$phone', '$password', '$state', '', '', '')";

            if ($connection->query($query) === TRUE) {
                echo "<script>
                    document.addEventListener('DOMContentLoaded', function() {
                        let popup = document.getElementById('successPopup');
                        popup.style.display = 'block';
                        setTimeout(function() {
                            popup.style.opacity = '0';
                            setTimeout(function() { window.location.href = 'login.php'; }, 1000);
                        }, 3000);
                    });
                </script>";
            } else {
                die("Error: " . $connection->error);
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | JailMeet</title>
    <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css">

    <style>
        /* Remove underline from header links */
        header a, 
        .navbar a {
            text-decoration: none !important;
            color: inherit; /* Maintain default text color */
        }

        header a:hover, 
        .navbar a:hover {
            text-decoration: none !important;
        }

        /* Success Popup Styling */
        .success-popup {
            position: fixed;
            top: 6%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            opacity: 1;
            transition: opacity 1s ease-in-out;
            z-index: 1000;
        }
    </style>
</head>
<body>

<!-- Success Popup (Initially Hidden) -->
<div id="successPopup" class="success-popup" style="display: none;">
    Registration Successful! Redirecting to Login Page ...
</div>
  <main class="main">

<!-- Hero Section -->
<section id="hero" class="hero section dark-background">

  <img src="../prison1.jpg" alt="" data-aos="fade-in">

  <div class="container d-flex flex-column align-items-center">
    <h2 data-aos="fade-up" data-aos-delay="100">Register for an Account</h2>
    <p data-aos="fade-up" data-aos-delay="200">"Book appointments easily to visit and stay connected with your loved ones in prison."</p>

    <div class="register-form mt-4" data-aos="fade-up" data-aos-delay="300">
      <form action="register.php" method="POST">
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
          <input type="text" name="username" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
                        <label for="phone" class="form-label">Phone Number:</label>
                        <input type="tel" name="phone" id="phone" class="form-control" 
                               pattern="[0-9]{10}" maxlength="10" required 
                               title="Enter a valid 10-digit phone number"
                               oninput="validatePhoneNumber(this)">
                        <small id="phoneError" style="color: red; display: none;">Only 10 digits allowed!</small>
                    </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input type="password" name="password" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="district" class="form-label">District (Kerala):</label>
          <select name="district" class="form-control" required>
            <option value="">Select District</option>
            <option value="Alappuzha">Alappuzha</option>
            <option value="Ernakulam">Ernakulam</option>
            <option value="Idukki">Idukki</option>
            <option value="Kannur">Kannur</option>
            <option value="Kasaragod">Kasaragod</option>
            <option value="Kollam">Kollam</option>
            <option value="Kottayam">Kottayam</option>
            <option value="Kozhikode">Kozhikode</option>
            <option value="Malappuram">Malappuram</option>
            <option value="Palakkad">Palakkad</option>
            <option value="Pathanamthitta">Pathanamthitta</option>
            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Wayanad">Wayanad</option>
          </select>
        </div>
        <button type="submit" name="register_btn" class="btn btn-primary w-100">Register</button>
      </form>
      <p class="mt-3">Already have an account? <a href="login.php">Login</a></p>
    </div>
  </div>

</section>

<!-- /Hero Section -->


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
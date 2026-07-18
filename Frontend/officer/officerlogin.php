<?php
session_start();
include('db.php'); // DB connection file
include('includes/header.php');

$error = "";

if (isset($_POST['login_btn'])) {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $connection->prepare("SELECT id, ofname, ofemail, ofpass FROM officer WHERE ofemail = ?");
    if (!$stmt) {
        die("Prepare failed: " . $connection->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $name, $db_email, $db_password);
        $stmt->fetch();

        if ($password === $db_password) { // Plain text comparison
            // Set session variables
            $_SESSION['id'] = $id;
            $_SESSION['ofname'] = $name;
            $_SESSION['ofemail'] = $db_email;

            header("Location: index.php"); // Redirect to officer's dashboard
            exit();
        } else {
            $error = "Invalid password.";
        }
    } else {
        $error = "No officer found with this email.";
    }

    $stmt->close();
    $connection->close();
}
?>



<main class="main">
  <section id="hero" class="hero section dark-background">
    <img src="../prison1.jpg" alt="" data-aos="fade-in">
    <div class="container d-flex flex-column align-items-center">
      <h2 data-aos="fade-up" data-aos-delay="100">Officer Login</h2>
      <div class="login-form mt-4" data-aos="fade-up" data-aos-delay="300">
    <?php if (isset($error)): ?>
        <div class=""><?php echo $error; ?></div>
    <?php endif; ?>
    <form action="officerlogin.php" method="POST">
          <div class="mb-3">
            <label for="email" class="form-label">Officer Email:</label>
            <input type="email" name="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <button type="submit" name="login_btn" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </section>
 
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
<?php
session_start();
include('db.php'); // Database connection file

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login_btn'])) {
    $prisoner_id = $_POST['email'];
    $incarceration_date = $_POST['incarceration_date'];

    $stmt = $conn->prepare("SELECT pris_id, pris_name FROM prisoner WHERE pris_id = ? AND pris_adm = ?");
    $stmt->bind_param("ss", $prisoner_id, $incarceration_date);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Fetch prisoner details
        $stmt->bind_result($pris_id, $pris_name);
        $stmt->fetch();

        // Set session variables
        $_SESSION['pris_id'] = $pris_id;
        $_SESSION['pris_name'] = $pris_name;

        // Redirect to profile page or another page
        header("Location: index.php");
        exit();
    } else {
        $login_error = "Invalid Prisoner ID or Date of Incarceration";
    }

    $stmt->close();
    $conn->close();
}
include('includes/header.php');
?>

  <main class="main">

<!-- Hero Section -->
<section id="hero" class="hero section dark-background">

  <img src="../prison1.jpg" alt="" data-aos="fade-in">

  <div class="container d-flex flex-column align-items-center">
    <h2 data-aos="fade-up" data-aos-delay="100">Prisoner Login</h2>
    
    <?php if (isset($login_error)): ?>
    <div class="alert alert-danger" role="alert" data-aos="fade-up">
      <?php echo $login_error; ?>
    </div>
    <?php endif; ?>

    <div class="login-form mt-4" data-aos="fade-up" data-aos-delay="300">
      <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
        <div class="mb-3">
          <label for="email" class="form-label">Prisoner ID:</label>
          <input type="text" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="incarceration_date" class="form-label">Date of Incarceration:</label>
          <input type="date" name="incarceration_date" id="incarceration_date" class="form-control" required>
        </div>
        <button type="submit" name="login_btn" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>

</section>
<!-- /Hero Section -->



  <!-- Scroll Top -->
  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Preloader -->
  <div id="preloader"></div>

  <!-- Vendor JS Files -->
  <script src="assets1/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets1/vendor/php-email-form/validate.js"></script>
  <script src="assets1/vendor/aos/aos.js"></script>
  <script src="assets1/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="assets1/vendor/purecounter/purecounter_vanilla.js"></script>
  <script src="assets1/vendor/swiper/swiper-bundle.min.js"></script>
  <script src="assets1/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
  <script src="assets1/vendor/isotope-layout/isotope.pkgd.min.js"></script>

  <!-- Main JS File -->
  <script src="assets1/js/main.js"></script>

</body>

</html>
<?php
session_start();
include('db.php');
include('navbar.php');
include('sidebar.php');

// Fetch all prisoners for the dropdown
$prisoners_query = "SELECT pris_id, pris_name FROM prisoner ORDER BY pris_name";
$prisoners_result = mysqli_query($connection, $prisoners_query);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!$connection) {
        die("Database connection failed: " . mysqli_connect_error());
    }

    $visitorid = $_SESSION['visitor_id'];
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $prisid = mysqli_real_escape_string($connection, $_POST['prisid']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    $phno = mysqli_real_escape_string($connection, $_POST['phno']);
    $message = mysqli_real_escape_string($connection, $_POST['message']);
    $relation = mysqli_real_escape_string($connection, $_POST['relation']);
    $jtype = mysqli_real_escape_string($connection, $_POST['jtype']);
    $jname = mysqli_real_escape_string($connection, $_POST['jname']);
    $date = mysqli_real_escape_string($connection, $_POST['date']);
    
    $query = "INSERT INTO appointments (name, prisid, email, phno, message, relation, jtype, jname, date, visitor_id, accept, reply, visit_status)
      VALUES ('$name', '$prisid', '$email', '$phno', '$message', '$relation', '$jtype', '$jname', '$date', '$visitorid', 'Pending', 'No reply yet', 'Pending')";

    if (mysqli_query($connection, $query)) {
        echo "<script>alert('Appointment booked successfully!'); window.location.href='booking.php';</script>";
    } else {
        die("Error: " . mysqli_error($connection));
    }

    mysqli_close($connection);
}

if (!isset($_SESSION['visitor_id'])) {
    header("Location: /Project/JailMeet/visitor/login.php");
    exit();
}

// Fetch visitor details from the database
$visitor_id = $_SESSION['visitor_id'];

// Get today's date for the min attribute
$today = date('Y-m-d');
?>

<!DOCTYPE html>
<html lang="en" class="light-style layout-menu-fixed" dir="ltr" data-theme="theme-default" data-assets-path="../assets/" data-template="vertical-menu-template-free">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <title>JailMeet Visitor</title>
    <meta name="description" content="" />
    <link rel="icon" type="image/x-icon" href="../assets/img/favicon/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/vendor/fonts/boxicons.css" />
    <link rel="stylesheet" href="../assets/vendor/css/core.css" class="template-customizer-core-css" />
    <link rel="stylesheet" href="../assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
    <link rel="stylesheet" href="../assets/css/demo.css" />
    <link rel="stylesheet" href="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <script src="../assets/vendor/js/helpers.js"></script>
    <script src="../assets/js/config.js"></script>
</head>

<body>
<div class="layout-wrapper layout-content-navbar">
  <div class="layout-container">
    <div class="layout-page">
      <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
          <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Book Your Appointment</span></h4>
          
          <div class="row">
            <div class="col-xxl">
              <div class="card mb-4">
                <div class="card-header d-flex align-items-center justify-content-between">
                  <div class="form-group mb-0">
                    <label for="visitor_id" class="form-label mb-0">Your Visitor ID:</label>
                    <input type="text" class="form-control-plaintext" id="visitor_id" name="visitor_id" 
                          value="<?php echo htmlspecialchars($visitor_id); ?>" readonly>
                  </div>
                  <h5 class="mb-0">Fill the Below Form</h5>
                </div>
                
                <div class="card-body">
                  <form action="booking.php" method="POST">
                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Name</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" name="name" required />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Prisoner</label>
                      <div class="col-sm-10">
                        <select class="form-control" name="prisid" required>
                          <option value="">Select Prisoner</option>
                          <?php 
                          // Reset pointer and loop through prisoners again
                          mysqli_data_seek($prisoners_result, 0);
                          while ($prisoner = mysqli_fetch_assoc($prisoners_result)): ?>
                            <option value="<?php echo $prisoner['pris_id']; ?>">
                              <?php echo htmlspecialchars($prisoner['pris_name']) . " (ID: " . $prisoner['pris_id'] . ")"; ?>
                            </option>
                          <?php endwhile; ?>
                        </select>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Email</label>
                      <div class="col-sm-10">
                        <input type="email" class="form-control" name="email" required />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Phone No</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" name="phno" pattern="\d{10}" maxlength="10" required title="Phone number must be 10 digits" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Message</label>
                      <div class="col-sm-10">
                        <textarea class="form-control" name="message" required></textarea>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Relation</label>
                      <div class="col-sm-10">
                        <select class="form-control" name="relation" required>
                          <option value="" disabled selected>Select</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Wife">Wife</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Jail Type</label>
                      <div class="col-sm-10">
                        <select id="jailType" name="jtype" class="form-control" onchange="updateJailNames()" required>
                          <option value="">Select Jail Type</option>
                          <option value="Central Jails">Central Jails</option>
                          <option value="Sub Jails">Sub Jails</option>
                          <option value="District Jails">District Jails</option>
                          <option value="Special Sub Jails">Special Sub Jails</option>
                          <option value="Women's Jails">Women's Jails</option>
                          <option value="Open Jails">Open Jails</option>
                          <option value="Other Jails">Other Jails</option>
                        </select>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Jail Name</label>
                      <div class="col-sm-10">
                        <select id="jailName" name="jname" class="form-control" required>
                          <option value="">Select Jail Name</option>
                        </select>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label class="col-sm-2 col-form-label">Date</label>
                      <div class="col-sm-10">
                        <input type="date" class="form-control" name="date" min="<?php echo $today; ?>" required />
                      </div>
                    </div>

                    <div class="row justify-content-end">
                      <div class="col-sm-10">
                        <button type="submit" class="btn btn-primary">Book</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const jailOptions = {
    "Central Jails": [
      "Central Prison & Correctional Home, Poojappura, Thiruvananthapuram",
      "Central Prison & Correctional Home, Viyyur, Thrissur",
      "Central Prison & Correctional Home, Pallikkunnu, Kannur",
      "Central Prison & Correctional Home, Tavanur, Malappuram"
    ],
    "Sub Jails": [
      "Sub Jail, Attingal", "Sub Jail, Meenachil", "Sub Jail, Peerumade", "Sub Jail, Mattancherry",
      "Sub Jail, Ernakulam", "Sub Jail, Aluva", "Sub Jail, Chavakkad", "Sub Jail, Viyyur",
      "Sub Jail, Alathur", "Sub Jail, Ottappalam", "Sub Jail, Perinthalmanna", "Sub Jail, Ponnani",
      "Sub Jail, Tirur", "Sub Jail, Koyilandy", "Sub Jail, Vatakara", "Sub Jail, Kannur"
    ],
    "District Jails": [
      "District Jail, Thiruvananthapuram (Poojappura)", "District Jail, Kollam", "District Jail, Pathanamthitta",
      "District Jail, Alappuzha", "District Jail, Kottayam", "District Jail, Idukki (Muttom)",
      "District Jail, Ernakulam", "District Jail, Thrissur (Viyyur)", "District Jail, Palakkad (Malampuzha)",
      "District Jail, Kozhikode", "District Jail, Kannur", "District Jail, Wayanad (Mananthavady)",
      "District Jail, Kasaragod (Hosdurg)"
    ],
    "Special Sub Jails": [
      "Special Sub Jail, Thiruvananthapuram (Poojappura)", "Special Sub Jail, Neyyattinkara", "Special Sub Jail, Kottarakkara",
      "Special Sub Jail, Mavelikkara", "Special Sub Jail, Ponkunnam", "Special Sub Jail, Devikulam",
      "Special Sub Jail, Muvattupuzha", "Special Sub Jail, Irinjalakkuda", "Special Sub Jail, Chittoor",
      "Special Sub Jail, Manjeri", "Special Sub Jail, Kozhikode", "Special Sub Jail, Vythiri",
      "Special Sub Jail, Kannur", "Special Sub Jail, Thalassery", "Special Sub Jail, Koothuparambu",
      "Special Sub Jail, Kasaragod"
    ],
    "Women's Jails": [
      "Women Prison & Correctional Home, Thiruvananthapuram",
      "Women Prison & Correctional Home, Viyyur",
      "Women Prison & Correctional Home, Kannur"
    ],
    "Open Jails": [
      "Open Prison & Correctional Home, Nettukaltheri, Thiruvananthapuram",
      "Open Prison & Correctional Home, Cheemeni, Kasaragod",
      "Women Open Prison & Correctional Home, Poojappura, Thiruvananthapuram"
    ],
    "Other Jails": [
      "Borstal School, Kakkanad"
    ]
  };

  function updateJailNames() {
    const jailType = document.getElementById("jailType").value;
    const jailNameSelect = document.getElementById("jailName");
    jailNameSelect.innerHTML = "<option value=''>Select Jail Name</option>";

    if (jailOptions[jailType]) {
      jailOptions[jailType].forEach(jail => {
        const option = document.createElement("option");
        option.value = jail;
        option.textContent = jail;
        jailNameSelect.appendChild(option);
      });
    }
  }
</script>

<script src="../assets/vendor/libs/jquery/jquery.js"></script>
<script src="../assets/vendor/libs/popper/popper.js"></script>
<script src="../assets/vendor/js/bootstrap.js"></script>
<script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
<script src="../assets/vendor/js/menu.js"></script>
<script src="../assets/js/main.js"></script>
</body>
</html>
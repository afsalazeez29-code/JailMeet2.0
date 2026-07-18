<?php
session_start();
include('db.php');

// Initialize variables
$searchResult = null;
$errorMessage = null;
$prisonerImage = null;

// Verify database connection
if (!$connection) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Search functionality
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['search_id']) && !empty($_GET['search_id'])) {
    $search_id = $_GET['search_id'];

    // Use prepared statement to fetch prisoner
    $query = "SELECT * FROM prisoner WHERE pris_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $search_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check for query errors
    if ($result === false) {
        $errorMessage = "Query failed: " . mysqli_error($connection);
    } elseif ($result->num_rows > 0) {
        $searchResult = $result->fetch_assoc();

        // Check if prisoner table exists
        $table_check_query = "SHOW TABLES LIKE 'prisoner'";
        $table_check_result = mysqli_query($connection, $table_check_query);

        if ($table_check_result->num_rows > 0) {
            // Get prisoner image path if table exists
            $image_query = "SELECT dp FROM prisoner WHERE pris_id = ?";
            $image_stmt = $connection->prepare($image_query);
            $image_stmt->bind_param("s", $search_id);
            $image_stmt->execute();
            $image_result = $image_stmt->get_result();

            if ($image_result === false) {
                $errorMessage .= " | Image query failed: " . mysqli_error($connection);
            } elseif ($image_result->num_rows > 0) {
                $image_data = $image_result->fetch_assoc();
                $prisonerImage = $image_data['dp'];
            }
            $image_stmt->close();
        } else {
            $errorMessage .= " | Image table 'prisoner' does not exist";
        }
    } else {
        $errorMessage = "No prisoner found with ID: " . htmlspecialchars($search_id);
    }
    $stmt->close();
}

include('navbar.php');
include('sidebar.php');

// Handle image path
$image_path = '../assets/img/avatars/default-prisoner.png'; // Default fallback image

if (!empty($prisonerImage)) {
    // Get just the filename from the database
    $filename = basename($prisonerImage);

    // Define the correct path to uploads directory
    $uploads_dir = '/Applications/XAMPP/xamppfiles/htdocs/Project/JailMeet/officer/uploads/';
    $web_accessible_path = '../../../officer/uploads/'; // Path relative to prisoner/index.php

    // Check if file exists in uploads directory
    if (file_exists($uploads_dir . $filename)) {
        $image_path = $web_accessible_path . $filename;
    }
}
?>

<!DOCTYPE html>
<html lang="en" class="light-style layout-menu-fixed" dir="ltr" data-theme="theme-default" data-assets-path="../assets/" data-template="vertical-menu-template-free">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <title>JailMeet Visitor</title>
    <meta name="description" content="" />
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/img/favicon/favicon.ico" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
    <!-- Icons -->
    <link rel="stylesheet" href="../assets/vendor/fonts/boxicons.css" />
    <!-- Core CSS -->
    <link rel="stylesheet" href="../assets/vendor/css/core.css" class="template-customizer-core-css" />
    <link rel="stylesheet" href="../assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
    <link rel="stylesheet" href="../assets/css/demo.css" />
    <!-- Vendors CSS -->
    <link rel="stylesheet" href="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="../assets/vendor/libs/apex-charts/apex-charts.css" />
    <!-- Helpers -->
    <script src="../assets/vendor/js/helpers.js"></script>
    <!-- Config -->
    <script src="../assets/js/config.js"></script>
    <style>
        .prisoner-image {
            max-width: 200px;
            max-height: 200px;
            border-radius: 5px;
            border: 1px solid #ddd;
            object-fit: cover;
        }
        .image-container {
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .search-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .details-card {
            margin-top: 30px;
        }
    </style>
</head>

<body>
    <div class="search-container">
        <h2 class="text-center mb-4">Prisoner Search</h2>

        <div class="card">
            <div class="card-body">
                <form method="GET" action="">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" name="search_id" placeholder="Enter Prisoner ID" 
                               value="<?php echo isset($_GET['search_id']) ? htmlspecialchars($_GET['search_id']) : ''; ?>">
                        <button class="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>
            </div>
        </div>

        <?php if ($errorMessage): ?>
            <div class="alert alert-danger mt-4">
                <?php echo htmlspecialchars($errorMessage); ?>
            </div>
        <?php endif; ?>

        <?php if ($searchResult): ?>
            <div class="card details-card">
                <div class="card-header">
                    <h4>Prisoner Details</h4>
                </div>
                <div class="card-body">
                    <div class="image-container">
                        <img src="<?php echo htmlspecialchars($image_path); ?>" 
                             alt="Prisoner Image" 
                             class="prisoner-image"
                             onerror="this.onerror=null;this.src='../assets/img/avatars/default-prisoner.png'">
                        <?php if (empty($prisonerImage)): ?>
                            <p class="mt-2">No image available</p>
                        <?php endif; ?>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th width="30%">Prisoner ID</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_id']); ?></td>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_name']); ?></td>
                                </tr>
                                <tr>
                                    <th>Age</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_age']); ?></td>
                                </tr>
                                <tr>
                                    <th>Gender</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_gender']); ?></td>
                                </tr>
                                <tr>
                                    <th>Crime</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_case']); ?></td>
                                </tr>
                                <tr>
                                    <th>Admission Date</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_adm']); ?></td>
                                </tr>
                                <tr>
                                    <th>Prison Period</th>
                                    <td><?php echo htmlspecialchars($searchResult['pris_period']); ?></td>
                                </tr>
                                <tr>
                                    <th>FIR</th>
                                    <td>
                                        <?php 
                                        if (!empty($searchResult['fir_number']) && $searchResult['fir_number'] !== 'N/A') {
                                            echo htmlspecialchars($searchResult['fir_number']);
                                            ?>
                                            <button type="button" class="btn btn-sm btn-info ms-2" 
                                                    data-bs-toggle="modal" data-bs-target="#firModal"
                                                    data-fir-details="<?php echo htmlspecialchars($searchResult['fir'] ?? 'No details available'); ?>">
                                                View FIR Details
                                            </button>
                                            <?php
                                        } else {
                                            echo 'FIR Not Updated';
                                        }
                                        ?>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- FIR Details Modal -->
            <div class="modal fade" id="firModal" tabindex="-1" aria-labelledby="firModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="firModalLabel">FIR Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p id="firDetails">Loading...</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <!-- Core JS -->
    <script src="../assets/vendor/libs/jquery/jquery.js"></script>
    <script src="../assets/vendor/libs/popper/popper.js"></script>
    <script src="../assets/vendor/js/bootstrap.js"></script>
    <script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="../assets/vendor/js/menu.js"></script>
    <!-- Main JS -->
    <script src="../assets/js/main.js"></script>
    <!-- Modal Script -->
    <script>
        // Populate FIR details in modal when button is clicked
        document.addEventListener('DOMContentLoaded', function () {
            const firModal = document.getElementById('firModal');
            firModal.addEventListener('show.bs.modal', function (event) {
                const button = event.relatedTarget; // Button that triggered the modal
                const firDetails = button.getAttribute('data-fir-details'); // Extract FIR details
                const modalBody = firModal.querySelector('#firDetails');
                modalBody.textContent = firDetails || 'No FIR details available';
            });
        });
    </script>
</body>
</html>
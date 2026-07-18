<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>

<div class="header">
		<div class="header-left">
			<div class="menu-icon dw dw-menu"></div>
			<div class="search-toggle-icon dw dw-search2" data-toggle="header_search"></div>
			<div class="header-search">
				<form>
					<div class="form-group mb-0">
						
						
						<div class="dropdown">
							<a class="dropdown-toggle no-arrow" href="#" role="button" data-toggle="dropdown">
								
							</a>
							<div class="dropdown-menu dropdown-menu-right">
								<div class="form-group row">
									<label class="col-sm-12 col-md-2 col-form-label">From</label>
									<div class="col-sm-12 col-md-10">
										<input class="form-control form-control-sm form-control-line" type="text">
									</div>
								</div>
								<div class="form-group row">
									<label class="col-sm-12 col-md-2 col-form-label">To</label>
									<div class="col-sm-12 col-md-10">
										<input class="form-control form-control-sm form-control-line" type="text">
									</div>
								</div>
								<div class="form-group row">
									<label class="col-sm-12 col-md-2 col-form-label">Subject</label>
									<div class="col-sm-12 col-md-10">
										<input class="form-control form-control-sm form-control-line" type="text">
									</div>
								</div>
								<div class="text-right">
									<button class="btn btn-primary">Search</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="header-right">
			
			<div class="user-notification">
				<div class="dropdown">
					
						
						
					</a>
					<div class="dropdown-menu dropdown-menu-right">
						<div class="notification-list mx-h-350 customscroll">
							
						</div>
					</div>
				</div>
			</div>

            <div class="user-info-dropdown">
            <div class="dropdown">
                <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                    <span class="user-icon">
                        <img src="officer.png" alt="">
                    </span>
                    <span class="user-name">
                        <?php echo isset($_SESSION['ofname']) ? htmlspecialchars($_SESSION['ofname']) : 'Officer'; ?>
                    </span>
                </a>
                <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">
                    <a class="dropdown-item" href=""><i class="dw dw-id-card"></i> 
                        ID: <?php echo isset($_SESSION['id']) ? htmlspecialchars($_SESSION['id']) : 'N/A'; ?>
                    </a>
                    <a class="dropdown-item" href=""><i class="dw dw-envelope"></i> 
                        Email: <?php echo isset($_SESSION['ofemail']) ? htmlspecialchars($_SESSION['ofemail']) : 'N/A'; ?>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="of_profile.php"><i class="dw dw-user1"></i> Profile</a>
                    <a class="dropdown-item" href="profile_edit.php"><i class="dw dw-settings2"></i> Setting</a>
                    <a class="dropdown-item" href="officerlogin.php"><i class="dw dw-logout"></i> Log Out</a>
                </div>
            </div>
        </div>
    </div>
</div>
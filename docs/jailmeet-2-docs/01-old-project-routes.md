# Old Project Route Map

This document outlines the legacy PHP routing structure of the JailMeet project.

## 1. Admin Routes (`/admin/`)
- `adminlogin.php`: Admin login page
- `adindex.php`: Admin dashboard
- `admindetails.php`: View list of administrators
- `add_officer.php`: Form/action to create a new officer
- `adminprofile.php` / `profileedit.php`: Manage admin profile
- `appointments.php`, `appointmentdetails.php`: View appointment records
- `officersdetails.php`: View list of officers
- `prisonerdetails.php`: View list of prisoners
- `userdetails.php`: View list of users/visitors
- `delete_admin.php`, `update_admin.php`: Admin CRUD actions

## 2. Officer Routes (`/officer/`)
- `officerlogin.php`: Officer login page
- `index.php`: Officer dashboard
- `prisoners.php`: View list of prisoners
- `add_prisoner.php`, `update_prisoner.php`, `delete_prisoner.php`: Prisoner CRUD operations
- `parole.php`, `pendingparole.php`, `acceptedparole.php`, `rejectedparole.php`: Parole management views
- `accept_parole.php`, `reject_parole.php`: Parole actions
- `newappointment.php`, `requests.php`: Manage visitor appointments
- `eligibility.php`, `fir.php`, `log_prisoner_detail.php`: View prisoner detailed info
- `of_profile.php`, `profile_edit.php`: Officer profile management

## 3. Visitor Routes (`/visitor/`)
- `login.php`: Visitor login page
- `register.php`: Visitor registration page
- `/visitorpage/html/home.php`, `vhome.php`: Visitor dashboard
- `/visitorpage/html/booking.php`: Book an appointment with a prisoner
- `/visitorpage/html/prisoners.php`: View list of prisoners
- `/visitorpage/html/status.php`: View appointment status
- `/visitorpage/html/profile.php`, `accountsettings.php`: Visitor profile management

## 4. Prisoner Routes (`/prisoner/`)
- `prisonerlogin.php`: Prisoner login page
- `index.php`: Prisoner dashboard
- `parole.php`: Submit parole request
- `parolestatus.php`: View parole request status
- `visitorhistory.php`: View history of visitors/appointments

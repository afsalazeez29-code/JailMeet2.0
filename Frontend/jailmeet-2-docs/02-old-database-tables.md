# Old Database Table List and Column Usage

This document describes the legacy MySQL database schema (`jailmeet.sql`) for the JailMeet project.

## 1. Table: `admin`
Stores system administrators.
- `ad_id` (INT, PK, Auto Increment): Primary key
- `ad_name` (VARCHAR): Admin's full name
- `ad_email` (VARCHAR, UNIQUE): Admin's email address (login credential)
- `ad_password` (VARCHAR): Admin's password

## 2. Table: `officer`
Stores prison officers.
- `id` (INT, PK, Auto Increment): Primary key
- `ofname` (VARCHAR): Officer's full name
- `ofemail` (VARCHAR, UNIQUE): Officer's email address (login credential)
- `ofpass` (VARCHAR): Officer's password
- `ofphno` (VARCHAR): Officer's phone number

## 3. Table: `visitors`
Stores civilian visitors.
- `vid` (INT, PK, Auto Increment): Primary key
- `vname` (VARCHAR): Visitor's full name
- `vemail` (VARCHAR, UNIQUE): Visitor's email address (login credential)
- `vpass` (VARCHAR): Visitor's password
- `vphno` (VARCHAR): Visitor's phone number
- `vstate` (VARCHAR): Visitor's state of residence
- `vadd` (VARCHAR): Visitor's address
- `vzip` (VARCHAR): Visitor's ZIP code
- `profile_pic` (VARCHAR): File path to visitor's profile picture

## 4. Table: `prisoner`
Stores prisoner details and parole records.
- `pris_id` (INT, PK, Auto Increment): Primary key
- `pris_name` (VARCHAR): Prisoner's full name
- `pris_age` (INT): Prisoner's age
- `pris_gender` (VARCHAR): Prisoner's gender
- `pris_case` (TEXT): Description of the case/crime
- `pris_adm` (DATE): Admission date
- `pris_period` (VARCHAR): Sentence period
- `jailtype` (VARCHAR): Type of jail (e.g., Central, District)
- `jailname` (VARCHAR): Name of the jail
- `pris_cell` (VARCHAR): Cell number
- `checkup` (VARCHAR), `blood` (VARCHAR), `allergies` (VARCHAR): Medical information
- `dp` (VARCHAR): Display picture/photo of the prisoner
- `par_status` (VARCHAR): Current parole status
- `fir_number` (VARCHAR), `fir` (TEXT), `fir_date` (DATE): FIR details
- Parole fields: `par_name`, `par_rel`, `par_purp`, `par_msg`, `parole_from`, `parole_to`, `parole_msg`, `reject_msg`

## 5. Table: `appointments`
Stores visit requests from visitors to prisoners.
- `id` (INT, PK, Auto Increment): Primary key
- `name` (VARCHAR): Visitor's name (redundant with visitors table)
- `prisid` (INT): ID of the prisoner to visit
- `email` (VARCHAR): Visitor's email
- `phno` (VARCHAR): Visitor's phone number
- `message` (TEXT): Message attached to the visit request
- `relation` (VARCHAR): Relationship to the prisoner
- `jtype` (VARCHAR), `jname` (VARCHAR): Jail details
- `date` (DATE): Requested date of visit
- `visitor_id` (INT): ID of the visitor (Foreign key to `visitors.vid`)
- `accept` (VARCHAR): Status of the appointment (e.g., 'Pending', 'Accepted')
- `reply` (VARCHAR): Reply from the officer
- `visit_status` (VARCHAR): Final visit status

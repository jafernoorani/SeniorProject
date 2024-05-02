/*
PREREQUISITES:
    - start_mariadb.sh script ran
    - admin user created with all privileges and grant option
    - author user created with remote access
    - current admin session in mariadb
*/

-- Create primary database
CREATE DATABASE IF NOT EXISTS SugarDaddy;

USE SugarDaddy;

-- Create patientData table
CREATE TABLE IF NOT EXISTS patientData(
    patientID INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    emailAddress VARCHAR(255) NOT NULL,
    userName VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    Height_in FLOAT NOT NULL,
    Age INT(11),
    bloodData VARCHAR(10),
    Symptoms TEXT,
    doB DATE,
    isLoggedIn TINYINT(1)
);
SHOW WARNINGS;

-- Create vitalData table
CREATE TABLE IF NOT EXISTS vitalData(
    vitalID INT(11) AUTO_INCREMENT PRIMARY KEY,
    patientID INT NOT NULL,
    vitalsTakenDate DATE,
    vitalType SET("BloodSugar - Morning", "BloodSugar - Afternoon", "BloodSugar - Evening", "Symptoms", "Weight", "Sleep") NOT NULL,
    vitalValue VARCHAR(255) NOT NULL,
    CONSTRAINT fk_patientID FOREIGN KEY (patientID)
    REFERENCES patientData(patientID)
);
SHOW WARNINGS;

-- Create weightData table
CREATE TABLE IF NOT EXISTS weightData(
    weightID INT(11) AUTO_INCREMENT PRIMARY KEY,
    weight DECIMAL(5,2) NOT NULL,
    measurementDate DATE DEFAULT (curdate()),
    patientID INT NOT NULL,
    CONSTRAINT fk_pid FOREIGN KEY (patientID)
    REFERENCES patientData(patientID)
);
SHOW WARNINGS;

-- Allow author privileges on tables
GRANT ALL PRIVILEGES ON SugarDaddy.* TO author;

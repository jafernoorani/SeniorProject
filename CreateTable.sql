CREATE TABLE userLogins (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(150) NOT NULL UNIQUE
);
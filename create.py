import mysql.connector

# Establishing a connection to the MySQL database
db = mysql.connector.connect(
    host="database-1.cnq4o0i0yw0j.us-east-2.rds.amazonaws.com",
    user="admin",
    passwd="Seniorproject1",
    db="database-1"
)

# Creating a cursor object to execute SQL queries
cur = db.cursor()

# Executing an SQL query to create a table named Test with id and name columns
cur.execute("CREATE TABLE Test (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT)")

# Committing the changes
db.commit()

# Closing the database connection
db.close()

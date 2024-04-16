import pymysql

# Database connection settings
ENDPOINT = "ec2-54-226-103-123.compute-1.amazonaws.com"
PORT = 3306
USER = "author"
PASSWORD = "authorpass123"
DBNAME = "SugarDaddy"

try:
    # Establish a connection to the database
    conn = pymysql.connect(host=ENDPOINT, port=PORT, user=USER, password=PASSWORD, database=DBNAME)

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute a sample query (e.g., select current time)
    cursor.execute("SELECT NOW()")

    # Fetch and print the result
    row = cursor.fetchone()
    print("Current time from the database:", row[0])

    # Close cursor and connection
    cursor.close()
    conn.close()

except pymysql.MySQLError as e:
    print("MySQL error:", e)

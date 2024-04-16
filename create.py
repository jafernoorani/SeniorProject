import pymysql

# Database connection settings
ENDPOINT = "54.226.103.123"
PORT = 3306
USER = "author"
PASSWORD = "authorpass123"
DBNAME = "SugarDaddy"

def print_patient_data():
    try:
        # Establish a connection to the database
        conn = pymysql.connect(host=ENDPOINT, port=PORT, user=USER, password=PASSWORD, database=DBNAME)

        # Create a cursor object to execute SQL queries
        cursor = conn.cursor()

        # Execute a query to select all rows from the "patientData" table
        cursor.execute("SELECT * FROM patientData")

        # Fetch all rows from the result
        rows = cursor.fetchall()

        # Print the column headers
        print("Contents of the 'patientData' table:")
        cursor.execute("SHOW COLUMNS FROM patientData")
        columns = cursor.fetchall()
        column_names = [column[0] for column in columns]
        print("\t".join(column_names))

        # Print the data rows
        for row in rows:
            print("\t".join(str(value) for value in row))

        # Close cursor and connection
        cursor.close()
        conn.close()

    except pymysql.MySQLError as e:
        print("MySQL error:", e)

try:
    # Establish a connection to the database
    conn = pymysql.connect(host=ENDPOINT, port=PORT, user=USER, password=PASSWORD, database=DBNAME)

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Get column names from the "patientData" table excluding 'id'
    cursor.execute("SHOW COLUMNS FROM patientData")
    columns = cursor.fetchall()
    column_names = [column[0] for column in columns if column[0] != 'id']

    # Example data to be inserted into the "patientData" table
    new_data = {
        'username': 'john_doe',
        'lastName': 'Doe',
        'firstName': 'John',
        'height': 180,
        'weight': 75,
        'doB': '1989-01-01'
        
    }

    # Define the INSERT query with dynamic column names (excluding 'id')
    insert_query = "INSERT INTO patientData ({}) VALUES ({})".format(
        ', '.join(column_names),
        ', '.join(['%s'] * len(column_names))
    )

    # Execute the INSERT query with the data
    cursor.execute(insert_query, tuple(new_data.get(column, None) for column in column_names))

    # Commit the transaction
    conn.commit()

    print("Data successfully inserted into the 'patientData' table.")

    # Print the whole contents of the "patientData" table
    print_patient_data()

    # Close cursor and connection
    cursor.close()
    conn.close()

except pymysql.MySQLError as e:
    # Roll back the transaction if an error occurs
    conn.rollback()
    print("MySQL error:", e)

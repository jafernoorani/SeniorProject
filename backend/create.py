from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)

# Database connection settings
# Get the following values from an environment file
ENDPOINT = "111.111.111.111"
PORT = 111
USER = "YourUserName"
PASSWORD = "YourPassWord"
DBNAME = "YourDataBaseName"

def create_patient_data_table():
    try:
        # Establish a connection to the database
        conn = pymysql.connect(host=ENDPOINT, port=PORT, user=USER, password=PASSWORD, database=DBNAME)

        # Create a cursor object to execute SQL queries
        cursor = conn.cursor()

        # Execute SQL query to create the 'patientData' table with the specified attributes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patientData (
                patientID INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                emailAddress VARCHAR(255),
                userName VARCHAR(50) UNIQUE,
                password VARCHAR(50),
                Height_in FLOAT,
                Weight FLOAT,
                Age INT,
                Symptoms TEXT,
                doB DATE
            )
        """)

        print("Table 'patientData' created successfully.")

        # Close cursor and connection
        cursor.close()
        conn.close()

    except pymysql.MySQLError as e:
        print("MySQL error:", e)

@app.route('/create_table', methods=['POST'])
def create_table():
    try:
        create_patient_data_table()
        return jsonify({"message": "Table 'patientData' created successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

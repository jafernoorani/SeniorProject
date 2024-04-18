# from flask import Flask, request, jsonify
# import pymysql

# app = Flask(__name__)

# # Database connection settings
# ENDPOINT = "54.226.103.123"
# PORT = 3306
# USER = "author"
# PASSWORD = "authorpass123"
# DBNAME = "SugarDaddy"

# def save_patient_data(data):
#     try:
#         # Establish a connection to the database
#         conn = pymysql.connect(host=ENDPOINT, port=PORT, user=USER, password=PASSWORD, database=DBNAME)

#         # Create a cursor object to execute SQL queries
#         cursor = conn.cursor()

#         # Execute SQL query to insert the form data into the 'patientData' table
#         sql = """
#             INSERT INTO patientData (fullName, emailAddress, userName, password, Height_in, Weight, Age, bloodData, Symptoms, doB)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#         """
#         cursor.execute(sql, (
#             data['fullName'],
#             data['email'],
#             data['username'],
#             data['password'],
#             data.get('Height_in'),  # Use data.get() to handle optional fields
#             data.get('Weight'),
#             data.get('Age'),
#             data.get('bloodData'),
#             data.get('Symptoms'),
#             data.get('doB')
#         ))

#         # Commit the transaction
#         conn.commit()

#         print("Data saved successfully.")

#         # Close cursor and connection
#         cursor.close()
#         conn.close()

#     except pymysql.MySQLError as e:
#         print("MySQL error:", e)

# @app.route('/saveData', methods=['POST'])
# def save_data():
#     try:
#         data = request.json  # Get the JSON data from the request
#         save_patient_data(data)
#         return jsonify({"message": "Data saved successfully."}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)

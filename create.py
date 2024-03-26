# # import mysql.connector

# # print("Start connecting create.py")

# # # Establishing a connection to the MySQL database
# # db = mysql.connector.connect(
# #     host="database-1.cnq4o0i0yw0j.us-east-2.rds.amazonaws.com",
# #     user="admin",
# #     passwd="Seniorproject1",
# #     db="database-1"
# # )

# # print("Stop connecting create.py")

# # # Creating a cursor object to execute SQL queries
# # # cur = db.cursor()

# # # Executing an SQL query to create a table named Test with id and name columns
# # # cur.execute("CREATE TABLE Test (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT)")

# # # Committing the changes
# # # db.commit()

# # # Closing the database connection
# # # db.close()



# import mysql.connector

# endpoint = 'database-1.cnq4o0i0yw0j.us-east-2.rds.amazonaws.com'
# username = 'admin'
# password = 'Seniorproject1'
# database = 'database-1'

# cnx = mysql.connector.connect(user=username, password=password,
#                               host=endpoint, database=database)




import pymysql
import sys
import boto3
import os

ENDPOINT="database-1.cnq4o0i0yw0j.us-east-2.rds.amazonaws.com"
PORT="3306"
USER="admin"
REGION="us-east-2a"
DBNAME="database-1"
os.environ['LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN'] = '1'

#gets the credentials from .aws/credentials
session = boto3.Session(profile_name='default')
client = session.client('rds')

token = client.generate_db_auth_token(DBHostname=ENDPOINT, Port=PORT, DBUsername=USER, Region=REGION)

# try:
#     conn =  pymysql.connect(host=ENDPOINT, user=USER, passwd=token, port=PORT, database=DBNAME)
#     cur = conn.cursor()
#     cur.execute("""SELECT now()""")
#     query_results = cur.fetchall()
#     print(query_results)
# except Exception as e:
#     print("Database connection failed due to {}".format(e))

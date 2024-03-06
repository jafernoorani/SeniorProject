import mysql.connector

db = mysqlconnector.connect(host="database-1.cnq4o0i0yw0j.us-east-2.rds.amazonaws.com",    # your host, usually localhost
                     user="admin",         # your username
                     passwd="Seniorproject1",  # your password
                     db="database-1")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("CREATE TABLE Test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)")


db.close()
import flask
import sqlite3
from flask import render_template
import pandas as pd
import os
from werkzeug.security import generate_password_hash

default_username  = "admin"
default_password  = "root"
#contacts_file = 'contacts.csv'
#contacts_csv = pd.read_csv(contacts_file)

input_username = input(f"Enter admin username (default: {default_username}): ").strip()
input_password = input(f"Enter admin password (default: {default_password}): ").strip()

USERNAME = input_username if input_username else default_username
PASSWORD = input_password if input_password else default_password

hashed_password = generate_password_hash(PASSWORD)

def db_initialization(databaseexcel):    

    conn = sqlite3.connect('main_database.db')
    cursor = conn.cursor()

    # Recreate main table
    cursor.execute('DROP TABLE IF EXISTS main')
    cursor.execute('''
        CREATE TABLE main (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Phone_Number TEXT,
            Email TEXT,       
            Category TEXT,
            Type TEXT,
            Priority INTEGER,
            Communication_Routes TEXT,
            Profile_Picture TEXT,
            Last_Contacted TEXT,
            Last_Meeting TEXT,
            Industry TEXT,
            Comments TEXT
        )
    ''')
    cursor.execute('DROP TABLE IF EXISTS adminuser')
    cursor.execute('''
        CREATE TABLE adminuser (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT,
            Password TEXT
        )
    ''')
    # Create settings table
    cursor.execute('DROP TABLE IF EXISTS settings')
    cursor.execute('''
        CREATE TABLE settings (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Value TEXT
        )
    ''')
    cursor.execute('DROP TABLE IF EXISTS engagements')
    cursor.execute('''
        CREATE TABLE engagements (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Person_ID INTEGER NOT NULL,
        Type TEXT,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (Person_ID) REFERENCES main(ID)
    );
    ''')

    # Insert default setting row for maxDays
    cursor.execute('''
        INSERT INTO settings (Name, Value)
        VALUES (?, ?)
    ''', ('maxDays', '180'))

    # Insert deafult admin user into adminuser table
    cursor.execute('''
        INSERT INTO adminuser (Username, Password)
        VALUES (?, ?)
    ''', (USERNAME, hashed_password))

    # Insert contact data
    if(databaseexcel == "empty"):
        print("No Excel Template Provided")
    else:
        excel_file = databaseexcel
        df = pd.read_excel(excel_file, sheet_name='Main')

        # Remove existing ID column if present (we'll auto-increment it)
        if 'ID' in df.columns:
            df = df.drop(columns=['ID'])

        df.to_sql('main', conn, if_exists='append', index=False)
    conn.commit()
    conn.close()    



database_path = 'database.xlsx'
sample_database_path = 'database-sample.xlsx'

if os.path.exists(database_path):
    print(f"{database_path} exists.") 
    db_initialization(database_path)   
elif os.path.exists(sample_database_path):
    print(f"{sample_database_path} exists.") 
    db_initialization(sample_database_path)
else:
    print(f"{database_path} does not exist.")
    print(f"{sample_database_path} also does not exist.")
    print("Initializing with empty database")
    db_initialization('empty')  
    
#db_initialization('empty')
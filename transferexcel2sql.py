import flask
import sqlite3
from flask import render_template
import pandas as pd

contacts_file = 'contacts.csv'

contacts_csv = pd.read_csv(contacts_file)

def db_initialization(databaseexcel):
    excel_file = databaseexcel
    df = pd.read_excel(excel_file, sheet_name='Main')

    # Remove existing ID column if present (we'll auto-increment it)
    if 'ID' in df.columns:
        df = df.drop(columns=['ID'])

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

    # Create settings table
    cursor.execute('DROP TABLE IF EXISTS settings')
    cursor.execute('''
        CREATE TABLE settings (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Value TEXT
        )
    ''')

    # Insert default setting row for maxDays
    cursor.execute('''
        INSERT INTO settings (Name, Value)
        VALUES (?, ?)
    ''', ('maxDays', '180'))

    # Insert contact data
    df.to_sql('main', conn, if_exists='append', index=False)

    conn.commit()
    conn.close()

db_initialization('database-sample.xlsx')
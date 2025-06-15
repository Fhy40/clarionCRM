import flask
import sqlite3
from flask import render_template
import pandas as pd

excel_file = 'database.xlsx'
df = pd.read_excel(excel_file, sheet_name='Main')

# Remove existing ID column if present (we'll auto-increment it)
if 'ID' in df.columns:
    df = df.drop(columns=['ID'])

conn = sqlite3.connect('main_database.db')
cursor = conn.cursor()

# Recreate table with explicit schema and auto-incrementing ID
cursor.execute('DROP TABLE IF EXISTS main')
cursor.execute('''
    CREATE TABLE main (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        Phone_Number TEXT,       
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

# Insert data without ID column
df.to_sql('main', conn, if_exists='append', index=False)

conn.commit()
conn.close()
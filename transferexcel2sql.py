import flask
import sqlite3
from flask import render_template
import pandas as pd


excel_file = 'database.xlsx'
df = pd.read_excel(excel_file, sheet_name='Main')

conn = sqlite3.connect('main_database.db')

df.to_sql('main', conn, if_exists='replace', index=False)

conn.close()
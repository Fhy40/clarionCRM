import flask
import sqlite3
from flask import Flask, render_template, g, request, redirect,  url_for, jsonify
from datetime import datetime


app = flask.Flask(__name__,static_url_path='/static')
DATABASE = 'main_database.db'




def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # To access columns by name
    return g.db

def get_person(id):
    db = get_db()
    person = db.execute('SELECT * FROM main WHERE ID=' + str(id)).fetchall()
    return person


@app.route('/update_person', methods=['POST'])
def update_person():
    type_switch = request.form['type_switch']
    if(type_switch == "online"):
        person_id = request.form['id']
        last_contacted = request.form['last_contacted']
        comments = request.form.get('comments', '')
        db = get_db()
        db.execute('UPDATE main SET Last_Contacted = ?, Comments = ? WHERE ID = ?', 
                (last_contacted, comments, person_id))
        db.execute('''
            INSERT INTO engagements (Person_ID, Timestamp,Type) 
            VALUES (?, ?, ?)
        ''', (person_id, last_contacted,type_switch))
    elif(type_switch == "realife"):
        person_id = request.form['id']
        last_contacted = request.form['last_contacted']
        comments = request.form.get('comments', '')
        db = get_db()
        db.execute('UPDATE main SET Last_Meeting = ?, Comments = ? WHERE ID = ?', 
                (last_contacted, comments, person_id))
        db.execute('''
            INSERT INTO engagements (Person_ID, Timestamp,Type) 
            VALUES (?, ?,?)
        ''', (person_id, last_contacted,type_switch))
    db.commit()
    print("Last contacted received:", last_contacted)
    # Redirect back to the homepage or wherever appropriate
    
    return redirect(url_for('home'))

@app.route('/delete_person', methods=['POST'])
def delete_person():
    person_id = request.form.get('id')

    if not person_id:
        return "Missing ID", 400

    db = get_db()
    db.execute('DELETE FROM main WHERE ID = ?', (person_id,))
    db.commit()

    return redirect(url_for('home'))

@app.route('/add_person', methods=['GET', 'POST'])
def add_person():
    if request.method == 'POST':
        name = request.form['name']
        category = request.form.get('category', '')
        type_ = request.form.get('type', '')
        priority = int(request.form.get('priority', 1))
        communication_routes = request.form.get('communication', '')
        comments = request.form.get('comments', '')
        phone_number = request.form.get('phone_number', '')
        industry = request.form.get('industry','')
        email = request.form.get('email','')
        
        # Static/default values
        profile_picture = 'assets/pic/facebookprofile.jpeg'  # adjust path if needed
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        last_contacted = timestamp
        last_meeting = timestamp

        db = get_db()
        db.execute('''
            INSERT INTO main (
                Name, Category, Type, Priority, Communication_Routes,
                Phone_Number, Profile_Picture, Last_Contacted, Last_Meeting, Comments,Industry, Email
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, category, type_, priority, communication_routes,
            phone_number, profile_picture, last_contacted, last_meeting, comments,industry, email
        ))
        db.commit()

        return redirect(url_for('home'))

    return render_template('add_person.html')

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/')
def home():
    db = get_db()
    rows = db.execute('SELECT * FROM main').fetchall()
    processed_rows = []
    today = datetime.now()

    max_days_row = db.execute("SELECT Value FROM settings WHERE Name = 'maxDays'").fetchone()
    max_days_value = int(max_days_row['Value']) if max_days_row and max_days_row['Value'].isdigit() else 90

    for row in rows:
        row_dict = dict(row)
        last_contacted_str = row_dict.get('Last_Contacted', '')

        try:
            last_contacted_date = datetime.strptime(last_contacted_str[:10], '%Y-%m-%d')
            delta_days = (today - last_contacted_date).days
        except Exception as e:
            print(f"Error parsing date for ID {row_dict.get('ID')}: {e}")
            delta_days = None  # or a default like -1

        row_dict['days_since_contacted'] = delta_days
        processed_rows.append(row_dict)
    people_count = db.execute('SELECT COUNT(ID) FROM main;').fetchall()
    
    print(dict(people_count[0]))    
    return render_template('index.html', rows=processed_rows,people_count = dict(people_count[0]), maxDays=max_days_value)

@app.route('/peopleview')
def peopleview():
    person_id = request.args.get('id')
    if not person_id:
        return "No ID provided", 400
    person = get_person(person_id)
    print(dict(person[0]))
    return render_template('agent_card.html',person=dict(person[0]))

@app.route('/addperson')
def addpersonview():
    return render_template('addperson.html')

@app.route('/update_setting', methods=['POST'])
def update_setting():
    data = request.get_json()
    name = data.get('name')
    value = data.get('value')

    if not name or value is None:
        return jsonify({'success': False, 'message': 'Invalid input'}), 400

    db = get_db()
    db.execute(
        'UPDATE settings SET Value = ? WHERE Name = ?',
        (str(value), name)
    )
    db.commit()
    return jsonify({'success': True, 'message': 'Setting updated'})


if __name__ == '__main__':
      app.run(debug=True)
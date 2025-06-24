# clarionCRM
A simple CRM written in python flask to help manage networking opportunites. Starting off small but hoping to add more features.

<h2>Learning Goals</h2>

* Writing a backend
* Learning some simple UI tricks with CSS
* Writing my own auth
* Releasing a project that other people are easily able to install

<h2>Current Features:</h2>

* Adding contact cards ✅
* Updating Comments ✅
* Mobile Support ✅
* Updating Last Contacted which increases or decreases the relationship level ✅
* Basic Filters to help you sort through the list of contacts ✅
* Changing certain settings (For now it's only maxDays which determines how relationship level is measured) ✅
* Profile Picture Upload ✅

<h2>Planned Features:</h2>

* General Card Color Corrections and Styling 🛠️
* Login System ✅
* Sorting Cards by relationship level 🛠️
* Google Calendar Intergration 🛠️
* Editing Cards after creation 🛠️
* More elements that glow (tastefully) ✅
* Database Cleanups 🛠️

<h2>Screenshots:</h2>
<h4>Homepage: </h4>

![image](https://github.com/user-attachments/assets/b1782051-3448-44ae-8aa9-0f0b19e1d83c)

<h4>Filters: </h4>

![image](https://github.com/user-attachments/assets/c427244b-c93a-411c-80b3-0faea6f91466)

<h4>Adding New People: </h4>

![image](https://github.com/user-attachments/assets/0dafc09d-4aff-4817-9f22-78336653c17b)

<h2>How to Run:</h2>

<h4>Step 1</h4>
Download the entire folder directory

<h4>Step 2</h4>
Run the script initialize_database.py to create your SQLite3 database that will be used by clarionCRM. It should create a file called main_database.db in your folder.
When it prompts you, you can choose to input a username and password. Or you can leave it as default

<h4>Step 3</h4>
Run your flask application with the command "flask --app main run" to run it locally or **"flask --app main run --host=0.0.0.0"** to run it on your local network

<h4>Step 4</h4>
Navigate to the webpage by going to localhost:5000 or your computers local ip address:5000


Stick around as I update this project

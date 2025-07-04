# clarionCRM
A simple CRM written in python flask to help manage networking opportunites but also just to reply to messages on time. Starting off small but hoping to add more features.

<h2> Why? </h2>
This isn't meant to be a business tool. It's goal is for the individual to be able to manage their connections better and avoid letting things sit for too long. This isn't the next big thing, but hopefully it makes life a little more organized. 

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

* General Card Color Corrections and Styling ✅
* Login System ✅
* Sorting Cards by relationship level ✅
* Google Calendar Intergration 🛠️
* Editing Cards after creation ✅
* More elements that glow (tastefully) ✅
* Database Cleanups ✅
* Events Matching 🛠️

<h2>Screenshots:</h2>
<h4>Homepage: </h4>

![image](https://github.com/user-attachments/assets/6a68f9a6-4ac7-4802-9edf-92cfe8efa84b)


<h4>Filters: </h4>

![image](https://github.com/user-attachments/assets/a76a8544-c2d6-424d-a3ef-f3b5fe1e6040)


<h4>Adding New People: </h4>

![image](https://github.com/user-attachments/assets/8165e9ee-a6f7-46b1-b8ac-4b5973a3b06e)


<h4>Card View: </h4>

![image](https://github.com/user-attachments/assets/b2ac12c8-5e35-4f59-8204-aa366e6b6aa8)

<h4>Edit Card View: </h4>

![image](https://github.com/user-attachments/assets/f712b0ab-4502-4589-b55a-8b28e3268c6a)

<br>
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

<h2>Stack </h2>

* Flask
* Javascript
* CSS
* HTML


Stick around as I update this project and feel free to message me with any feedback!

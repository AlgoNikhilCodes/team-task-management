Task 1 – 
Login Not Working After Security Update
📢 Manager Report
“Users are unable to log with correct passwords.”
🎯 Expected
Users should log in successfully using their correct password.
🛠 Objective
Investigate why login fails even though username and passwords are correct.

🧾 Task 2 – 
Token Generated But Protected Routes Failing
📢 Manager Report
“Users are able to log in successfully and receive a token, but accessing protected routes like /tasks returns ‘Invalid Token’.”
🎯 Expected
Authenticated users should access protected routes successfully.
🛠 Student Objective
Investigate why token verification is failing despite successful login.

🧾 Task 3 – 
Unauthorized Task Creation
📢 Manager Report
“Team members are able to create tasks and assign them to others without admin approval.”
🎯 Expected Behavior
Only users with role admin should be able to create tasks.
Members should not be allowed to create tasks.
🛠 Student Objective
Investigate the /tasks POST API and implement proper role-based authorization.

🧾 Task 4 – 
Users Can See Everyone’s Tasks
📢 Manager Report
“Team members are complaining they can see tasks assigned to other users.”
🎯 Expected Behavior
Admin → Can see all tasks
Member → Should see only tasks assigned to them
🛠 Student Objective
Modify the /tasks API to ensure proper role-based filtering of tasks.


🧾 Task 5 – 
Unauthorized Task Updates
📢 Manager Report
“Team members are updating tasks that are not assigned to them.”
🎯 Expected Behavior
Admin → Can update any task
Assigned user → Can update their task
Other members → Should NOT update
🛠 Student Objective
Fix the authorization logic to ensure only admin or assigned user can update a task.


🧾 Task 6 – 
Delete API Returns Success But Task Still Exists
📢 Manager Report
“System shows ‘Task Deleted Successfully’, but the task still appears in the task list.”
🎯 Expected Behavior
When delete API is called:
Task should be permanently removed from database.
🛠 Student Objective
Investigate why task is not getting deleted despite success response.
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "teamtasktrack.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run("PRAGMA foreign_keys = ON;");

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Register API 
app.post("/users/", async (request, response) => {
  const { username, name, password, role } = request.body;

  const selectUserQuery = `
    SELECT * FROM users WHERE username = '${username}'
  `;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser === undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery = `
      INSERT INTO users (username, name, password, role)
      VALUES (
        '${username}',
        '${name}',
        '${hashedPassword}',
        '${role}'
      )
    `;
    const dbResponse = await db.run(createUserQuery);

    response.send("User Created Successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});


//Login API
app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const selectUserQuery = `
    SELECT * FROM users WHERE username = '${username}'
  `;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = (password === dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
        userId: dbUser.id,
        role: dbUser.role,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");

      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});


//Authentication Middleware
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SECRET_KEY", (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        console.log(payload);
        request.userId = payload.userId;
        request.role = payload.role;
        next();
      }
    });
  } else {
    response.status(401);
    response.send("Invalid JWT Token");
  }
};


//Create Task API
app.post("/tasks/", authenticateToken, async (request, response) => {
  const { title, description, status, assignedTo } = request.body;
  const createTaskQuery = `
    INSERT INTO tasks (title, description, status, assigned_to, created_by)
    VALUES (
      '${title}',
      '${description}',
      '${status}',
      ${assignedTo},
      ${request.userId}
    )
  `;
  await db.run(createTaskQuery);
  response.send("Task Created Successfully");
});



//GET all tasks API
app.get("/tasks/", authenticateToken, async (request, response) => {
  const getTasksQuery = `SELECT * FROM tasks`;
  const tasksList = await db.all(getTasksQuery);
  response.send(tasksList);
});


//Update Task API
app.put("/tasks/:taskId/", authenticateToken, async (request, response) => {
  const { taskId } = request.params;
  const { status } = request.body;

  const getTaskQuery = `
    SELECT * FROM tasks WHERE id = ${taskId}
  `;
  const task = await db.get(getTaskQuery);

  if (task === undefined) {
    response.status(404);
    response.send("Task Not Found");
    return;
  }

  const updateTaskQuery = `
    UPDATE tasks
    SET status = ${status}
    WHERE id = ${taskId}
  `;
  await db.run(updateTaskQuery);

  response.send("Task Updated Successfully");
});


//Delete Task API
app.delete("/tasks/:taskId/", authenticateToken, async (request, response) => {
  const { taskId } = request.params;
  if (request.role !== "admin") {
    response.status(403);
    response.send("Access Denied");
    return;
  }
  const deleteTaskQuery = `
    DELETE FROM tasks WHERE id = ${taskId}
  `;
  await db.get(deleteTaskQuery);
  response.send("Task Deleted Successfully");
});


const express = require("express");
const cors = require("cors");
const pool = require("./db");
let app = express();
app.use(cors());

app.use(express.json());

//routes
//create todo
app.post("/app/v1/tasks", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) returning *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//get todos
app.get("/app/v1/tasks", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todo");
    res.json(todos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get one todo
app.get("/app/v1/tasks/:id", async (req, res) => {
  try {
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [
      req.params.id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//update todo
app.patch("/app/v1/tasks/:id", async (req, res) => {
  try {
    await pool.query("UPDATE todo SET description=$1 WHERE todo_id=$2", [
      req.body.description,
      req.params.id,
    ]);
    res.json("task was updated");
  } catch (error) {
    console.log(error.message);
  }
});
//delete a todo
app.delete("/app/v1/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM todo WHERE todo_id=$1", [req.params.id]);
    res.json("task was DELETED");
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, (err) => {
  if (err) console.log(err);
  console.log("server is running on port 5000");
});

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const publicDirectory = path.join(__dirname, "./public");
app.set("view engine", "hbs");

app.use(express.static(publicDirectory));
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride("_method"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "node-mysql",
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM users_project", (error, result) => {
    if (error) {
      console.log("Error in the query");
    } else {
      res.render("index", {
        data: result,
      });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register/user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  const location = req.body.location;
  const salary = req.body.salary;

  let sql =
    "INSERT INTO users_project SET name = ?, email = ?, password = ?, age = ?, location = ?, salary = ?";
  let user = [name, email, password, age, location, salary];

  db.query(sql, user, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.send("<h1>User Registered</h1");
    }
  });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send({ id });
});

app.put("/editUser/:id", (req, res) => {
  const id = req.params.id;
  let sql = "SELECT * FROM users_project WHERE id= ?";
  
  db.query(sql, id, (error, result) => {
    if (error) {
      console.log("There is an error");
    } else {
      res.render("editUser", {
        data: result,
      });
    }
  });
});

app.put("/editUser/success/:id", (req, res) => {
  console.log(req.params.id);

  const id = req.params.id;
  const name = req.body.editName;
  const email = req.body.editEmail;
  const password = req.body.editPassword;
  const age = req.body.editAge;
  const location = req.body.editLocation;
  const salary = req.body.editSalary;

  let sql = "UPDATE users_project SET name = ?, email = ?, password = ?, age = ?, location = ?, salary = ? WHERE id= ?";
  const user = [name, email, password, age, location, salary];

  db.query(sql, user, (error, result) => {
    if (error) {
      console.log("There is an error");
    } else {
      res.status(200).send("<h1>User Updated</h1>");
    }
  });
});


app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  let sql = "DELETE FROM users_project WHERE id= ?";
  let user = [id];

  db.query(sql, user, (error, result) => {
    if (error) {
      console.log("There is an error");
    } else {
      res.send("<h1>User has been deleted</h1>");
    }
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

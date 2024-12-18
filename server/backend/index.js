const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MYSQLHOST = process.env.MYSQLHOST;
const MYSQLUSER = process.env.MYSQLUSER;
const MYSQLPASS = process.env.MYSQLPASS;
const SQL = "SELECT * FROM users WHERE username = ?;";

const PEPPER = process.env.PEPPER || crypto.randomBytes(2).toString('hex');

const app = express();
app.use(express.json());

let connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});

app.use("/", express.static("frontend"));

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }

  connection.query(SQL, [username], async (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = results[0];
    const saltedPassword = password + user.salt + PEPPER;
    const match = await bcrypt.compare(saltedPassword, user.password_hash);

    if (match) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
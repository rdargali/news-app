const express = require("express");
const app = express();
const PORT = 3000;

//postgres promise
const pgp = require("pg-promise")();
const CONNECTION_STRING = "postgres://localhost:5432/newsdb";
const db = pgp(CONNECTION_STRING);

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//bcrypt
const bcrypt = require("bcrypt");
SALT_ROUNDS = 10;

//mustache
const mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  db.oneOrNone("SELECT userid FROM users WHERE username = $1", [username]).then(
    (user) => {
      if (user) {
        res.render("register", { message: "Username already exists" });
      } else {
        //insert user into users table with hashed password

        bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
          if (error == null) {
            db.none("INSERT INTO users(username, password) VALUES($1, $2)", [
              username,
              hash,
            ]).then(() => {
              res.send("success");
            });
          }
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

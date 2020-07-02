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
app.engine(
  "mustache",
  mustacheExpress(
    "/Users/rawanddargali/Desktop/Repos/news-app/views/partials",
    ".mustache"
  )
);
app.set("views", "./views");
app.set("view engine", "mustache");

//session
const session = require("express-session");
app.use(
  session({
    secret: "totally secret secrey key",
    resave: false,
    saveUninitialized: false,
  })
);

//routes and actions

app.post("/users/delete-article", (req, res) => {
  let articleId = req.body.articleId;
  db.none("DELETE FROM articles WHERE articleid = $1", [articleId]).then(() => {
    res.redirect("/users/articles");
  });
});

app.post("/users/update-article", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let articleId = req.body.articleId;

  db.none("UPDATE articles SET title = $1, body = $2 WHERE articleid = $3", [
    title,
    body,
    articleId,
  ]).then(() => {
    res.redirect("/users/articles");
  });
});

app.get("/users/articles/edit/:articleId", (req, res) => {
  let articleId = req.params.articleId;
  db.one("SELECT articleid,title,body FROM articles WHERE articleid =$1", [
    articleId,
  ]).then((article) => {
    res.render("edit-article", article);
  });
});

app.get("/users/add-article", (req, res) => {
  res.render("add-article");
});

app.post("/users/add-article", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;

  let userId = 4;
  //   let userId = req.session.user.userId;

  db.none("INSERT INTO articles(title,body,userid) VALUES($1,$2,$3)", [
    title,
    body,
    userId,
  ]).then(() => {
    res.redirect("/users/articles");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  db.oneOrNone(
    "SELECT userid, username, password FROM users WHERE username = $1",
    [username]
  ).then((user) => {
    if (user) {
      //check for password
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          //password (and username) matches hashed pw in db
          //put username and password in session
          if (session) {
            req.session.user = {
              userId: user.userid,
              username: user.username,
            };
          }

          res.redirect("/users/articles");
        } else {
          //pw doesn't match
          res.render("login", { message: "Invalid username or password!" });
        }
      });
    } else {
      //if user doesn't exist
      res.render("login", { message: "Invalid username or password!" });
    }
  });
});

app.get("/users/articles", (req, res) => {
  userId = 4;
  //   userId = req.session.user.userId;

  db.any("SELECT articleid,title,body FROM articles WHERE userid = $1", [
    userId,
  ]).then((articles) => {
    res.render("articles", { articles: articles });
  });
});

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

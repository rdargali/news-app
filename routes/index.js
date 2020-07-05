const express = require("express");
const router = express.Router();

//body parser
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));

//bcrypt
const bcrypt = require("bcrypt");
SALT_ROUNDS = 10;

//session
const session = require("express-session");
router.use(
  session({
    secret: "totally super secret key",
    resave: false,
    saveUninitialized: false,
  })
);

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      } else {
        res.redirect("login");
      }
    });
  }
});

// router.get("/", (req, res) => {
//   db.any("SELECT articleid,title,body FROM articles").then((article) => {
//     res.render("index", { articles: article });
//   });
// });

//async await syntax

router.get("/", async (req, res) => {
  let article = await db.any("SELECT articleid,title,body FROM articles");
  res.render("index", { articles: article });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
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

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
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

module.exports = router;

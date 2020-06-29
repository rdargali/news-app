const express = require("express");
const app = express();
const PORT = 3000;

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//mustache init
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

  console.log(username);
  console.log(password);

  res.send("success");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

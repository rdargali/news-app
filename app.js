const express = require("express");
const app = express();
const PORT = 3000;

//mustache init
const mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const app = express();
const PORT = 3000;
const checkAuthorization = require("./utils/checkAuthorization");

//pg promise
const pgp = require("pg-promise")();
const CONNECTION_STRING = "postgres://localhost:5432/newsdb";
db = pgp(CONNECTION_STRING);

//session
const session = require("express-session");
app.use(
  session({
    secret: "totally super secret key",
    resave: false,
    saveUninitialized: false,
  })
);

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//mustache
const mustacheExpress = require("mustache-express");
app.engine(
  "mustache",
  mustacheExpress("/Users/rawanddargali/Desktop/Repos/news-app/views/partials")
);
app.set("views", "./views");
app.set("view engine", "mustache");
app.use("/css", express.static("css"));

//routes and actions

const userRoutes = require("./routes/users");
app.use("/users", checkAuthorization, userRoutes);

const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

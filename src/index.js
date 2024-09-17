const express = require("express");
const path = require("path");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { sequelize, connect } = require("./config/connection");
const helpers = require("./helpers/handlebars");

const app = express();
const port = process.env.PORT || 5001;

connect();

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    helpers: helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: "flashblog",
    saveUninitialized: true,
    resave: true,
    proxy: true, // if you do SSL outside of node.
    cookie: { expires: 300 * 1000 },
    expiration: 300 * 1000, //
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use((err, rep, res, next) => {
  res
    .status(500)
    .json({ code: -1, message: "Something wrong ...", data: { err } });
});

routes(app);

app.listen(port, () => {
  console.log(`Backend Udemy listening on http://localhost:${port}`);
});

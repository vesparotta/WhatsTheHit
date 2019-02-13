require("dotenv").config();

const debug = require("debug")("whatsthehit:app"),
  path = require("path"),
  express = require("express"),
  cors = require("cors"),
  bodyParser = require('body-parser'),
  helmet = require("helmet"),
  logger = require("morgan"),
  createError = require("http-errors"),
  csrf = require('csurf'),
  cookieParser = require("cookie-parser")

const app = express();
const csrfProtection = csrf({ cookie: true });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfProtection);

//impostazioni viste
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

//routing pagine
app.use("/", require("./src/routes/index.js"));

//rest api
app.use("/api", require("./src/routes/api.js"));

//Routing errore 404
app.use((req, res, next) => {
  next(createError(404))
});

//Routing errore 500
app.use((err, req, res, next) => {
  debug(err)

  res.header("Content-Type", "text/html");

  if (process.env.NODE_ENV !== "development") {
    delete err.stack
  }

  // setta variabili da passare al renderer
  res.locals.message = err.message;
  res.locals.error = err;

  // crea la pagina di errore
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
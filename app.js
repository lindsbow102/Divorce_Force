var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path')
  , session = require('express-session')
  , mysql = require('mysql')
  , bodyParser = require("body-parser")
  , db = require("./models");

var PORT = process.env.PORT || 8080;

var app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

connection.connect();

global.db = connection;

// all environments
app.set('port', PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

require("./routes/html-routes.js")(app);
require("./routes/post.js")(app);

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});

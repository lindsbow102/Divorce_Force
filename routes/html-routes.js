// Dependencies
// =============================================================
var path = require("path")
, routes = require('.')
, user = require(path.join(__dirname, "../routes/user"));

module.exports = function (app) {

  app.get("/", function (req, res, next) {

    var user = req.session.user,
      userId = req.session.userId;
    console.log('ddd=' + userId);
    if (userId == null) {
      res.redirect("/login");
      return;
    }

    res.sendFile(path.join(__dirname, "../public/index.html"))

      ;
  });

  // blog route loads blog.html
  app.get("/form", function (req, res) {

    var user = req.session.user,
      userId = req.session.userId;
    console.log('ddd=' + userId);
    if (userId == null) {
      res.redirect("/login");
      return;
    }

    res.sendFile(path.join(__dirname, "../public/form.html"));
  });

  // authors route loads author-manager.html
  app.get("/form2", function (req, res) {

    var user = req.session.user,
      userId = req.session.userId;
    console.log('ddd=' + userId);
    if (userId == null) {
      res.redirect("/login");
      return;
    }

    res.sendFile(path.join(__dirname, "../public/form2.html"));
  });

  app.get('/', routes.index);//call for main index page
  app.get('/signup', user.signup);//call for signup page
  app.get('/login', routes.index);//call for login page
  app.get('/home/logout', user.logout);//call for logout
  app.get('/home/profile', user.profile);//to render users profile
  app.get('/home/dashboard', user.dashboard);//call for dashboard page after login

};


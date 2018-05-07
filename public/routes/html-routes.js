// Dependencies
// =============================================================
var path = require("path");

module.exports = function(app) {

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // blog route loads blog.html
  app.get("/form", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/form.html"));
  });

  // authors route loads author-manager.html
  app.get("/form2", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/form2.html"));
  });

};

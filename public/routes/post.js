// Dependencies
// =============================================================

// Require the models
var db = require("../../models");

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for querying all form submissions
    app.get("/api/posts", function (req, res) {
        console.log('post.js line14');
        var query = {};
        if (req.query.User) {
            query.UserId = req.query.user_id;
        }
        db.form_data.findAll({
        }).then(function (dbPost) {
            
            res.json(dbPost);
        });
    });

    // Get route for retrieving a single form's data
    // app.get("/api/posts/:id", function (req, res) {
    //     // Here we add an "include" property to our options in our findOne query
    //     // We set the value to an array of the models we want to include in a left outer join
    //     db.Post.findOne({
    //         where: {
    //             id: req.params.id
    //         },
    //         include: [db.User]
    //     }).then(function (dbPost) {
    //         res.json(dbPost);
    //     });
    // });

    // POST route for saving a new form submission
    app.post("/api/posts", function (req, res) {
        req.body.formdata = JSON.stringify(req.body);
        db.Post.create(req.body).then(function (dbPost) {
            console.log('post.js-line45');
            res.json(dbPost);
        });
    });

    // DELETE route for deleting posts
    app.delete("/api/posts/:id", function (req, res) {
        db.Post.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbPost) {
            res.json(dbPost);
        });
    });
}
// Dependencies
// =============================================================

// Require the models
var db = require("../models")
, user = require('../routes/user');

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


    //========= POST route for new form submission==========
    app.post("/api/posts", function (req, res) {
        req.body.formdata = JSON.stringify(req.body);
        db.Post.create(req.body).then(function (dbPost) {
            console.log('post.js-line31');

            // ============== FORM CREATION AND FILL SCRIPT =============
            var JSZip = require('jszip');
            var Docxtemplater = require('docxtemplater');
            var db = require("../models");
            var fs = require('fs');
            var path = require('path');

            //Load the docx file as a binary
            var content = fs
                .readFileSync(path.resolve(__dirname, '../public/templates/dissolution.docx'), 'binary');

            var zip = new JSZip(content);

            var doc = new Docxtemplater();
            doc.loadZip(zip);

            var formdata1 = db.Post.findOne({
                where: {
                    id: 1
                },
            }).then(function (dbPost) {
                doc.setData(formdataobj);
                // console.log('DBFORMDATA LINE 21: ' + dbPost.formdata);
                var formdataobj = JSON.parse(dbPost.formdata);
                // console.log('CL LINE 23: ' + formdataobj);
                doc.setData(
                    formdataobj
                );
                console.log('form-post.js line43, document creation script');
                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render()
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({ error: e }));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
                }

                var buf = doc.getZip()
                    .generate({ type: 'nodebuffer' });

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                var timestamp = Date.now();
                //ID FOR FORM FILENAME file-name
                var docPath = 'routes/Output/output' + timestamp + '.docx'
                console.log('Document path: '+ docPath);
                $('#file-name').innerhtml('"href=' + docPath + '"');
                console.log()
                fs.writeFileSync(('routes/Output/output' + timestamp + '.docx'), buf);
            });

            console.log(JSON.stringify(formdata1));

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

    app.post('/signup', user.signup);//call for signup post 

    app.post('/login', user.login);//call for login post
}


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
// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../../models/post.js");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts", function(req, res) {
    var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.User
    db.Post.findAll({
      where: query,
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post's data
  app.get("/api/posts/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};

//FORM FILLER SCRIPT
// =======================================================================================

const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const { fields, fill } = require('pdf-form-fill')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const pdfTemplateDir = process.env.PDF_TEMPLATE_DIR || 'templates'

const onError = (res, error) => {
  if (error.code === 'ENOENT') {
    res.status(404).end()
  } else {
    res.status(500).send(error.message)
  }
}

app.get('/', (req, res) => {
  fs.readdir(pdfTemplateDir, (error, files) => {
    if (error) res.status(500).json(error)
    else res.json(files.filter(fn => /\.pdf$/i.test(fn)))
  })
})

app.get('/:template', (req, res) => {
  const { template } = req.params
  const fn =`${pdfTemplateDir}/${template}`
  fields(fn)
    .then(data => res.json(data))
    .catch(error => onError(res, error))
})

app.post('/:template', (req, res) => {
  const { template } = req.params
  const fn =`${pdfTemplateDir}/${template}`
  let { fields, info } = req.body
  if (typeof fields === 'string') fields = JSON.parse(fields)
  if (info) {
    if (typeof info === 'string') info = JSON.parse(info);
    ['CreationDate', 'ModDate'].forEach(d => {
      if (info[d]) info[d] = info[d] === 'now' ? new Date() : new Date(info[d])
    })
  }
  fill(fn, fields, { info, verbose: true })
    .then(stream => {
      res.setHeader('Content-Type', 'application/pdf')
      stream.pipe(res)
    })
    .catch(error => onError(res, error))
})
//  --  REDUNDANT PORT ASSIGNMENT  --
// const port = Number(process.env.PORT) || 3000
// app.listen(port, () => console.log('pdf-form-fill-server now listening on port', port))
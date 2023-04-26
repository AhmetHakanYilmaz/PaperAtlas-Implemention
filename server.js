var express = require("express");
const cors = require('cors');
var app = express();
var bodyParser = require("body-parser");
var server = require("http").createServer(app);
var port = process.env.PORT || 80;
app.use(
    bodyParser.urlencoded({
        limit: "100mb",
        extended: false,
    })
);

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
  });

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
};
  
app.use(cors(corsOptions));
var databaseController = require("./controllers/database-controllers");
const { isArray } = require("util");

//Functions
function getAuthor(req, res) {
    databaseController.searchByAuthor(req.params.name).then((data) => {
        res.json(data);
    });
}

function getPaper(req, res) {
    databaseController
        .searchByPaper(req.params.name)
        .then((data) => {
            res.json(data);
        });
}

function getNeighbor(req, res) {
    console.log("req.params.name", req.params.title);
    console.log("req.params.name", req.params.lengthLimit);
    databaseController
        .getNeighborOfPaper(req.params.title, req.params.lengthLimit)
        .then((data) => {
            res.json(data);
        });
}

function getAuthorsOfPaper(req, res) {
    console.log("req.params", req.params);
    databaseController.getAuthorsOfPaper(req.params.id).then((data) => {
        res.json(data);
    });
}

//COmments
// Finds the papers that refer the paper with the given id.
function getReferencesOfPaper(req, res) {
    console.log("req.params", req.params);
    databaseController.getReferencesOfPaper(req.params.id).then((data) => {
        res.json(data);
    });
}

function getReferred(req, res) {
    console.log("req.params", req.params);
    databaseController.getReferred(req.params.id).then((data) => {
        res.json(data);
    });
}


function getPapersOfAuthor(req, res) {
    console.log("req.params", req.params);
    databaseController.getPapersOfAuthor(req.params.id).then((data) => {
        res.json(data);
    });
}

function getAuthors(req, res) {
    authorIds = req.body.ids;
    if (!authorIds || !isArray(authorIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getAuthors(authorIds).then((data) => {
        res.json(data);
    });
}

function getPapers(req, res) {
    paperIds = req.body.ids;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapers(paperIds).then((data) => {
        res.json(data);
    });
}

function getAuthorWithPage(req, res) {
  console.log("req.params.pageNo", req.params.pageNo);

  var pageNoInt = parseInt(req.params.pageNo);
  if (pageNoInt > 0) {
    databaseController
      .getAuthorWithPage(req.params.name, pageNoInt)
      .then((data) => {
        res.json(data);
      });
  } else {
    res.status(500).json({ success: false });
  }
}

function getAuthorPageCount(req, res) {
    databaseController
      .getAuthorPageCount(req.params.name)
      .then((data) => {
        res.json(data);
      });
}

//Endpoints
app.get("/search/paper/:name/", getPaper); 
app.get("/search/author/:name/", getAuthor);
app.get("/getNeighbor/:title/:lengthLimit", getNeighbor);
app.get("/getAuthorsOfPapers/:id", getAuthorsOfPaper);
app.get("/getReferences/:id", getReferencesOfPaper);
app.get("/getReferred/:id", getReferred); // Finds the papers that refer the paper with the given id.
app.get("/getPapersOfAuthor/:id", getPapersOfAuthor);
app.put("/add/author", getAuthors);
app.put("/add/paper", getPapers);
app.get("/page/getAuthor/:name/:pageNo", getAuthorWithPage);
app.get("/page/getAuthorPageCount/:name",getAuthorPageCount)

server.listen(port, function() {
    console.log("server listening on port: %d", port);
});

app.use(express.static(__dirname, { dotfiles: "ignore" }));
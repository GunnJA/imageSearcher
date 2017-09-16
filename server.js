// server.js
// where your node app starts

// init project
const key = process.env.KEY;
const cx = process.env.CX;
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const url = require('url');
const dbCollection = "fccsearch";
let offsetDefault = 10;
let database;
let collect;

var google = require('googleapis');
var customsearch = google.customsearch('v1');

// Function to search google images
function imageSearch(q,num) {
  return new Promise(function (resolve, reject) {
    customsearch.cse.list({ cx: cx, q: q, auth: key, searchType: "image", num: num }, function (err, resp) {
      if (err) {
        return console.log('An error occured', err);
      }
      // Got the response from custom search
      console.log('Result: ' + resp.searchInformation.formattedTotalResults);
      resolve(resp);
    });
  });
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//DB functions
mongo.connect("mongodb://gunnja:gunnja@ds131854.mlab.com:31854/fccdb",(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collect = db.collection(dbCollection);
  database = db;
// db.close();
});

function dbInsert(collection,obj,res) {
  collection.insert(obj, function(err, data) {
    if (err) throw err
    database.close;
    res.send({"Shortened URL": "https://urlshortener-10.glitch.me/" + obj.quickID});
  })
}

app.get("/search/:query", function (req, res) {
  const searchQ = req.params.query;
  if (req.query.offset) {
    console.log("offset", req.query.offset);
    console.log("searchQ", searchQ);
    res.send((imageSearch(searchQ,req.query.offset)).items);
  }else {
    console.log("no offset", searchQ);
    res.send((imageSearch(searchQ,offsetDefault)).items);
  }
});

app.get("/urls", function(req, res) {

});
  
// Redirect existing shortened urls
app.get(/\d+/, function (req, res) {

})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
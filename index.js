const express = require("express");
const mongodb = require("mongodb");

const auth = require('./routes/auth');
const user = require('./routes/user');
const category = require('./routes/category');
const words = require('./routes/words');
const records = require('./routes/records');

const app = express();
app.use(require("cors")());
app.use(require("body-parser").json());

const uri = "mongodb+srv://beata111:wirowiro@cluster0.keyagdk.mongodb.net/?retryWrites=true&w=majority";

mongodb.MongoClient.connect(uri, (err, client) => {
  let db = client.db("languages_app_new");

  app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  });

  app.get("/", (req, res) => {
    res.type("text/plain");
    res.status(200);
    res.send("Hallo zusammen");
  });

  // auth
  app.post("/api/create-user", auth.createUser(db));
  app.post("/api/login-user", auth.loginUser(db));

  // user
  app.get("/api/get-user", user.getUser(db));
  app.post("/api/update-user", user.updateUser(db));

  // user-category-status
  app.get("/api/get-category-status", category.geCategory(db));
  app.post("/api/update-category-status", category.updateCategory(client, db));

  // words
  app.get("/api/get-words", words.getWords(db));

  // records
  app.get("/api/get-records", records.getRecords(db));

  app.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send("404 Not found ☕_☕");
  });

  // listen for requests
  app.listen(process.env.PORT || 5678, () => {
    console.log("Your app is listening on port ", process.env.PORT || 5678);
  });
});


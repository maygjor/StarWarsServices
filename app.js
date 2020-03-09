const express = require("express");
const app = express();
const port = 2700;
const mongo = require("mongodb").MongoClient;
const assert = require("assert");
var cors = require("cors");
app.use(cors());
// app.use((req, res, next) => {
//   res.append("Access-Control-Allow-Origin", ["*"]);
//   res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.append("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });
const maxPerSeenObj = [];
// Connection URL
const url =
  "mongodb://candidate:PrototypeRocks123654@ds345028.mlab.com:45028/star-wars";

// Use connect method to connect to the Server

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    this.db = client.db("star-wars");
    if (err) {
      console.error(err);
      return;
    }
    //...
  }
);
///
app.get("/maxCrawlNo", (req, res) => {
  let cursor = this.db.collection("films").find({});
  let max = 0,
    id = null;
  cursor
    .forEach(film => {
      console.log(film.characters.length);
      const size = film.characters.length;
      if (size > max) {
        max = size;
        id = film._id;
      }
    })
    .then(() => {
      let cursor = this.db
        .collection("films")
        .find({ _id: id, characters: max });
      //only one object is sent
      cursor.forEach(c => res.send(c.title));
    });
});
//
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

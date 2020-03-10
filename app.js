const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
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
app.get("/maxPerSeen", async (req, res, callback) => {
  //filter charecters by ID and its appearance count
  let aggregate = this.db
    .collection("films")
    .aggregate([
      { $unwind: "$characters" },
      { $group: { _id: "$characters", count: { $sum: 1 } } },
      { $project: { _id: 1, count: 1 } },
      { $sort: { count: -1 } }
    ]);
  //convert to array
  const filmsArray = await aggregate.toArray();
  //calculate max count
  let maxCount = Math.max.apply(
    Math,
    filmsArray.map(function(o) {
      return o.count;
    })
  );
  let maxAppearance = [];
  console.table(filmsArray);
  filmsArray.forEach(element => {
    if (maxCount == element.count) {
      let joined = maxAppearance.concat(element);
      maxAppearance = joined;
    }
  });
  console.log("Max Appearance people:");
  console.table(maxAppearance);
  //retrieve each person name by ID
  let starsAppeared = [];
  maxAppearance.forEach(async element => {
    let cursor = this.db.collection("people").find({ id: element._id });
    cursor
      .forEach(element => {
        let joined = starsAppeared.concat(element);
        starsAppeared = joined;
      })
      .finally(() => {
        console.log("stars appeared :");
        console.log(JSON.stringify(starsAppeared));
        res.send(starsAppeared);
      });
  });
});
//
app.get("/speciesMax", async (req, res) => {
  //What species appeared in the most number of Star Wars films?
  try {
    let aggregate = this.db.collection("films").aggregate([
      { $unwind: "$species" },
      {
        $group: {
          _id: { title: "$title", specie: "$species" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          specie: "$_id.specie",
          movie: "$_id.title"
        }
      },
      { $group: { _id: { specie: "$specie" }, movies: { $push: "$movie" } } },
      {
        $project: {
          _id: 0,
          specie: "$_id.specie",
          movies: "$movies",
          count: { $size: "$movies" }
        }
      },
      {
        $lookup: {
          from: "species",
          localField: "specie",
          foreignField: "id",
          as: "speciesAppeared"
        }
      },
      { $unwind: "$speciesAppeared" },
      {
        $group: {
          _id: {
            specieId: "$specie",
            specieName: "$speciesAppeared.name",
            appearCount: "$count"
          }
        }
      },
      {
        $project: {
          _id: 0,
          specieId: "$_id.specieId",
          specieName: "$_id.specieName",
          appearCount: "$_id.appearCount"
        }
      },
      { $sort: { appearCount: -1 } }
    ]);
    let result = await aggregate.toArray();
    res.send(result);
  } catch (e) {}
});
//
app.get("/planetWithMaxPilot", async (req, res) => {
  try {
    let aggregate = this.db.collection("vehicles").aggregate([
      {
        $group: { _id: { vehicleId: "$id", pilotId: "$pilots" } }
      },
      {
        $project: { vehicleId: "$_id.vehicleId", pilotId: "$_id.pilotId" }
      },
      {
        $lookup: {
          from: "people",
          localField: "pilotId",
          foreignField: "id",
          as: "peopleObj"
        }
      },
      {
        $project: {
          _id: 0,
          vehicleId: 1,
          pilotId: "$_id.pilotId",
          pilotName: "$peopleObj.name",
          homeworld: "$peopleObj.homeworld"
        }
      },
      {
        $lookup: {
          from: "planets",
          localField: "homeworld",
          foreignField: "id",
          as: "planetsObj"
        }
      },
      {
        $unwind: "$planetsObj"
      },
      {
        $group: {
          _id: {
            pilotId: "$pilotId",
            pilotName: "$pilotName",
            homeworld: "$homeworld",
            planet: "$planetsObj.name",
            planet_id: "$planetsObj.id"
          }
        }
      },
      {
        $project: {
          _id: 0,
          pilotId: "$_id.pilotId",
          pilotName: "$_id.pilotName",
          homeworld: "$_id.homeworld",
          planet: "$_id.planet",
          planetPilotsCount: { $size: "$_id.pilotName" },
          planet_id: "$_id.planet_id"
        }
      },
      {
        $lookup: {
          from: "species",
          localField: "planet_id",
          foreignField: "homeworld",
          as: "speciesObj"
        }
      },
      {
        $lookup: {
          from: "species",
          localField: "pilotId",
          foreignField: "people",
          as: "speciesObj2"
        }
      },
      //species collection is missing references , I RE-lookup the species with 2 deferant keys references to retrieve the maximum specie record for each pilot and merged into one array
      {
        $addFields: {
          speciesObj: { $concatArrays: ["$speciesObj", "$speciesObj2"] }
        }
      },
      {
        $group: {
          _id: {
            pilotId: "$pilotId",
            pilotName: "$pilotName",
            homeworld: "$homeworld",
            planet: "$planet",
            planetPilotsCount: "$planetPilotsCount",
            planet_id: "$planet_id",
            specie: "$speciesObj.name"
          }
        }
      },
      {
        $project: {
          _id: 0,
          planet: "$_id.planet",
          pilotId: "$_id.pilotId",
          pilotName: "$_id.pilotName",
          homeworld: "$_id.homeworld",
          planetPilotsCount: "$_id.planetPilotsCount",
          planet_id: "$_id.planet_id",
          specie: "$_id.specie"
        }
      },
      { $sort: { planetPilotsCount: -1 } }
    ]);
    let result = await aggregate.toArray();
    console.table(result);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});
//
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

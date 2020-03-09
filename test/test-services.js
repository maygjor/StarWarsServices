var expect = require("chai").expect;
var request = require("request");

it("Which of all Star Wars movies has the longest opening crawl (counted by number of characters)?", function(done) {
  request("http://localhost:2700/maxCrawlNo", function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("What character (person) appeared in most of the Star Wars films?", function(done) {
  request("http://localhost:2700/maxPerSeen", function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("What species (i.e. characters that belong to certain species) appeared in the most number of Star Wars films?", function(done) {
  request("http://localhost:2700/speciesMax", function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("What planet in Star Wars universe provided largest number of vehicle pilots?", function(done) {
  request("http://localhost:2700/planetWithMaxPilot", function(
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

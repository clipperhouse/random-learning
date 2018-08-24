var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var videos = [];
  for (var i = 0; i < 6; i++) {
    videos.push(getRandom());
  }

  const data = {
    title: "Random Learning",
    videos: videos
  };
  res.render("index", data);
});

module.exports = router;

const fs = require("fs");
const json = fs.readFileSync("data/khan.json");
const videos = JSON.parse(json);
const count = videos.length;

function getRandom() {
  const i = Math.floor(Math.random() * Math.floor(count));
  return videos[i];
}

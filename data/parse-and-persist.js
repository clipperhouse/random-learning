(function() {
  function iterate(obj, acc) {
    if (isArray(obj)) {
      obj.forEach(element => {
        iterate(element, acc);
      });
    } else {
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] === "object") {
            iterate(obj[property], acc);
          } else {
            if (property === "content_kind" && obj[property] === "Video") {
              if (obj["description"] < 16) {
                continue;
              }
              if (
                obj["image_url"] ===
                "https://cdn.kastatic.org/googleusercontent/ZCdwTudJg6e6n-P2gsaUborP4izvMsGo71pvEVlX9dNYWcLXcP7VHkWpn2grt4TUP1KoJLQP9NswyHBuBLSFTBw"
              ) {
                continue;
              }

              const result = {
                title: obj["title"],
                description: obj["description"],
                url: obj["ka_url"],
                image_url: obj["image_url"],
                favicon_url: "https://www.khanacademy.org/favicon.ico",
                site: "Khan Academy",
                site_class: "khan",
                authors: obj["author_names"].join(", "),
                duration: time(obj["duration"]) + " minutes"
              };
              acc.push(result);
            }
          }
        }
      }
    }
  }

  function isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  }

  function time(secs) {
    return Math.round(secs / 60);
  }

  const fs = require("fs");
  const json = fs.readFileSync("topictree.f.json");
  const topictree = JSON.parse(json);

  var results = [];
  iterate(topictree, results);

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const rand = getRandomInt(results.length - 1);
  console.log("var thing = " + results[rand]);

  const jsonOut = JSON.stringify(results, null, 2);
  fs.writeFileSync("khan.json", jsonOut);
})();

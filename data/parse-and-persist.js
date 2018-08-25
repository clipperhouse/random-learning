(function() {
  function iterate(obj, acc) {
    if (isArray(obj)) {
      obj.forEach(element => {
        iterate(element, acc);
      });
    } else {
      let video = getFirstTopicVideo(obj);

      if (video == null) {
        for (let property in obj) {
          if (!obj.hasOwnProperty(property)) {
            continue;
          }

          if (typeof obj[property] === "object") {
            iterate(obj[property], acc);
          }
        }
      } else {
        acc.push(video);
      }
    }
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }

  function getFirstTopicVideo(obj) {
    if (!obj) {
      return null;
    }

    if (obj["content_kind"] !== "Topic") {
      return null;
    }

    let children = obj["children"];
    if (!children || !isArray(children)) {
      return null;
    }

    let first = children[0];
    if (!first) {
      return null;
    }
    if (first["content_kind"] !== "Video") {
      return null;
    }

    if (
      first["image_url"] ===
      "https://cdn.kastatic.org/googleusercontent/ZCdwTudJg6e6n-P2gsaUborP4izvMsGo71pvEVlX9dNYWcLXcP7VHkWpn2grt4TUP1KoJLQP9NswyHBuBLSFTBw"
    ) {
      return null;
    }

    return {
      title: first["title"],
      description: first["description"],
      url: first["ka_url"],
      image_url: first["image_url"],
      favicon_url: "https://www.khanacademy.org/favicon.ico",
      site: "Khan Academy",
      site_class: "khan",
      authors: first["author_names"].join(", "),
      duration: time(first["duration"]) + " minutes"
    };
  }

  function time(secs) {
    return Math.round(secs / 60);
  }

  let fs = require("fs");
  let json = fs.readFileSync("topictree.f.json");
  let topictree = JSON.parse(json);

  let results = [];
  iterate(topictree, results);

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  console.log("found " + results.length);
  let rand = getRandomInt(results.length - 1);
  console.log(results[rand]);

  const jsonOut = JSON.stringify(results, null, 2);
  fs.writeFileSync("khan.json", jsonOut);
})();

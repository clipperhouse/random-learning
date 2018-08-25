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

  const default_img =
    "https://cdn.kastatic.org/googleusercontent/ZCdwTudJg6e6n-P2gsaUborP4izvMsGo71pvEVlX9dNYWcLXcP7VHkWpn2grt4TUP1KoJLQP9NswyHBuBLSFTBw";

  function getFirstTopicVideo(obj) {
    if (!obj) {
      return null;
    }

    if (obj["content_kind"] !== "Topic") {
      return null;
    }

    let topic = obj;

    let children = topic["children"];
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

    let video = first;

    if (default_img === video["image_url"]) {
      return null;
    }

    return {
      title: topic["title"],
      description: video["description"],
      url: video["ka_url"],
      image_url: video["image_url"],
      favicon_url: "https://www.khanacademy.org/favicon.ico",
      site: "Khan Academy",
      site_class: "khan",
      authors: video["author_names"].join(", "),
      duration: time(video["duration"]) + " minutes"
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

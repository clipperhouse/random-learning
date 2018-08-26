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
    // We want this first video for Topic → Topic → Video

    if (!obj) {
      return null;
    }

    if (obj["content_kind"] !== "Topic") {
      return null;
    }

    if (!publish(obj)) {
      return null;
    }

    // We know we're on a Topic node
    let topic = obj;

    if (!topicOK(topic["title"])) {
      return null;
    }

    // If no Topic children, never mind
    let topic_children = topic["children"];
    if (!topic_children || !isArray(topic_children)) {
      return null;
    }

    let subtopic = topic_children[0];
    if (!subtopic) {
      return null;
    }
    if (subtopic["content_kind"] !== "Topic") {
      return null;
    }
    if (!publish(subtopic)) {
      return null;
    }

    // If no Video children, never mind
    let video_children = subtopic["children"];
    if (!video_children || !isArray(video_children)) {
      return null;
    }

    let video = video_children[0];
    if (!video) {
      return null;
    }
    if (video["content_kind"] !== "Video") {
      return null;
    }
    if (!publish(video)) {
      return null;
    }

    // Choose those with a real preview
    if (default_img === video["image_url"]) {
      return null;
    }

    return {
      title: topic["title"],
      description: video["title"],
      url: topic["ka_url"] + "/modal/v/" + video["slug"],
      image_url: video["image_url"],
      favicon_url: "https://www.khanacademy.org/favicon.ico",
      site: "Khan Academy",
      site_class: "khan",
      authors: video["author_names"].join(", "),
      duration: time(video["duration"]) + " minutes"
    };
  }

  const module = /^Module/;
  const nums = /^\d+\./;

  function topicOK(title) {
    return !module.test(title) && !module.test(nums);
  }

  function publish(obj) {
    let deleted = obj["deleted"];
    if (deleted && deleted === true) {
      return false;
    }

    let do_not_publish = obj["do_not_publish"];
    if (do_not_publish && do_not_publish === true) {
      return false;
    }

    return true;
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

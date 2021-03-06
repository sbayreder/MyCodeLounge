const axios = require("axios");
const dotenv = require("dotenv");

async function runAxios(searchTopic, element) {
  return axios
    .get(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" +
        searchTopic +
        "&type=video&key=" +
        element
    )
    .then((response) => {
      let results = [];
      let videos = response.data.items;

      for (let x = 0; x <= 4; x++) {
        let randomIndex = Math.floor(Math.random() * videos.length);
        results.push({
          title: videos[randomIndex].snippet.title,
          description: videos[randomIndex].snippet.description,
          image: videos[randomIndex].snippet.thumbnails.medium.url,
          link: videos[randomIndex].id.videoId,
        });
        videos.splice(randomIndex, 1);
      }
      return { results: results, success: true };
    })
    .catch((err) => {
      console.log(
        "Request failed with API key: " + element + "and Error Code: " + err
      );
      return { results: [], success: false };
    });
}

module.exports = {
  getVideos: async function (req, res) {
    let successFlag = false;
    let results = [];
    dotenv.config();
    const searchTopic = req.query.topic
      ? req.query.topic.replace(/\s/, "%20")
      : "full%20stack%20development";
    const YTAPI = process.env.YOUTUBE_API_KEY.split(",");
    for (let x = 0; x < YTAPI.length; x++) {
      if (!successFlag) {
        // eslint-disable-next-line no-loop-func
        await runAxios(searchTopic, YTAPI[x]).then((res) => {
          if (res.success) {
            successFlag = true;
            results = res.results;
          }
        });
      }
    }
    if (successFlag) return res.json(results);
  },
};

// const db = require("../models");
const axios = require("axios");
const { query } = require("express");

module.exports = {
  // find all books
  askQuestion: function (req, res) {
    console.log("in askQuestion");
    let question = req.query.question.replace(/\s/g, "%20");
    let queryUrl = "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=" + question + "&site=stackoverflow&accepted=True"

    axios.get(queryUrl).then((response) => {
      let answers = response.data.items;
      let results = [];
      for (let x = 0 ; x <= 4 ; x++ ) {
        results.push({
          title: answers[x].title,
          description: "Answer to question: " + req.query.question,
          image: false,
          link: answers[x].link
        });
      }
      res.json(results);
    });
  },
};
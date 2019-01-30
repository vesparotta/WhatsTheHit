const debug = require("debug")("whatsthehit:api"),
  wdk = require("wikidata-sdk"),
  rp = require('request-promise'),
  { getCode, getName } = require('country-list'),
  CountryLanguage = require('country-language');


module.exports = (req, res, next) => {
  var nome = unescape(req.query.name)

  var lang = "it"

  var url = wdk.searchEntities({
    search: nome,
    limit: 1,
    language: "it",
    format: 'json'
  })

  rp(url)
    .then((response) => {
      var id

      if (JSON.parse(response).search[0]) {
        id = JSON.parse(response).search[0].id
      } else {
        throw new Error('error');
      }
      var options = {
        "ids": id,
        "languages": lang,
      }
      return options
    })
    .then(opt => {
      return wdk.getEntities(opt)
    })
    .then(rp)
    .then(response => {
      var entities = wdk.simplify.entities(JSON.parse(response).entities)
      var entity = Object.keys(entities)[0].toString()

      var id = entities[entity].claims.P18.toString().split(",");

      if (id === "undefined") {
        throw new Error();
      }

      var options = {
        "ids": id,
        "languages": lang,
      }
      return options
    })
    .then(opt => {
      return wdk.getEntities(opt)
    })
    .then(rp)
    .then((response) => {

      var entities = wdk.simplify.entities(JSON.parse(response).entities)
      var entity = Object.keys(entities)[0].toString()

      var result = entities[entity]
      res.send(result)
    })
    .catch(error => {
      res.render("error")
    })
}
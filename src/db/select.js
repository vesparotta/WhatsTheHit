const debug = require("debug")("whatsthehit:api/select"),
  createError = require("http-errors"),
  knex = require("../config/knex.js"),
  isEqual = require("shallow-equal/arrays")

module.exports = (req, res, next) => {
  var query = knex.queryBuilder();

  //FROM
  if (req.body.from) {
    if (Array.isArray(req.body.from)) {
      if (req.body.from.length == 2) {
        if (isEqual(req.body.from, ["artista", "canzone"]) || isEqual(req.body.from, ["canzone", "artista"])) {
          query.from("artista")
            .join("associazione_artista_canzone", "artista.id", "associazione_artista_canzone.artista_id")
            .join("canzone", "canzone.id", "associazione_artista_canzone.canzone_id");

        } else if (isEqual(req.body.from, ["artista", "album"]) || isEqual(req.body.from, ["album", "artista"])) {
          query.from("artista")
            .join("associazione_artista_album", "artista.id", "associazione_artista_album.artista_id")
            .join("album", "album.id", "associazione_artista_album.album_id");
        }
      } else if (req.body.from.length == 3) {
        if (isEqual(req.body.from.slice().sort(), ["album", "artista", "canzone"])) {
          query.from("artista")
            .join("associazione_artista_canzone", "artista.id", "associazione_artista_canzone.artista_id")
            .join("canzone", "canzone.id", "associazione_artista_canzone.canzone_id")
            .join("associazione_artista_album", "artista.id", "associazione_artista_album.artista_id")
            .join("album", "album.id", "associazione_artista_album.album_id");
        }
      }
    } else {
      query = knex.from(req.body.from);
    }
  }

  //SELECT
  if (req.body.select) {
    query.select(req.body.select);
  } else {
    query.select();
  }

  //WHERE
  if (req.body.where) {
    var dove = req.body.where;

    for (var key in dove) {
      if (Array.isArray(dove[key])) {
        query.whereBetween(key.toString(), dove[key])
      } else {
        var valore = dove[key].toString();

        if (valore.substring(0, 1) == ">=" || valore.substring(0, 1) == "<=") {
          query.where(key, valore.substring(0, 1), valore.substring(2))
        } else if (valore[0] == ">" || valore[0] == "<") {
          query.where(key, valore[0], valore.substring(1))
        } else {
          query.where(key, dove[key])
        }
      }
    }
  }

  //ORDER BY
  if (req.body.orderby) {
    if (req.body.desc) {
      query.orderBy(req.body.orderby, "desc")
    } else {
      query.orderBy(req.body.orderby)
    }
  }

  //LIMIT
  if (req.body.limit) {
    query.limit(req.body.limit)
  }

  //ESECUZIONE
  query.then((rows) => {
    if (req.body.debug = "true") {
      var querypulita = query.toString().toUpperCase().replace(/\"/gi, "");
      rows.unshift(querypulita);
    }
    res.send(rows)
  }).catch((err) => {
    debug(query.toString().toUpperCase())
    next(createError(err.stack));
  });
};
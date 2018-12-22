const express = require('express'),
  router = express.Router()

router.get("/", (req, res, next) => {
  res.header("Content-Type", "text/html");
  res.sendFile(path.resolve("./app/dist/index.html"));
});

module.exports = router;
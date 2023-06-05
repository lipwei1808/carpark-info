const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("free parking");
  res.send("hi there");
});

module.exports = router;

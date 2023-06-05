const express = require("express");
const router = express.Router();

const Carpark = require("../models/carpark");

router.get("/", async (_, res) => {
  let carparks;
  try {
    carparks = await Carpark.findAll({
      where: {
        night_parking: "YES",
      },
    });
  } catch (e) {
    res.status(500).json({ message: "An error occured" });
    return;
  }
  res.status(200).json({ data: carparks });
});

module.exports = router;

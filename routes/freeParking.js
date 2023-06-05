const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const Carpark = require("../models/carpark");

router.get("/", async (_, res) => {
  let freeCarparks;
  try {
    freeCarparks = await Carpark.findAll({
      where: {
        free_parking: {
          [Op.not]: "NO",
        },
      },
    });
  } catch (e) {
    res.status(500).json({ message: "An error occured" });
    return;
  }

  res.status(200).json({ data: freeCarparks });
});

module.exports = router;

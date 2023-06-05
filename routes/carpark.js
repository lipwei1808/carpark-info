const express = require("express");
const Carpark = require("../models/carpark");

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieves a list of carparks
 *     parameters:
 *       - in: query
 *         name: height
 *         schema:
 *          type: integer
 *         required: false
 *         description: Height of your car
 *     responses:
 *      200:
 *        description: ok
 */
router.get("/", async (req, res) => {
  let carparks;
  if (req.query.height) {
    carparks = await Carpark.findAll({
      where: {
        [Op.or]: [
          { gantry_height: { [Op.gt]: +req.query.height } },
          { gantry_height: 0 },
        ],
      },
    });
  } else {
    carparks = await Carpark.findAll();
  }
  res.status(200).json({ data: carparks });
});

module.exports = router;

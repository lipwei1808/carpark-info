const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Carpark = require("../models/carpark");

router.get("/", async (_, res) => {
  let users;
  try {
    users = await User.findAll({});
  } catch (e) {
    res.status(500).json({ message: "An error occured" });
    return;
  }
  res.status(200).json({ data: users });
});

router.post("/", async (_, res) => {
  const user = await User.create({});

  res.status(200).json({ data: user });
});

router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    where: { id: +req.params.id },
    include: Carpark,
  });

  res.status(200).json({ data: user });
});

router.post("/favourite", async (req, res) => {
  console.log(req.body);
  const userId = +req.body.userId;
  const carparkId = +req.body.carparkId;
  const user = await User.findOne({ where: { id: userId } });
  console.log(user, userId);
  const carpark = await Carpark.findOne({ where: { id: carparkId } });
  await user.addCarparks(carpark);
  res.status(200).json({
    message: "success",
    data: {
      user,
      carpark,
    },
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Carpark = require("../models/carpark");

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Retrieves all users
 */
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 */
router.post("/", async (_, res) => {
  const user = await User.create({});

  res.status(200).json({ data: user });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id of user to retrieve
 *     responses:
 *       200:
 *         description: ok
 */
router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    where: { id: +req.params.id },
    include: Carpark,
  });

  res.status(200).json({ data: user });
});

/**
 * @swagger
 * /users/favourite:
 *   post:
 *     summary: Sets a carpark as a user's favourite
 *     requestBody:
 *       description: Contains userId for user that is adding a carpark to favourite
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              carparkId:
 *                type: string
 *            required:
 *              - userId
 *              - carparkId
 *
 *     responses:
 *       200:
 *         description: ok
 */
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

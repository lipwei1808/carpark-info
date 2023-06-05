const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const sequelize = require("./utils/db");
const helper = require("./utils/helper");

const Carpark = require("./models/carpark");
const User = require("./models/user");
require("./models/userCarpark");

const carparkRouter = require("./routes/carpark");
const freeParkingRouter = require("./routes/freeParking");
const nightParkingRouter = require("./routes/nightParking");
const userRouter = require("./routes/user");

const app = express();
const port = 8000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Carpark App",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(bodyParser.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log("ERROR");
  });

User.belongsToMany(Carpark, {
  through: "User_Carparks",
});
Carpark.belongsToMany(User, {
  through: "User_Carparks",
});

//send email after 5 seconds
cron.schedule("*/5 * * * * *", function () {
  const today = new Date();
  // get current date
  const date = ("0" + today.getDate()).slice(-2);

  // get current month
  const month = ("0" + (today.getMonth() + 1)).slice(-2);

  // get current year
  const year = today.getFullYear();
  let todayDate = `${year}${month}${date}`;
  todayDate = "20220824";
  const fileName = `hdb-carpark-information-${todayDate}010400.csv`;
  if (fs.existsSync(`./data/${fileName}`)) {
    console.log("Attempt");
    helper.uploadCsv(fileName);
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
app.get("/", carparkRouter);

app.use("/freeParking", freeParkingRouter);

app.use("/nightParking", nightParkingRouter);

app.use("/users", userRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

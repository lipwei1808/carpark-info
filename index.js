const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const csv = require("fast-csv");
const bodyParser = require("body-parser");

const sequelize = require("./utils/db");

const Carpark = require("./models/carpark");
const User = require("./models/user");
const UserCarpark = require("./models/userCarpark");

const freeParkingRouter = require("./routes/freeParking");
const nightParkingRouter = require("./routes/nightParking");
const userRouter = require("./routes/user");

const app = express();
const port = 8000;

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

function uploadCsv(uriFile) {
  let stream = fs.createReadStream(`./data/${uriFile}`);
  let csvDataColl = [];
  console.log("uploading csv");
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      csvDataColl.shift();
      csvDataColl.push({
        car_park_no: data[0],
        address: data[1],
        x_coord: data[2],
        y_coord: data[3],
        car_park_type: data[4],
        type_of_parking_system: data[5],
        short_term_parking: data[6],
        free_parking: data[7],
        night_parking: data[8],
        car_park_decks: data[9],
        gantry_height: data[10],
        car_park_basement: data[11],
      });
    })
    .on("end", async function () {
      const transaction = await sequelize.transaction();
      try {
        await Carpark.bulkCreate(csvDataColl, { transaction, logging: false });
        await transaction.commit();
        fs.rename(`./data/${uriFile}`, `./archives/${uriFile}`, (err) => {
          if (err) {
            console.log("ersror shifting file to archive");
          }
        });
      } catch (e) {
        await transaction.rollback();
        console.log("error occured", e);
      }
    });

  stream.pipe(fileStream);
}

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
    uploadCsv(fileName);
  }
});

app.get("/", async (req, res) => {
  const carparks = await Carpark.findAll();
  await User.create({
    Parent_parentId: "935c587f-86ab-4acb-aa11-c63abc2d800e",
  });
  res.status(200).json({ data: carparks });
});

app.use("/freeParking", freeParkingRouter);

app.use("/nightParking", nightParkingRouter);

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

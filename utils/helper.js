const csv = require("fast-csv");
const fs = require("fs");

const Carpark = require("../models/carpark");
const sequelize = require("./db");

function uploadCsv(uriFile) {
  let stream = fs.createReadStream(`./data/${uriFile}`);
  let csvDataColl = [];
  console.log("uploading csv");
  let fileStream = csv
    .parse()
    .on("data", function (data) {
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
      csvDataColl.shift();
      const transaction = await sequelize.transaction();
      try {
        await Carpark.bulkCreate(csvDataColl, { transaction });
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

module.exports = { uploadCsv: uploadCsv };

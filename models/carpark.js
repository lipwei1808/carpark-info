const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./user");

const Carpark = sequelize.define(
  "Carpark",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    car_park_no: {
      type: DataTypes.TEXT,
    },
    address: DataTypes.TEXT,
    x_coord: DataTypes.TEXT,
    y_coord: DataTypes.TEXT,
    car_park_type: DataTypes.TEXT,
    type_of_parking_system: DataTypes.TEXT,
    short_term_parking: DataTypes.TEXT,
    free_parking: DataTypes.TEXT,
    night_parking: DataTypes.TEXT,
    car_park_decks: DataTypes.TEXT,
    gantry_height: DataTypes.TEXT,
    car_park_basement: DataTypes.TEXT,
  },
  { timestamps: false, initialAutoIncrement: 1000 }
);

Carpark.sync().then(() => {
  console.log("Carpark table created");
});
module.exports = Carpark;

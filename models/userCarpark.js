const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Carpark = require("./carpark");
const User = require("./user");

const User_Carpark = sequelize.define("User_Carpark", {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  CarparkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Carpark,
      key: "id",
    },
  },
});

User_Carpark.sync().then(async () => {
  console.log("UserCarpark model created");
});

module.exports = User_Carpark;

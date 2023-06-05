const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    initialAutoIncrement: 1,
  }
);

User.sync({ force: true }).then(async () => {
  console.log("User model created");
  await User.create({});
});

module.exports = User;

// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
// Connect to the database 
const client = mongoose
  .connect('mongodb+srv://manshibisen03:u1xJZsUA6GR971dQ@cluster0.m0teumi.mongodb.net/mediDB', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("Error: ", error);

    return error;
  });
module.exports = client;

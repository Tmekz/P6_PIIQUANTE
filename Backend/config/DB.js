// Importation du package mongoose
const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://" +
        process.env.MONGO_DB_USER +
        ":" +
        process.env.MONGO_DB_USER_MDP +
        process.env.MONGO_DB_SRV,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));
};

module.exports = connectDB;

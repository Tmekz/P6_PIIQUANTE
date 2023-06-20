// Importation du package mongoose
const mongoose = require("mongoose");

// Importation du package mongoose-unique-validator 
const uniqueValidator = require("mongoose-unique-validator");

// création de schéma de connection d'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// utilisation du plugin unique au schema avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// Exportation du Schema
module.exports = mongoose.model("User", userSchema);

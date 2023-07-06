// Importation du package mongoose
const mongoose = require("mongoose");

// Importation du package mongoose-unique-validator pour s'assurer que l'email est unique mais également pour faciliter la gestion des erreurs de la BDD
const uniqueValidator = require("mongoose-unique-validator");

// nous créons un schéma de données qui contient les champs souhaités pour chaque User, indique leur type ainsi que leur caractère (obligatoire ou non). Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. ;
// ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « User », le rendant par là même disponible pour notre application Express.

// création de schéma de connection d'utilisateur
// Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, on s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// utilisation du plugin unique au schema avant d'en faire un modèle.
// mongoose-unique-validator améliore les messages d'erreur lors de l'enregistrement de données uniques.
userSchema.plugin(uniqueValidator);

// Exportation du Schema
module.exports = mongoose.model("User", userSchema);

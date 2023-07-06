const mongoose = require("mongoose");

// nous créons un schéma de données qui contient les champs souhaités pour chaque Sauce, indique leur type ainsi que leur caractère (obligatoire ou non). Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. ;
// ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

module.exports = mongoose.model("Sauce", sauceSchema);

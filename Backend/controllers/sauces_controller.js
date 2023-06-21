const Sauce = require("../models/Sauce_model");

// Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const initialisation = {
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  };
  const sauce = new Sauce({
    ...sauceObject,
    ...initialisation,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() =>
      res
        .status(201)
        .json({ message: "Nouvelle sauce enregistrée !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Afficher toutes les sauces grace au paramètre find de express
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error }));
};

// Afficher une seule sauce grace au paramètre findone de express (on récupère l'ID dans l'url)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json({ message: "Sauce supprimée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifyOneSauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Like ou dislike une sauce
exports.likeOnesauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

const Sauce = require("../models/Sauce_model");

// fs  signifie « file system ».Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require("fs");

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
      res.status(201).json({ message: "Nouvelle sauce enregistrée !" })
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
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // On s'assure que seul le créateur puisse supprimer la sauce
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json("Not authorized");
      } else {
        // On supprime la sauce mais également le fichier image présent dans le dossier
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modifier une sauce
exports.modifyOneSauce = (req, res, next) => {
  // Si fichier présent. Nous récupérons l'image en parsant la chaine de caractère en récréant l'URL
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      } //si fichier pas présent alors on récupère juste le corps de la requete
    : { ...req.body };

  // Mesure de sécurité nous supprimons l'user ID pour éviter que quelqu'un créer un objet à son nom et le réassigne à quelqu'un d'autre
  delete sauceObject._userId;

  // On récupère l'objet avec l'id
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // On s'assure que seulement le créateur puisse modifier
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Like ou dislike une sauce
exports.likeOnesauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

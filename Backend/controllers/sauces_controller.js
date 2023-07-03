const Sauce = require("../models/Sauce_model");
const multer = require("../middlewares/multer-config");

// fs  signifie « file system ».Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require("fs");

// Afficher toutes les sauces grace au paramètre find de express
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Afficher une seule sauce grace au paramètre findone de express (on récupère l'ID dans l'url)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  // Regex pour correspondre aux extensions autorisées
  const allowedExtensionsRegex = /\.(jpeg|png|bmp|gif|ico|svg|tiff|tif|webp)$/i;
  // Vérification de l'extension du fichier
  const fileName = req.file.filename;
  const fileExtension = fileName.match(allowedExtensionsRegex);
  if (!fileExtension) {
    return res.status(400).json({
      error:
        "Seuls les formats jpeg, png, bmp, gif, ico, svp, tiff, tif et webp sont autorisés.",
    });
  }

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${fileName}`,
    likes: 0,
    dislikes: 0,
  });

  // sauceObject.userId ===  à l'id du créateur de la sauce
  // req.auth.userId === à l'id de celui qui fait la demande
  if (sauceObject.userId === req.auth.userId) {
    sauce
      .save()
      .then(() =>
        res.status(201).json({ message: "Nouvelle sauce enregistrée !" })
      )
      .catch((error) => {
        console.log(json({ error }));
        res.status(400).json({ error });
      });
  } else {
    return res.status(403).json("Requête non autorisée.");
  }
};

// Modifier une sauce
exports.modifyOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Vérification si la sauce existe
    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée." });
    }
    // Vérification de l'utilisateur qui souhaite effectuer la modification
    if (sauce.userId === req.auth.userId) {
      // si l'utilisateur modifie l'image alors
      if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
              const sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`,
              };
              Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
              )
                .then(() =>
                  res.status(200).json({ message: "Sauce modifiée!" })
                )
                .catch((error) => res.status(400).json({ error }));
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
      // si l'utilisateur de modifie pas l'image alors nous modififions seulement le reste
      else {
        const sauceObject = { ...req.body };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    } else {
      return res.status(403).json("Requête non autorisée.");
    }
  });
};

// Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // sauce.userId ===  à l'id du créateur de la sauce
      // req.auth.userId === à l'id de celui qui fait la demande
      if (sauce.userId === req.auth.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        return res.status(403).json("unauthorized request");
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Like ou dislike une sauce
exports.likeOneSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // nouvelles valeurs à modifier
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      // Différents cas:
      switch (like) {
        case 1: // CAS: sauce liked
          newValues.usersLiked.push(userId);
          break;
        case -1: // CAS: sauce disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0: // CAS: Annulation du like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // si on annule le like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // si on annule le dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, newValues)
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

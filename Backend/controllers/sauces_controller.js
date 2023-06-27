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
// sauceObject.userId ===  à l'id du créateur de la sauce
// req.auth.userId === à l'id de celui qui fait la demande
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  // Tableau des champs requis avec validation minimale de 4 caractères
  const requiredFields = [
    { field: "name", minLength: 2 },
    { field: "manufacturer", minLength: 2 },
    { field: "description", minLength: 5 },
    { field: "mainPepper", minLength: 2 },
  ];

  // Vérification des champs requis
  const missingFields = requiredFields.filter((field) => {
    const fieldValue = sauceObject[field.field];
    return !fieldValue || fieldValue.trim().length < field.minLength;
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Les champs suivants sont requis avec un minimum de ${
        missingFields[0].minLength
      } caractères : ${missingFields.map((field) => field.field).join(", ")}`,
    });
  }

  // Vérification de la valeur de heat
  if (sauceObject.heat < 1 || sauceObject.heat > 10) {
    return res
      .status(400)
      .json({ error: "Le champ heat doit être compris entre 1 et 10." });
  }

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

// Supprimer une sauce
// sauce.userId ===  à l'id du créateur de la sauce
// req.auth.userId === à l'id de celui qui fait la demande
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
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

// Modifier une sauce
exports.modifyOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Vérification de l'utilisateur qui souhaite effectuer la modification
    if (sauce.userId === req.auth.userId) {
      // Tableau des champs requis avec une validation minimale de 4 caractères
      const requiredFields = [
        { field: "name", minLength: 2 },
        { field: "manufacturer", minLength: 2 },
        { field: "description", minLength: 5 },
        { field: "mainPepper", minLength: 2 },
      ];

      // Vérification des champs requis
      const missingFields = requiredFields.filter((field) => {
        const fieldValue = req.body[field.field];
        return !fieldValue || fieldValue.trim().length < field.minLength;
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Les champs suivants sont requis avec un minimum de ${
            missingFields[0].minLength
          } caractères : ${missingFields
            .map((field) => field.field)
            .join(", ")}`,
        });
      }

      // Vérification de la valeur de heat
      if (req.body.heat < 1 || req.body.heat > 10) {
        return res
          .status(400)
          .json({ error: "Le champ heat doit être compris entre 1 et 10." });
      }

      // Regex pour correspondre aux extensions autorisées
      const allowedExtensionsRegex =
        /\.(jpeg|png|bmp|gif|ico|svg|tiff|tif|webp)$/i;

      // Vérification de l'extension du fichier
      if (req.body.imageUrl) {
        const fileExtension = req.body.imageUrl.match(allowedExtensionsRegex);

        if (!fileExtension) {
          return res.status(400).json({
            error:
              "Seuls les formats jpeg, png, bmp, gif, ico, svp, tiff, tif et webp sont autorisés.",
          });
        }
      } else if (req.file) {
        const fileExtension = req.file.filename.match(allowedExtensionsRegex);

        if (!fileExtension) {
          return res.status(400).json({
            error:
              "Seuls les formats jpeg, png, bmp, gif, ico, svp, tiff, tif et webp sont autorisés.",
          });
        }
      }

      // Mise à jour des champs de la sauce
      const sauceObject = {
        ...req.body,
        _id: req.params.id,
      };

      if (req.file) {
        sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
      }

      Sauce.updateOne({ _id: req.params.id }, sauceObject)
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json("Requête non autorisée.");
    }
  });
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

const User = require("../models/User_model");

// package utilisé pour sécuriser le stockage de MDP. Hachage de manière sécurisé + salage
const bcrypt = require("bcrypt");

// package Jsonwebtoken permet de créer ds tokens sécurisés et de les vérifier
const jsonWebToken = require("jsonwebtoken");

// package utilisé pour la validation  de données dans notre  cas de l'email
const validator = require("validator");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const emailRegex = /^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/; //Regex minimum 5 caractères, une majuscule, un chiffre, un caractère spécial


// Bcrypt va crypter le MDP et le saler 10 fois (attention durée) et créer un nouvel user avec l'adresse email et le MDP crypter
exports.signup = (req, res, next) => {
  const validatorEmail = validator.isEmail(req.body.email);
  const isValidePassword = passwordRegex.test(req.body.password);
  const isValideEmail = emailRegex.test(req.body.email);

  if (validatorEmail && isValideEmail && isValidePassword) {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    return res.status(450).json({
      message:
        "L'email doit avoir un format classique. Le mot de passe doit comporter au minimum 5 caractères, une majuscule, un chiffre et un caractère spécial",
    });
  }
};

exports.login = (req, res, next) => {
  // Grace à findOne de Mongoose on va chercher la ligne correspondante dans la BDD à l'email 
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" }); //Message volontairement flou pour éviter perte de données
      }
      bcrypt
        // Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" }); //Message volontairement flou pour éviter perte de données
          }
          // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
          // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
          res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign(
              { userId: user._id },
              // Nous utilisons une chaîne secrète de développement temporaire TOKEN_KEY présente dans le .ENV pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.
              process.env.TOKEN_KEY,
              {
                // applique une expiration pour le token de xxx temps définit dans le .ENV
                expiresIn: process.env.TOKEN_TEMP,
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé. il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
// dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec. il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;

// -----------------------------------------------//

// Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.

// Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).

// Nous utilisons une chaîne secrète de développement temporaire TOKEN_KEY pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.

// Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.

// Nous renvoyons le token au front-end avec notre réponse.

const User = require("../models/User_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const emailRegex = /^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

exports.signup = (req, res, next) => {
  const validatorEmail = validator.isEmail(req.body.email);
  const isValidePassword = passwordRegex.test(req.body.password);
  const isValideEmail = emailRegex.test(req.body.email);
  console.log(validatorEmail);
  console.log(req.body.email);
  if (validatorEmail && isValideEmail && isValidePassword) {
    console.log(validatorEmail);
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
            res
              .status(400)
              .json({ message: "L'email doit avoir un format classique" })
          );
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // Pk le message ne s'affiche pas
    return res
      .status(400)
      .json({ message: "L'email doit avoir un format classique" });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// package de validation de données pour JS qui offre une synxtaxe simple et expressive pou rdéfinir des schémas de validation et vérifier si les données correspondent
const Joi = require("@hapi/joi");

const sauceSchema = Joi.object({
  userId: Joi.string().trim().length(24).required().messages({
    "string.base": "L'ID de l'utilisateur doit être une chaîne de caractères.",
    "string.empty": "L'ID de l'utilisateur ne doit pas être vide.",
    "string.length": "L'ID de l'utilisateur doit avoir une longueur de 24 caractères.",
  }),
  name: Joi.string().trim().min(1).required().messages({
    "string.base": "Le nom de la sauce doit être une chaîne de caractères.",
    "string.empty": "Le nom de la sauce ne doit pas être vide.",
    "string.min": "Le nom de la sauce doit avoir au moins une caractère.",
  }),
  manufacturer: Joi.string().trim().min(1).required().messages({
    "string.base": "Le fabricant de la sauce doit être une chaîne de caractères.",
    "string.empty": "Le fabricant de la sauce ne doit pas être vide.",
    "string.min": "Le fabricant de la sauce doit avoir au moins une caractère.",
  }),
  description: Joi.string().trim().min(1).required().messages({
    "string.base": "La description de la sauce doit être une chaîne de caractères.",
    "string.empty": "La description de la sauce ne doit pas être vide.",
    "string.min": "La description de la sauce doit avoir au moins une caractère.",
  }),
  mainPepper: Joi.string().trim().min(1).required().messages({
    "string.base": "Le principal ingrédient de la sauce doit être une chaîne de caractères.",
    "string.empty": "Le principal ingrédient de la sauce ne doit pas être vide.",
    "string.min": "Le principal ingrédient de la sauce doit avoir au moins une caractère.",
  }),
  heat: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "La force de la sauce doit être un nombre.",
    "number.empty": "La force de la sauce ne doit pas être vide.",
    "number.integer": "La force de la sauce doit être un nombre entier.",
    "number.min": "La force de la sauce doit être supérieure ou égale à 1.",
    "number.max": "La force de la sauce doit être inférieure ou égale à 10.",
  }),
});

exports.sauce = (req, res, next) => {
  let sauce;
  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
  } else {
    sauce = req.body;
  }

  const { error, value } = sauceSchema.validate(sauce, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message);
    res.status(422).json({ error: errorMessage });
  } else {
    next();
  }
};

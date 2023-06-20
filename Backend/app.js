// Importation du package express
const express = require("express");
const app = express();

// Importation du package mongoose
const mongoose = require("mongoose");

//   Importation .env
const dotenv = require("dotenv").config();

// Importation du fichier DB
const connectDB = require("../Backend/config/DB");

// Connexion BDD mongoDB
connectDB();

// Importation des routes
const userRoutes = require("./routes/user.routes");

// Importation des models
const UserModel = require("./models/User_model");
// const SauceModel = require("./models/Sauce_model");

// on importe path, donne accés au chemin du système de fichiers
const path = require("path");

// Permet le cross origin pour éviter les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});

// Extrait le corps JSON de la requete POST du front end
app.use(express.json());

// Création des routes endpoints
app.use("/api/auth", userRoutes);

module.exports = app;

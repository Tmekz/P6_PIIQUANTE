// Importation du package express
const express = require("express");
const app = express();

// Importation du package mongoose
const mongoose = require("mongoose");

//   Importation .env
const dotenv = require("dotenv").config({ path: "./config/.env" });

// Important morgan
const morgan = require("morgan");

// Importation du fichier DB
const connectDB = require("../Backend/config/DB");

// Connexion BDD mongoDB
connectDB();

// Importation des routes
const userRoutes = require("./routes/user.routes");

// Importation des models
const Sauce = require("./models/Sauce_model");

const saucesRoutes = require("./routes/sauce.routes");

// on importe path, donne accés au chemin du système de fichiers
const path = require("path");
const { log } = require("console");
const multer = require("multer");

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

// Extrait le corps JSON de la requete POST du front end (anciennment bodyParser.json())
app.use(express.json());

// Outil morgan pour more data terminal
app.use(morgan("dev"));

// Création des routes endpoints
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

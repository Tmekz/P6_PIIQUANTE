// Express est un framework minimaliste et flexible. Express va simplifier le procesus de création et gestion des routes mais également le systeme de middleware.

// les MW sont des fonctions qui capturent et traitent les REQ envoyées vers notre serv nous permettant de controler tres précisemment comment notre server réagit à chaque type de REQ. Chaque MW reçoit les objets request et response , peut les lire, les analyser et les manipuler. Le MW Express reçoit également la méthode next , qui permet à chaque MW de passer l'exécution au MW suivant.

// On va donc créer ici une application EXPRESS qui va être une série MW. Le but ici c'est de centraliser la configuration et la gestion de notre application web. On organise notre code de manière modulaire en séparant les routes, les MW, et les fonctionnalités spécifiques de modules distincts ce qui rend notre code plus facile à lire, comprendre et maintenir.

// Importation du framework express
const express = require("express");
const app = express();

// Importation .env
const dotenv = require("dotenv").config({ path: "./config/.env" });

// Importation morgan package de journalisation des requetes (logging) qui facilite le suivi et le débogage
const morgan = require("morgan");

// Importation du fichier DB
const connectDB = require("../Backend/config/DB");

// Importation des routes
const userRoutes = require("./routes/user.routes");
const saucesRoutes = require("./routes/sauce.routes");

// Importation path qui donne accés au chemin du système de fichiers
const path = require("path");

// Connexion BDD mongoDB
// MongoDB est une base de données NoSQL. Cela signifie que l'on ne peut pas utiliser SQL pour communiquer avec. Les données sont stockées comme des collections de documents individuels décrits en JSON (JavaScript Object Notation).
connectDB();

// Permet le cross origin pour éviter les erreurs de CORS
// CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles. Dans notre cas, nous avons deux origines : localhost:3000 et localhost:4200 , et nous souhaiterions qu'elles puissent communiquer entre elles. Pour cela, nous devons ajouter des headers à notre objet  response .
// Ces headers permettent :
// - d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
// - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
// - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
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
// Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON. Pour cela, vous avez juste besoin d'un middleware très simple, mis à disposition par le framework Express.
app.use(express.json());

// Morgan est un package de journalisation des requetes (logging) qui facilite le suivi et le débogage
app.use(morgan("dev"));

// Désactivation du "x-powered-by" dans le headers pour mesure de sécurité supplémentaire
app.disable("x-powered-by");

// Création des routes endpoints
// La méthode app.use() permet d'attribuer un middleware à une route spécifique de l'application.
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

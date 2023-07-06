const express = require("express");

// Le constructeur Router() est un composant natif d'Express.js. Il est fourni par le module express lui-même. Le routeur de Express nous permet de définir des routes pour différents endpoints (points de terminaison) de notre application. Il nous permet de spécifier les actions à effectuer lorsqu'une requête est reçue sur une route spécifique. Par exemple, nous pouvons définir une route /auth qui gère les requêtes GET, POST, PUT, DELETE pour les opérations liées aux utilisateurs.
const router = express.Router();
const userCtrl = require("../controllers/user_controller");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;

const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces_controller");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const validate = require("../middlewares/validate-inputs");

// Afficher toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauces);

// Afficher une sauce
router.get("/:id", auth, saucesCtrl.getOneSauce);

// Publier une sauce
router.post("/", auth, multer, validate.sauce, saucesCtrl.createSauce);

// Mettre à jour une sauce
router.put("/:id", auth, multer, validate.sauce, saucesCtrl.modifyOneSauce);

// Supprimer une sauce
router.delete("/:id", auth, saucesCtrl.deleteOneSauce);

// Like ou dislike une sauce
router.post("/:id/like", auth, saucesCtrl.likeOneSauce);

module.exports = router;

const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces_controller");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

// Afficher toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauces);
// Afficher une sauce
router.get("/:id", auth, saucesCtrl.getOneSauce);
// Publier une sauce
router.post("/", auth, multer, saucesCtrl.createSauce);
// Supprimer une sauce
router.delete("/:id", auth, saucesCtrl.deleteOneSauce);
// Mettre à jour une sauce
router.put("/:id", auth, multer, saucesCtrl.modifyOneSauce);
// Like ou dislike une sauce
router.put("/:id/like", auth, saucesCtrl.likeOnesauce);

module.exports = router;

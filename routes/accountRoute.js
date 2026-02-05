const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

router.get("/register", accountController.buildRegister);
// router.post("/register", utilities.handleErrors(accountController.register));
router.post("/register", accountController.register);
router.get("/login", accountController.buildLogin);

module.exports = router;
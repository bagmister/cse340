const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")

router.get("/login",  accountController.buildLogin)
// router.post("/register", accountController.register)

module.exports = router
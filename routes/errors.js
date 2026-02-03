const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")

router.get("/errors",  errorController.showErrors)

module.exports = router
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId))
router.get("/detail/:id", util.handleErrors(invController.buildInventoryDetailById))
router.get("/management", util.handleErrors(invController.buildManagementView))
router.get("/add-classification", util.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", util.handleErrors(invController.buildAddInventory))

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  util.handleErrors(invController.addClassification)
)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  util.handleErrors(invController.addInventoryItem)
)


module.exports = router;
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

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

router.get("/type/:classification_id", util.handleErrors(invController.buildByClassificationId))
router.get("/edit/:inv_id",
  util.checkLogin,
  util.checkAccountType,
  util.handleErrors(invController.buildEditInventory)
)
router.post(
  "/edit",
  util.checkLogin,
  util.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  util.handleErrors(invController.updateInventoryItem)
)


router.get(
  "/delete/:inv_id",
  util.checkLogin,
  util.checkAccountType,
  util.handleErrors(invController.buildDeleteInventory)
)

router.post(
  "/delete",
  util.checkLogin,
  util.checkAccountType,
  util.handleErrors(invController.deleteInventory)
)



module.exports = router;
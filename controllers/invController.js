const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildInventoryDetailById = async function (req, res, next) {
  const vehicle_id = req.params.id
  const data = await invModel.getInventoryByid(vehicle_id)
  const grid = await utilities.buildInventoryDetailPage(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make
  const vehiclemodel = data[0].inv_model
  res.render("./inventory/detail", {
    title: vehicleName + ' ' + vehiclemodel,
    nav,
    grid,
    errors: null,
  })
}

module.exports = invCont
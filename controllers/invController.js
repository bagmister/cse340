const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    messages: req.flash("info"),
    errors: req.flash("error"),
    formData: req.session.lastInventoryAttempt || {}
  })
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    if (result.alreadyExists) {
      req.flash("error", "Classification already exists.")
      return res.redirect("/inv/management")
    }

    req.flash("info", `Classification "${classification_name}" added successfully.`)
    res.redirect("/inv/management")
  } catch (err) {
    req.flash("error", "Failed to add classification. Try again.")
    res.redirect("/inv/management")
  }
}

invCont.addInventoryItem = async function (req, res, next) {
  try {

    const result = await invModel.addInventory({
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.inv_classification_id,
    })

    if (!result.success) throw new Error("Insert failed")

    req.flash("info", "Vehicle added successfully!")
    res.redirect("/inv/management")

  } catch (err) {
    console.error(err)
    req.flash("error", "Failed to add vehicle.")
    res.redirect("/inv/management")
  }
}


invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    formData: {}
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    formData: {}
  })
}

module.exports = invCont
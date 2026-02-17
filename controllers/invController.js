const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  if (!data || data.length === 0) {
    req.flash("notice", "No vehicles found in this classification.")
    return res.redirect("/")
  }
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
  const classifications = await invModel.getClassifications()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationList: classifications.rows,
    errors: null,
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
  const classifications = await invModel.getClassifications()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    formData: {},
    classifications: classifications.rows
  })
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const inv_id = req.params.inv_id
    const classifications = await invModel.getClassifications()

    const data = await invModel.getInventoryByid(inv_id)
    if (!data[0]) {
      req.flash("notice", "Vehicle not found")
      return res.redirect("/inv/management")
    }
    const vehicle = data[0]

    res.render("inventory/modify-inventory", {
    title: `Modify ${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    errors: null,
    formData: data[0],
    classifications: classifications.rows
    })
  } catch (err) {
    next(err)
  }
}


invCont.buildDeleteInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByid(inv_id)

  res.render("inventory/delete-inventory", {
    title: "Delete Inventory",
    nav,
    inventory: data[0],
    errors: null,
  })
}

invCont.deleteInventory = async (req, res, next) => {
  const { inv_id } = req.body

  const result = await invModel.deleteInventory(inv_id)

  if (result > 0) {
    req.flash("notice", "The inventory item has been successfully deleted.")
  } else {
    req.flash("notice", "Delete failed.")
  }

  return res.redirect("/inv/management")
}

invCont.updateInventoryItem = async function (req, res, next) {
  try {
    const result = await invModel.updateInventory({
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.inv_classification_id, // optional, make sure it's in the form
    })

    if (!result.success) throw new Error("Update failed")

    req.flash("info", "Vehicle updated successfully!")
    res.redirect("/inv/management")
  } catch (err) {
    console.error(err)
    req.flash("error", "Failed to update vehicle.")
    res.redirect("/inv/management")
  }
}


module.exports = invCont
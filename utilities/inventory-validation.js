const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Classification name is required and must contain only letters.")
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      formData: { classification_name }
    })
  }

  next()
}

validate.inventoryRules = () => {
  return [

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Valid year is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Valid price is required."),

    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Valid mileage is required."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("inv_classification_id")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Valid classification is required.")
  ]
}

/* ******************************
 * Check Inventory Data
 * **************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      formData: req.body
    })
  }

  next()
}

module.exports = validate

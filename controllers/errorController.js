const utilities = require("../utilities")

async function showErrors(req, res, next) {
  let nav = await utilities.getNav()
  res.render("errors/error", {
    title: "error",
    nav,
  })
}

module.exports = { showErrors }
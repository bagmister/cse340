const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
  const user_account = req.params.account_login
  // const data = await accountModel.getAccountInfo(user_account)
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}
module.exports = { buildLogin, buildRegister }
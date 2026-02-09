const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
  const user_account = req.params.account_login
  // const data = await accountModel.getAccountInfo(user_account)
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

async function register(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  const regResult = await accountModel.createAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
  if (regResult) {
    req.flash(
      "notice",
      `Account registered with the user name: ${account_email}`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    }) 
  } else {
    req.flash(
      "notice", "registration failed, try again"
    )
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}
module.exports = { buildLogin, buildRegister, register }
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  const user_account = req.params.account_login
  const data = await accountModel.getAccountByEmail(user_account)
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
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(req.body.account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register")
  }

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
    hashedPassword
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

async function login(req, res) {
 let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("message notice", "You have logged in")
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

async function buildupdateAccountInfo(req, res) {
  let nav = await utilities.getNav()

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    accountData: res.locals.accountData
  })
}


async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  let hashedPassword = null

  try {
    if (account_password) {
      hashedPassword = await bcrypt.hash(account_password, 10)
    }

    const updatedAccount = await accountModel.updateAccountInfo(
      account_id,
      account_firstname || null,
      account_lastname || null,
      account_email || null,
      hashedPassword
    )

    // Re-issue JWT with updated info
    delete updatedAccount.account_password
    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 3600 * 1000,
      secure: process.env.NODE_ENV !== "development"
    })

    req.flash("notice", "Account updated successfully.")
    return res.redirect("/account/")

  } catch (error) {
    req.flash("notice", "Account update failed.")
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}



module.exports = { buildLogin, buildRegister, register, login, buildManagement, logout, buildupdateAccountInfo, updateAccountInfo}
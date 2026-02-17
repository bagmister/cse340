const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");

router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.register)
)
router.get("/login", accountController.buildLogin);
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.login)
)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get("/logout", accountController.logout)

router.get(
  "/update-account",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildupdateAccountInfo)
)

router.post(
  "/update-account",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountInfo)
)
 
router.get(
  "/admin-accounts",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(accountController.buildAdminAccounts)
)
 
router.post(
  "/admin-accounts",
  utilities.checkLogin,
  utilities.checkAdmin,
  utilities.handleErrors(accountController.updateAccountRole)
)


module.exports = router;
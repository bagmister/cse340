const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    let list = '<ul>';
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.rows.forEach((row) => {
      list += '<li>';
      list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
      list += '</li>';
    });

    list += '</ul>';
    return list;
  } catch (err) {
    console.error("Error building nav:", err);
    return '<ul><li><a href="/">Home</a></li></ul>';
  }
};

util.buildClassificationGrid = async function(data, w ){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail
      + '" srcset="' + vehicle.inv_image + '" 2x"' 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="milage">'
      grid += new Intl.NumberFormat('en-US', {style: "decimal"}).format(vehicle.inv_miles) + ' Miles</span>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

util.buildInventoryDetailPage = async function (data) {
  let grid = ""
  if (data.length > 0) {
    const vehicle = data[0]

    grid += `
      <div class="inventoryDetailPage">

        <div class="detail-left">
          <img 
            src="${vehicle.inv_image}" 
            alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"
          />
          <p>
            <a href="/inv/type/${vehicle.classification_id}">
              &larr; Back to Inventory
            </a>
          </p>
        </div>

        <div class="detail-right">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>

          <p class="description">
            ${vehicle.inv_description}
          </p>

          <p class="inv-color">
            <strong>Color:</strong>
            ${vehicle.inv_color}
          </p>

          <p class="mileage">
            <strong>Mileage:</strong>
            ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles
          </p>

          <p class="vehicle">
            <strong>Vehicle:</strong>
            ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
          </p>

          <p class="price">
            <strong>Price:</strong>
            $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
          </p>

          <button class="buy-now">
            Buy Now!
          </button>
        </div>

      </div>
    `
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

util.handleErrors = (fn) => {
  if (typeof fn !== 'function') {
    throw new TypeError(`handleErrors expected a function, got: ${typeof fn}`);
  }

  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(`Error in route handler (${req.originalUrl}):`, err.stack || err);
      next(err); // pass to global error handler
    }
  };
};

util.buildClassificationList = async function(data) {
  const inventory = await invModel.getInventory()
}

util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = false
  res.locals.accountData = null
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = true
        next()
      }
    )
  } else {
    next()
  }
}

 util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" ||
     res.locals.accountData.account_type === "Admin")
  ) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access that page.")
    return res.redirect("/")
  }
}

util.checkAdmin = (req, res, next) => {
  if (
    res.locals.accountData &&
    res.locals.accountData.account_type === "Admin"
  ) {
    next()
  } else {
    req.flash("notice", "Admin access required.")
    return res.redirect("/inv/management")
  }
}



module.exports = util

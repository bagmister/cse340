const pool = require("../database")

async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.account WHERE account_email = $1`,
      [email]
    )
    return result.rows[0] || null
  } catch (err) {
    console.error("getAccountByEmail error:", err)
    throw err
  }
}

async function createAccount(data) {
  const { account_email, account_password } = data

  try {
    const result = await pool.query(
      `INSERT INTO public.account 
       (account_email, account_password) 
       VALUES ($1, $2) 
       RETURNING *`,
      [account_email, account_password]
    )
    return result.rows[0]
  } catch (err) {
    if (err.code === '99999') {
      throw new Error("Email already exists")
    }
    console.error("createAccount error:", err)
    throw err
  }
}

module.exports = {
  getAccountByEmail,
  createAccount,
}
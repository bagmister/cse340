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

async function createAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO public.account 
        (account_firstname, account_lastname, account_email, account_password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);

    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {  // ← correct code for unique violation (duplicate email)
      throw new Error("Email already exists");
    }
    console.error("createAccount error:", err);
    throw err;
  }
}

module.exports = {
  getAccountByEmail,
  createAccount,
}
const pool = require("../database")

async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.account WHERE account_email = $1`,
      [email]
    )
    return result.rows[0]
  } catch (err) {
    return new Error("No matching email found")
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

async function updateAccountInfo(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
  hashedPassword
) {
  try {
    const fields = []
    const values = []
    let index = 1

    if (account_firstname) {
      fields.push(`account_firstname = $${index++}`)
      values.push(account_firstname)
    }

    if (account_lastname) {
      fields.push(`account_lastname = $${index++}`)
      values.push(account_lastname)
    }

    if (account_email) {
      fields.push(`account_email = $${index++}`)
      values.push(account_email)
    }

    if (hashedPassword) {
      fields.push(`account_password = $${index++}`)
      values.push(hashedPassword)
    }

    // If nothing to update
    if (fields.length === 0) {
      throw new Error("No fields provided for update.")
    }

    const sql = `
      UPDATE public.account
      SET ${fields.join(", ")}
      WHERE account_id = $${index}
      RETURNING *
    `

    values.push(account_id)

    const result = await pool.query(sql, values)
    return result.rows[0]

  } catch (error) {
    console.error("updateAccountInfo error:", error)
    throw error
  }
}

async function getAllAccounts() {
  const sql = `
    SELECT *
    FROM account
    ORDER BY account_id
  `
  const result = await pool.query(sql)
  return result.rows
}
 
async function updateAccountRole(account_id, account_type) {
  const sql = `
    UPDATE account
    SET account_type = $1
    WHERE account_id = $2
  `
  return pool.query(sql, [account_type, account_id])
}



module.exports = { getAccountByEmail, createAccount, updateAccountInfo, getAllAccounts, updateAccountRole}
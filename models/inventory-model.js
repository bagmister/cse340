const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryByid(id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByid error " + error)
  }
}

async function getInventory() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory`,
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByid error " + error)
  }
}

async function addInventory(vehicle) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, 
        inv_color, classification_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`

    const values = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id
    ]

    const result = await pool.query(sql, values)
    return { success: result.rowCount > 0, data: result.rows[0] }
  } catch (error) {
    console.error("addInventory error:", error)
    throw error
  }
}

async function addClassification(classification_name) {
  try {
    let check = await pool.query(
      `SELECT 1 FROM public.classification 
       WHERE LOWER(classification_name) = LOWER($1)`,
      [classification_name]
    )

    if (check.rowCount > 0) {
      return { alreadyExists: true }
    }

    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) 
       VALUES ($1) RETURNING *`,
      [classification_name]
    )

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("addClassification error:", error)
    throw error
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1`
    const result = await pool.query(sql, [inv_id])
    return result.rowCount
  } catch (error) {
    console.error("deleteInventory error:", error)
    throw error
  }
}

async function updateInventory(vehicle) {
  try {
    const sql = `
      UPDATE public.inventory
      SET 
        inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `

    const values = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id,
      vehicle.inv_id // key for WHERE clause
    ]

    const result = await pool.query(sql, values)

    return { success: result.rowCount > 0, data: result.rows[0] }
  } catch (error) {
    console.error("updateInventory error:", error)
    throw error
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByid, addInventory, addClassification, getInventory, deleteInventory, updateInventory};

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "1234",
  port: 5432,
});

async function updateReviews() {
  try {
    const res = await pool.query("UPDATE resenas SET compra_verificada = true RETURNING id;");
    console.log(`Actualizadas ${res.rowCount} reseñas.`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

updateReviews();

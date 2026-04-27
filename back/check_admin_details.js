const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "1234",
  port: 5432,
});

async function checkAdminDetails() {
  try {
    const res = await pool.query("SELECT email, activo, fecha_eliminacion FROM usuarios WHERE email = 'admin@gmail.com'");
    console.table(res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

checkAdminDetails();

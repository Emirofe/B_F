const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "1234",
  port: 5432,
});

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

async function updateAdminPassword() {
  try {
    const hash = hashPassword("admin123");
    await pool.query(
      "UPDATE usuarios SET password_hash = $1 WHERE email = 'admin@gmail.com'",
      [hash]
    );
    console.log("Contraseña del admin actualizada exitosamente a: admin123");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

updateAdminPassword();

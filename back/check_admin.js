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

async function checkAdmin() {
  try {
    const res = await pool.query("SELECT * FROM usuarios WHERE id_rol = 1");
    if (res.rows.length === 0) {
      console.log("No hay usuario admin. Creando uno por defecto: admin@admin.com / admin123");
      const hash = hashPassword("admin123");
      await pool.query(
        "INSERT INTO usuarios (id_rol, nombre, email, password_hash) VALUES (1, 'Administrador', 'admin@admin.com', $1)",
        [hash]
      );
      console.log("Admin creado exitosamente.");
    } else {
      console.log("Usuarios admin encontrados:");
      console.table(res.rows.map(r => ({ id: r.id, nombre: r.nombre, email: r.email })));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

checkAdmin();

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "1234",
  port: 5432,
});

async function run() {
  try {
    const p = await pool.query("SELECT id FROM productos LIMIT 1;");
    const u = await pool.query("SELECT id FROM usuarios LIMIT 1;");
    if (p.rows.length > 0 && u.rows.length > 0) {
      await pool.query(
        "INSERT INTO resenas (id_producto, id_usuario, calificacion, comentario, compra_verificada) VALUES ($1, $2, 5, '¡Excelente producto! Muy recomendable. Llego rápido y en perfectas condiciones.', true)",
        [p.rows[0].id, u.rows[0].id]
      );
      console.log("Reseña insertada para el producto " + p.rows[0].id);
    } else {
      console.log("No hay productos o usuarios");
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();

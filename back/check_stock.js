const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "hola",
  port: 5432,
});

async function main() {
  // 1. Check producto 4 stock_total
  const prod = await pool.query(
    "SELECT id, nombre, stock_total FROM productos WHERE id = 4"
  );
  console.log("=== PRODUCTO ID 4 ===");
  console.log(prod.rows);

  // 2. Check ALL lotes_inventario for producto 4
  const lotes = await pool.query(
    "SELECT id, id_producto, stock_disponible, fecha_caducidad FROM lotes_inventario WHERE id_producto = 4"
  );
  console.log("\n=== LOTES INVENTARIO PRODUCTO 4 ===");
  console.log(lotes.rows);

  // 3. Check valid lotes (not expired, stock > 0)
  const lotesValidos = await pool.query(
    "SELECT id, stock_disponible, fecha_caducidad FROM lotes_inventario WHERE id_producto = 4 AND fecha_caducidad >= CURRENT_DATE AND stock_disponible > 0"
  );
  console.log("\n=== LOTES VALIDOS (no caducados, stock > 0) ===");
  console.log(lotesValidos.rows);

  // 4. Check carrito_items for current user
  const carrito = await pool.query(
    `SELECT ci.id, ci.id_producto, ci.cantidad, p.nombre, p.stock_total
     FROM carrito_items ci
     JOIN carrito c ON c.id = ci.id_carrito
     JOIN productos p ON p.id = ci.id_producto
     WHERE ci.id_producto = 4`
  );
  console.log("\n=== CARRITO ITEMS CON PRODUCTO 4 ===");
  console.log(carrito.rows);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  pool.end();
});

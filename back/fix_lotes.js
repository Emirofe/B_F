const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "hola",
  port: 5432,
});

async function main() {
  // Find all products with stock_total > 0 but no valid inventory lot
  const sinLote = await pool.query(`
    SELECT p.id, p.nombre, p.stock_total
    FROM productos p
    WHERE p.stock_total > 0
      AND NOT EXISTS (
        SELECT 1 FROM lotes_inventario li
        WHERE li.id_producto = p.id
          AND li.fecha_caducidad >= CURRENT_DATE
          AND li.stock_disponible > 0
      )
  `);

  console.log(`Productos sin lote de inventario: ${sinLote.rows.length}`);

  for (const prod of sinLote.rows) {
    console.log(`  Creando lote para: [${prod.id}] ${prod.nombre} (stock: ${prod.stock_total})`);
    await pool.query(
      `INSERT INTO lotes_inventario (id_producto, stock_disponible, fecha_recibido, fecha_caducidad)
       VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 years')`,
      [prod.id, prod.stock_total]
    );
  }

  console.log("\nLotes creados. Verificando...");

  const verificacion = await pool.query(`
    SELECT p.id, p.nombre, p.stock_total, li.stock_disponible AS stock_lote, li.fecha_caducidad
    FROM productos p
    JOIN lotes_inventario li ON li.id_producto = p.id
    WHERE li.fecha_caducidad >= CURRENT_DATE AND li.stock_disponible > 0
    ORDER BY p.id
  `);
  console.log(verificacion.rows);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  pool.end();
});

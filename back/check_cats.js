const { Pool } = require("pg");
const pool = new Pool({ user: "postgres", host: "localhost", database: "senora_chela", password: "hola", port: 5432 });

async function main() {
  // Schema de productos
  const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='productos' ORDER BY ordinal_position");
  console.log("=== COLUMNAS DE productos ===");
  console.log(cols.rows.map(x => x.column_name));

  // Check how backend loads products by category
  const catProds = await pool.query(`
    SELECT p.id, p.nombre, n.id AS id_negocio, n.nombre_comercial,
           nc.id_categoria, c.nombre_categoria
    FROM productos p
    JOIN negocios n ON n.id = p.id_negocio
    LEFT JOIN negocio_categorias nc ON nc.id_negocio = n.id
    LEFT JOIN categorias c ON c.id = nc.id_categoria
    ORDER BY p.id
  `);
  console.log("\n=== PRODUCTOS CON SUS CATEGORIAS (via negocio) ===");
  console.log(catProds.rows);

  await pool.end();
}
main().catch(e => { console.error(e); pool.end(); });

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", host: "localhost", database: "senora_chela", password: "hola", port: 5432,
});

async function main() {
  const prods = await pool.query("SELECT id, nombre, precio, esta_activo, id_negocio FROM productos ORDER BY id");
  console.log("=== TODOS LOS PRODUCTOS ===");
  console.log(prods.rows);

  const servs = await pool.query("SELECT id, nombre, precio_base, esta_activo, id_negocio FROM servicios ORDER BY id");
  console.log("\n=== TODOS LOS SERVICIOS ===");
  console.log(servs.rows);

  const cats = await pool.query("SELECT id, nombre_categoria, id_padre FROM categorias ORDER BY id LIMIT 20");
  console.log("\n=== CATEGORIAS (primeras 20) ===");
  console.log(cats.rows);

  const relPC = await pool.query("SELECT * FROM rel_producto_categorias ORDER BY id_producto");
  console.log("\n=== REL PRODUCTO-CATEGORIAS ===");
  console.log(relPC.rows);

  const relSC = await pool.query("SELECT * FROM rel_servicio_categorias ORDER BY id_servicio");
  console.log("\n=== REL SERVICIO-CATEGORIAS ===");
  console.log(relSC.rows);

  await pool.end();
}
main().catch(e => { console.error(e); pool.end(); });

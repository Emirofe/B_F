const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const { Pool } = require("pg");
const fs = require("fs");
const createLoginRouter = require("./Login/APIs");
const createAdminRouter = require("./Admin/routes");
const createVendedorRouter = require("./Vendedor/CRUD");
const createVendedorOrdersRouter = require("./Vendedor/Pedidos");
const createCompradorRouter = require("./Comprador/productos");
const createCompradorCuentaRouter = require("./Comprador/cuenta");
const createCompradorCarritoRouter = require("./Comprador/carrito");
const createCompradorPedidosRouter = require("./Comprador/pedidos");
const createUsuarioWishlistRouter = require("./Usuario/wishlist");
const createVendedorBusinessRouter = require("./Vendedor/Negocio");


const app = express();

// ── CORS: permite peticiones del frontend en localhost ──────────────────
app.use(
  cors({
    origin: true,
    credentials: true, // necesario para que las cookies de sesión funcionen
  })
);

// Configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use(
  session({
    secret: "clave_super_secreta_tultimarket",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",   // permite cookies entre pestañas del mismo navegador
      maxAge: 1000 * 60 * 60 * 8, // 8 horas de sesión
    },
  })
);

// PostgreSQL conexión
// ⚠️  CAMBIA "TU_CONTRASENA_AQUI" por la contraseña que pusiste al instalar PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "senora_chela",
  password: "1234",
  port: 5432,
});

// Carpeta de imágenes
const uploadFolder = "static/images/products";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configuración de subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener productos
async function obtenerProductos() {
  const result = await pool.query("SELECT * FROM Productos");
  return result.rows;
}

// Obtener categorías
async function obtenerCategorias() {
  const result = await pool.query(
    "SELECT DISTINCT categoria FROM Productos"
  );
  return result.rows.map((c) => c.categoria);
}

app.use(
  createLoginRouter({
    pool,
  })
);

app.use(
  createAdminRouter({
    pool,
    upload,
    obtenerProductos,
  })
);

app.use(
  createCompradorRouter({
    pool,
  })
);

app.use(
  createCompradorCuentaRouter({
    pool,
  })
);

app.use(
  createCompradorCarritoRouter({
    pool,
  })
);

app.use(
  createCompradorPedidosRouter({
    pool,
  })
);

app.use(
  createUsuarioWishlistRouter({
    pool,
  })
);

app.use(
  createVendedorRouter({
    pool,
    obtenerProductos,
    obtenerCategorias,
  })
);

app.use(
  createVendedorOrdersRouter({
    pool,
  })
);

app.use(
  createVendedorBusinessRouter({
    pool,
  })
);

// Insertar roles si no existen
(async () => {
  try {
    await pool.query("INSERT INTO roles (id, nombre_rol) VALUES (1, 'Admin'), (2, 'Comprador'), (3, 'Vendedor') ON CONFLICT (id) DO NOTHING");
    console.log("Roles verificados/insertados");
  } catch (error) {
    console.error("Error insertando roles:", error);
  }
})();

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});

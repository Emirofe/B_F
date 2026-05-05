const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const { Pool } = require("pg");
const fs = require("fs");
const createLoginRouter = require("./Login/APIs");
const createAdminRouter = require("./Admin/routes");
const createAdminReportesRouter = require("./Admin/reportes");
const createVendedorRouter = require("./Vendedor/CRUD");
const createVendedorOrdersRouter = require("./Vendedor/Pedidos");
const createCompradorRouter = require("./Comprador/productos");
const createCompradorCuentaRouter = require("./Usuario/cuenta");
const createCompradorCarritoRouter = require("./Comprador/carrito");
const createCompradorPedidosRouter = require("./Comprador/pedidos");
const createCompradorReportesRouter = require("./Comprador/reportes");
const createUsuarioWishlistRouter = require("./Usuario/wishlist");
const createVendedorBusinessRouter = require("./Vendedor/Negocio");
const createVendedorDescuentosRouter = require("./Vendedor/Descuentos");


const app = express();

// ── CORS: permite peticiones del frontend en localhost:5173 ──────────────────
app.use(
  cors({
    origin: "http://localhost:5173",
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
  password: "hola",
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

// (obtenerProductos and obtenerCategorias removed — no longer used by any router)

app.use(
  createLoginRouter({
    pool,
  })
);

app.use(
  createAdminRouter({
    pool,
  })
);

app.use(
  createAdminReportesRouter({
    pool,
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
  createCompradorReportesRouter({
    pool,
  })
);

app.use(
  createVendedorRouter({
    pool,
  })
);

app.use(
  createUsuarioWishlistRouter({
    pool,
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

app.use(
  createVendedorDescuentosRouter({
    pool,
  })
);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
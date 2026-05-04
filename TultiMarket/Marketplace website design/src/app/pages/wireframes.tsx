import { useState } from "react";
import { Link } from "react-router";
import {
  Layout,
  Home,
  LogIn,
  UserPlus,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  User,
  Package,
  Heart,
  Boxes,
  Gift,
  ClipboardList,
  BarChart3,
  Users,
  Flag,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  ArrowLeft,
  Eye,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface ScreenDoc {
  id: string;
  title: string;
  route: string;
  role: "Comprador" | "Vendedor" | "Admin" | "Publico";
  icon: React.ReactNode;
  description: string;
  sections: {
    name: string;
    elements: string[];
  }[];
  wireframe: React.ReactNode;
}

function WireframeBox({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-2 ${className}`}
    >
      {label && (
        <span
          className="text-gray-400 block mb-1"
          style={{ fontSize: 10, fontWeight: 600 }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function WireframePlaceholder({
  text,
  h = "h-4",
  w = "w-full",
  color = "bg-gray-200",
}: {
  text?: string;
  h?: string;
  w?: string;
  color?: string;
}) {
  return (
    <div
      className={`${color} ${h} ${w} rounded flex items-center justify-center`}
    >
      {text && (
        <span className="text-gray-500" style={{ fontSize: 8 }}>
          {text}
        </span>
      )}
    </div>
  );
}

const screens: ScreenDoc[] = [
  {
    id: "home",
    title: "Catalogo / Home",
    route: "/",
    role: "Publico",
    icon: <Home size={18} />,
    description:
      "Pagina principal del marketplace. Muestra un carrusel hero con banners promocionales, grid de categorias de fiestas, productos mejor calificados, y el catalogo completo con filtros avanzados (precio, calificacion) y ordenamiento (relevancia, precio, nombre, rating). Incluye busqueda inteligente con autocompletado.",
    sections: [
      {
        name: "Hero Banner / Carrusel",
        elements: [
          "Carrusel con 3 banners de imagen completa",
          "Titulo y subtitulo superpuestos con gradiente oscuro",
          "Boton CTA 'Explorar Ofertas'",
          "Flechas de navegacion izquierda/derecha",
          "Indicadores de puntos en la parte inferior",
        ],
      },
      {
        name: "Grid de Categorias",
        elements: [
          "8 categorias en grid responsivo (2-4-8 columnas)",
          "Cada tarjeta con emoji y nombre de categoria",
          "Hover con sombra y borde primario",
          "Categorias: Cumpleanos, Bodas, Baby Shower, Graduacion, Halloween, Navidad, XV Anos, Fiestas Infantiles",
        ],
      },
      {
        name: "Mejor Calificados",
        elements: [
          "4 ProductCards en grid (1-2-4 columnas)",
          "Solo se muestra en la vista home sin filtros",
        ],
      },
      {
        name: "Catalogo de Productos",
        elements: [
          "Titulo dinamico segun filtro o busqueda",
          "Contador de productos encontrados",
          "Boton 'Filtros' con icono SlidersHorizontal",
          "Select de ordenamiento (Relevancia, Precio asc/desc, Rating, Nombre)",
          "Panel de filtros expandible: rango de precio (inputs min/max), calificacion minima (select), boton limpiar filtros",
          "Grid de ProductCards (1-2-3-4 columnas responsivo)",
          "Estado vacio con link a todos los productos",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="NAVBAR" className="bg-green-50">
          <div className="flex items-center gap-2">
            <WireframePlaceholder w="w-20" h="h-3" color="bg-green-200" />
            <WireframePlaceholder h="h-3" color="bg-gray-100" />
            <WireframePlaceholder w="w-16" h="h-3" color="bg-gray-200" />
          </div>
        </WireframeBox>
        <WireframeBox label="HERO BANNER">
          <WireframePlaceholder h="h-16" text="Carrusel Banners" color="bg-blue-100" />
        </WireframeBox>
        <WireframeBox label="CATEGORIAS">
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <WireframePlaceholder key={i} h="h-6" text={`Cat ${i}`} color="bg-purple-100" />
            ))}
          </div>
        </WireframeBox>
        <WireframeBox label="MEJOR CALIFICADOS">
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <WireframePlaceholder key={i} h="h-12" text="Card" color="bg-amber-100" />
            ))}
          </div>
        </WireframeBox>
        <WireframeBox label="CATALOGO + FILTROS">
          <div className="flex gap-1 mb-1">
            <WireframePlaceholder w="w-16" h="h-3" text="Filtros" color="bg-gray-300" />
            <WireframePlaceholder w="w-20" h="h-3" text="Ordenar" color="bg-gray-300" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <WireframePlaceholder key={i} h="h-12" text="Producto" color="bg-green-100" />
            ))}
          </div>
        </WireframeBox>
        <WireframeBox label="FOOTER" className="bg-green-50">
          <WireframePlaceholder h="h-8" text="Footer 4 columnas" color="bg-green-200" />
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "login",
    title: "Iniciar Sesion",
    route: "/login",
    role: "Publico",
    icon: <LogIn size={18} />,
    description:
      "Pagina de login centrada con logo del marketplace, selector de rol para demo (Comprador, Vendedor, Admin), formulario con email y contrasena (con toggle de visibilidad), boton de iniciar sesion, y link a registro.",
    sections: [
      {
        name: "Formulario de Login",
        elements: [
          "Logo con icono Store + nombre 'TultiMarket'",
          "Selector de rol demo (3 botones tipo toggle: Comprador/Vendedor/Admin)",
          "Input de correo electronico con placeholder",
          "Input de contrasena con boton Eye/EyeOff para mostrar/ocultar",
          "Boton 'Iniciar Sesion' full-width color primario",
          "Link a registro: 'No tienes cuenta? Crear cuenta'",
          "Validacion: campos requeridos con toast de error",
          "Redireccion segun rol al hacer login",
        ],
      },
    ],
    wireframe: (
      <div className="flex items-center justify-center py-4">
        <WireframeBox label="LOGIN CARD" className="w-48">
          <div className="flex justify-center mb-2">
            <WireframePlaceholder w="w-24" h="h-4" text="Logo" color="bg-green-200" />
          </div>
          <WireframeBox label="Selector Rol" className="mb-2">
            <div className="flex gap-1">
              <WireframePlaceholder h="h-3" text="Comp" color="bg-green-300" />
              <WireframePlaceholder h="h-3" text="Vend" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" text="Admin" color="bg-gray-200" />
            </div>
          </WireframeBox>
          <WireframePlaceholder h="h-3" text="Email" color="bg-gray-100" />
          <div className="h-1" />
          <WireframePlaceholder h="h-3" text="Password" color="bg-gray-100" />
          <div className="h-1" />
          <WireframePlaceholder h="h-4" text="Iniciar Sesion" color="bg-green-300" />
          <div className="h-1" />
          <WireframePlaceholder h="h-2" text="Crear cuenta" color="bg-transparent" />
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "register",
    title: "Crear Cuenta",
    route: "/registro",
    role: "Publico",
    icon: <UserPlus size={18} />,
    description:
      "Formulario de registro con validaciones: nombre completo, email (con validacion de duplicado), contrasena con toggle de visibilidad, confirmacion de contrasena (valida que coincidan), selector de tipo de cuenta (Comprador/Vendedor).",
    sections: [
      {
        name: "Formulario de Registro",
        elements: [
          "Logo con icono Store + nombre",
          "Input nombre completo",
          "Input email con validacion de duplicado (muestra error si ya existe)",
          "Input contrasena con toggle Eye/EyeOff",
          "Input confirmar contrasena",
          "Selector de tipo de cuenta: 2 botones toggle (Comprador/Vendedor)",
          "Boton 'Crear Cuenta' full-width",
          "Link a login: 'Ya tienes cuenta? Inicia sesion'",
          "Validaciones: campos vacios, contrasenas no coinciden, email duplicado",
        ],
      },
    ],
    wireframe: (
      <div className="flex items-center justify-center py-4">
        <WireframeBox label="REGISTRO CARD" className="w-48">
          <div className="flex justify-center mb-2">
            <WireframePlaceholder w="w-24" h="h-4" text="Logo" color="bg-green-200" />
          </div>
          <div className="space-y-1">
            <WireframePlaceholder h="h-3" text="Nombre" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Email" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Password" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Confirmar Pass" color="bg-gray-100" />
            <div className="flex gap-1">
              <WireframePlaceholder h="h-3" text="Comprador" color="bg-green-300" />
              <WireframePlaceholder h="h-3" text="Vendedor" color="bg-gray-200" />
            </div>
            <WireframePlaceholder h="h-4" text="Crear Cuenta" color="bg-green-300" />
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "product-detail",
    title: "Detalle de Producto",
    route: "/producto/:id",
    role: "Publico",
    icon: <ShoppingBag size={18} />,
    description:
      "Vista completa del producto con galeria de imagenes (miniatura seleccionable), informacion del vendedor con link, nombre, rating con estrellas, precio con descuento si aplica, indicador de stock (en stock / stock bajo / agotado), selector de cantidad, botones de agregar al carrito y wishlist, info de envio. Tabs para descripcion, resenas (con formulario para escribir) e info del vendedor. Seccion de paquetes promocionales y productos similares.",
    sections: [
      {
        name: "Breadcrumb",
        elements: ["Navegacion: Inicio > Categoria > Nombre del producto"],
      },
      {
        name: "Galeria de Imagenes",
        elements: [
          "Imagen principal grande (aspect-square)",
          "Fila de miniaturas seleccionables con borde activo",
        ],
      },
      {
        name: "Informacion del Producto",
        elements: [
          "Nombre del vendedor con link e icono Store",
          "Rating del vendedor en parentesis",
          "Nombre del producto (h1)",
          "StarRating con conteo de resenas",
          "Precio actual grande en color primario",
          "Precio original tachado + porcentaje de descuento (si aplica)",
          "Indicador de stock con colores: verde (>10), ambar (<10), rojo (0)",
          "Selector de cantidad con botones +/-",
          "Boton 'Agregar al Carrito' con icono ShoppingCart",
          "Boton corazon wishlist (toggle con cambio de estilo)",
          "Caja de info de envio: '3-5 dias habiles'",
        ],
      },
      {
        name: "Tabs (Descripcion / Resenas / Vendedor)",
        elements: [
          "Tab Descripcion: texto del producto",
          "Tab Resenas: lista de resenas con avatar, nombre, fecha, estrellas, comentario + boton 'Escribir Resena' que abre formulario con StarRating interactivo y textarea",
          "Tab Vendedor: avatar grande, nombre, rating, descripcion",
        ],
      },
      {
        name: "Paquetes Promocionales",
        elements: [
          "Cards de bundles del vendedor",
          "Lista de productos incluidos con imagen y precio",
          "Precio del paquete vs precio original + ahorro",
          "Boton 'Agregar Paquete al Carrito'",
        ],
      },
      {
        name: "Productos Similares",
        elements: [
          "Grid de 4 productos de la misma categoria",
          "Cards simplificadas con imagen, nombre y precio",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="NAVBAR" className="bg-green-50">
          <WireframePlaceholder h="h-3" color="bg-green-200" />
        </WireframeBox>
        <WireframePlaceholder h="h-2" text="Inicio > Categoria > Producto" color="bg-gray-100" />
        <div className="grid grid-cols-2 gap-2">
          <WireframeBox label="GALERIA">
            <WireframePlaceholder h="h-24" text="Imagen Principal" color="bg-blue-100" />
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((i) => (
                <WireframePlaceholder key={i} h="h-6" w="w-8" text={`${i}`} color="bg-blue-50" />
              ))}
            </div>
          </WireframeBox>
          <WireframeBox label="INFO PRODUCTO">
            <div className="space-y-1">
              <WireframePlaceholder h="h-2" w="w-20" text="Vendedor" color="bg-gray-100" />
              <WireframePlaceholder h="h-3" text="Nombre Producto" color="bg-gray-200" />
              <WireframePlaceholder h="h-2" w="w-16" text="★★★★☆" color="bg-amber-100" />
              <WireframePlaceholder h="h-4" w="w-16" text="$299.00" color="bg-green-200" />
              <WireframePlaceholder h="h-2" w="w-12" text="En stock" color="bg-green-100" />
              <div className="flex gap-1">
                <WireframePlaceholder h="h-3" w="w-6" text="-" color="bg-gray-200" />
                <WireframePlaceholder h="h-3" w="w-6" text="1" color="bg-gray-100" />
                <WireframePlaceholder h="h-3" w="w-6" text="+" color="bg-gray-200" />
              </div>
              <div className="flex gap-1">
                <WireframePlaceholder h="h-4" text="Agregar al Carrito" color="bg-green-300" />
                <WireframePlaceholder h="h-4" w="w-8" text="♥" color="bg-red-100" />
              </div>
            </div>
          </WireframeBox>
        </div>
        <WireframeBox label="TABS">
          <div className="flex gap-1 mb-1">
            <WireframePlaceholder h="h-3" text="Descripcion" color="bg-green-200" />
            <WireframePlaceholder h="h-3" text="Resenas" color="bg-gray-200" />
            <WireframePlaceholder h="h-3" text="Vendedor" color="bg-gray-200" />
          </div>
          <WireframePlaceholder h="h-8" text="Contenido del tab" color="bg-gray-100" />
        </WireframeBox>
        <WireframeBox label="PAQUETES PROMOCIONALES">
          <div className="grid grid-cols-2 gap-1">
            <WireframePlaceholder h="h-10" text="Bundle 1" color="bg-purple-100" />
            <WireframePlaceholder h="h-10" text="Bundle 2" color="bg-purple-100" />
          </div>
        </WireframeBox>
        <WireframeBox label="PRODUCTOS SIMILARES">
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <WireframePlaceholder key={i} h="h-10" text={`Prod ${i}`} color="bg-amber-100" />
            ))}
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "cart",
    title: "Carrito de Compras",
    route: "/carrito",
    role: "Comprador",
    icon: <ShoppingCart size={18} />,
    description:
      "Vista del carrito con lista de productos agregados, cada uno con imagen, nombre, vendedor, precio, selector de cantidad (+/-) y boton eliminar. Panel lateral sticky con resumen: subtotal, envio (gratis), total, boton 'Proceder al Pago' y link 'Seguir Comprando'. Estado vacio con icono, mensaje y CTA.",
    sections: [
      {
        name: "Lista de Items",
        elements: [
          "Cards por producto: imagen (link al detalle), nombre (link), vendedor, precio unitario",
          "Selector de cantidad con botones Minus/Plus",
          "Subtotal por item",
          "Boton eliminar (Trash2) en rojo",
        ],
      },
      {
        name: "Resumen del Pedido (sidebar sticky)",
        elements: [
          "Subtotal con conteo de productos",
          "Envio estimado (Gratis)",
          "Separador",
          "Total en color primario",
          "Boton 'Proceder al Pago' (link a /checkout)",
          "Link 'Seguir Comprando' (link a /)",
        ],
      },
      {
        name: "Estado Vacio",
        elements: [
          "Icono ShoppingBag grande semitransparente",
          "Titulo 'Tu carrito esta vacio'",
          "Mensaje motivacional",
          "Boton 'Explorar Productos'",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="NAVBAR" className="bg-green-50">
          <WireframePlaceholder h="h-3" color="bg-green-200" />
        </WireframeBox>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-1">
            <WireframeBox label="ITEM 1">
              <div className="flex gap-1">
                <WireframePlaceholder w="w-10" h="h-10" text="Img" color="bg-blue-100" />
                <div className="flex-1 space-y-1">
                  <WireframePlaceholder h="h-2" text="Producto" color="bg-gray-200" />
                  <WireframePlaceholder h="h-2" w="w-12" text="$299" color="bg-green-200" />
                  <div className="flex gap-1">
                    <WireframePlaceholder h="h-3" w="w-16" text="- 1 +" color="bg-gray-200" />
                    <WireframePlaceholder h="h-3" w="w-6" text="X" color="bg-red-100" />
                  </div>
                </div>
              </div>
            </WireframeBox>
            <WireframeBox label="ITEM 2">
              <div className="flex gap-1">
                <WireframePlaceholder w="w-10" h="h-10" text="Img" color="bg-blue-100" />
                <div className="flex-1 space-y-1">
                  <WireframePlaceholder h="h-2" text="Producto" color="bg-gray-200" />
                  <WireframePlaceholder h="h-2" w="w-12" text="$150" color="bg-green-200" />
                </div>
              </div>
            </WireframeBox>
          </div>
          <WireframeBox label="RESUMEN">
            <div className="space-y-1">
              <WireframePlaceholder h="h-2" text="Subtotal" color="bg-gray-100" />
              <WireframePlaceholder h="h-2" text="Envio: Gratis" color="bg-gray-100" />
              <WireframePlaceholder h="h-3" text="Total: $449" color="bg-green-200" />
              <WireframePlaceholder h="h-4" text="Proceder al Pago" color="bg-green-300" />
            </div>
          </WireframeBox>
        </div>
      </div>
    ),
  },
  {
    id: "checkout",
    title: "Checkout",
    route: "/checkout",
    role: "Comprador",
    icon: <CreditCard size={18} />,
    description:
      "Proceso de checkout simulado (sin datos bancarios). Incluye stepper visual de 3 pasos (Carrito > Confirmacion > Completado), resumen de productos, seleccion de direccion de envio (radio buttons), panel de total con aviso de 'pedido simulado', y estado de exito con folio, fecha, total, estado y direccion.",
    sections: [
      {
        name: "Stepper",
        elements: [
          "3 pasos con iconos circulares: Carrito (ShoppingCart), Confirmacion (CreditCard), Completado (Check)",
          "Lineas conectoras coloreadas segun progreso",
          "Labels debajo de cada paso",
        ],
      },
      {
        name: "Confirmacion (paso 2)",
        elements: [
          "Lista de items del carrito: imagen, nombre, cantidad, subtotal",
          "Seleccion de direccion con radio buttons estilizados",
          "Card si no hay direcciones con link a perfil",
          "Panel Total sticky: subtotal, envio, total, aviso simulado, boton confirmar",
        ],
      },
      {
        name: "Exito (paso 3)",
        elements: [
          "Icono CheckCircle verde grande",
          "Titulo 'Pedido Confirmado!'",
          "Card con datos: folio, fecha, total, estado",
          "Direccion de envio",
          "Botones: 'Ver Mis Pedidos' (outline) + 'Seguir Comprando' (filled)",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="STEPPER">
          <div className="flex items-center justify-center gap-1">
            <WireframePlaceholder w="w-6" h="h-6" text="1" color="bg-green-300" />
            <WireframePlaceholder w="w-8" h="h-1" color="bg-green-300" />
            <WireframePlaceholder w="w-6" h="h-6" text="2" color="bg-green-300" />
            <WireframePlaceholder w="w-8" h="h-1" color="bg-gray-200" />
            <WireframePlaceholder w="w-6" h="h-6" text="3" color="bg-gray-200" />
          </div>
        </WireframeBox>
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3 space-y-1">
            <WireframeBox label="RESUMEN PEDIDO">
              <WireframePlaceholder h="h-6" text="Items del carrito" color="bg-gray-100" />
            </WireframeBox>
            <WireframeBox label="DIRECCION ENVIO">
              <div className="space-y-1">
                <WireframePlaceholder h="h-4" text="◉ Casa - Calle 123..." color="bg-green-50" />
                <WireframePlaceholder h="h-4" text="○ Oficina - Av Reform..." color="bg-gray-50" />
              </div>
            </WireframeBox>
          </div>
          <div className="col-span-2">
            <WireframeBox label="TOTAL">
              <div className="space-y-1">
                <WireframePlaceholder h="h-2" text="Subtotal" color="bg-gray-100" />
                <WireframePlaceholder h="h-2" text="Envio: Gratis" color="bg-gray-100" />
                <WireframePlaceholder h="h-3" text="Total" color="bg-green-200" />
                <WireframePlaceholder h="h-3" text="⚠ Pedido simulado" color="bg-amber-100" />
                <WireframePlaceholder h="h-4" text="Confirmar Pedido" color="bg-green-300" />
              </div>
            </WireframeBox>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "profile",
    title: "Mi Cuenta / Perfil",
    route: "/perfil",
    role: "Comprador",
    icon: <User size={18} />,
    description:
      "Pagina de perfil del usuario con acceso rapido (3 cards: Mis Pedidos, Lista de Deseos, Cerrar Sesion), formulario editable de datos personales (nombre, email, telefono), y gestion de direcciones de envio (listar, agregar con formulario expandible, eliminar, marcar predeterminada).",
    sections: [
      {
        name: "Accesos Rapidos",
        elements: [
          "Card 'Mis Compras' con icono Package (link a /mis-compras)",
          "Card 'Lista de Deseos' con icono Heart (link a /wishlist)",
          "Card 'Cerrar Sesion' con icono LogOut",
        ],
      },
      {
        name: "Informacion Personal",
        elements: [
          "Avatar circular con inicial del nombre",
          "Nombre y rol del usuario",
          "Formulario: Nombre, Email, Telefono (grid 2 columnas)",
          "Boton 'Guardar Cambios'",
        ],
      },
      {
        name: "Direcciones de Envio",
        elements: [
          "Titulo con icono MapPin",
          "Boton '+ Agregar' que expande formulario",
          "Formulario: Etiqueta, Calle, Ciudad, Estado, CP (grid 2 col)",
          "Lista de direcciones con etiqueta, badge 'Predeterminada', direccion completa, boton eliminar",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="ACCESOS RAPIDOS">
          <div className="grid grid-cols-3 gap-1">
            <WireframePlaceholder h="h-8" text="Pedidos" color="bg-green-100" />
            <WireframePlaceholder h="h-8" text="Deseos" color="bg-red-100" />
            <WireframePlaceholder h="h-8" text="Salir" color="bg-gray-100" />
          </div>
        </WireframeBox>
        <WireframeBox label="INFO PERSONAL">
          <div className="flex gap-2 mb-1">
            <WireframePlaceholder w="w-8" h="h-8" text="A" color="bg-green-200" />
            <div className="flex-1 space-y-1">
              <WireframePlaceholder h="h-2" text="Nombre" color="bg-gray-200" />
              <WireframePlaceholder h="h-2" w="w-16" text="Rol" color="bg-gray-100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <WireframePlaceholder h="h-3" text="Nombre" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Email" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Telefono" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Guardar" color="bg-green-300" />
          </div>
        </WireframeBox>
        <WireframeBox label="DIRECCIONES">
          <div className="space-y-1">
            <WireframePlaceholder h="h-4" text="Casa - Calle 123, CDMX" color="bg-gray-100" />
            <WireframePlaceholder h="h-4" text="Oficina - Av Reforma 456" color="bg-gray-100" />
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    title: "Mis Compras",
    route: "/mis-compras",
    role: "Todos",
    icon: <Package size={18} />,
    description:
      "Lista de compras personales del usuario (sin importar su rol: comprador, vendedor o admin). Cada pedido muestra miniaturas de productos, folio, fecha, badge de estado (coloreado), total, dirección y método de pago. Las ventas del negocio se ven en /vendedor/pedidos.",
    sections: [
      {
        name: "Lista de Pedidos",
        elements: [
          "Card por pedido con: miniaturas apiladas (-space-x), folio, fecha con icono Calendar",
          "Badge de estado: Entregado (verde), Enviado (azul), En preparacion (ambar)",
          "Total del pedido",
          "Boton expandir/colapsar (ChevronDown/Up)",
        ],
      },
      {
        name: "Detalle Expandido",
        elements: [
          "Lista de items: imagen, nombre (link), cantidad, subtotal",
          "Direccion de envio del pedido",
        ],
      },
      {
        name: "Estado Vacio",
        elements: [
          "Icono Package semitransparente",
          "Titulo 'No tienes pedidos aun'",
          "Link 'Ir a comprar'",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-1">
        <WireframeBox label="PEDIDO #FE-001">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <WireframePlaceholder w="w-6" h="h-6" text="Img" color="bg-blue-100" />
              <div>
                <WireframePlaceholder h="h-2" w="w-16" text="#FE-001" color="bg-gray-200" />
                <WireframePlaceholder h="h-2" w="w-12" text="01/03/26" color="bg-gray-100" />
              </div>
            </div>
            <div className="flex gap-1">
              <WireframePlaceholder w="w-14" h="h-3" text="Entregado" color="bg-green-200" />
              <WireframePlaceholder w="w-10" h="h-3" text="$449" color="bg-gray-200" />
            </div>
          </div>
        </WireframeBox>
        <WireframeBox label="PEDIDO #FE-002 (expandido)">
          <WireframePlaceholder h="h-3" text="Encabezado" color="bg-gray-100" />
          <div className="mt-1 space-y-1 border-t border-dashed border-gray-200 pt-1">
            <WireframePlaceholder h="h-4" text="Item 1: Prod x2 = $299" color="bg-amber-50" />
            <WireframePlaceholder h="h-4" text="Item 2: Prod x1 = $150" color="bg-amber-50" />
            <WireframePlaceholder h="h-2" text="Direccion: Calle 123..." color="bg-gray-50" />
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "wishlist",
    title: "Lista de Deseos",
    route: "/wishlist",
    role: "Comprador",
    icon: <Heart size={18} />,
    description:
      "Grid de productos guardados como favoritos. Cada card muestra imagen (link al detalle), nombre, rating con estrellas, precio, boton 'Agregar al carrito' (si hay stock) o texto 'Agotado', y boton eliminar de la lista.",
    sections: [
      {
        name: "Grid de Wishlist",
        elements: [
          "Grid responsivo (1-2-3-4 columnas)",
          "Cards: imagen (link), nombre (link hover primario), StarRating, precio grande, boton agregar al carrito con icono ShoppingCart, boton eliminar (Trash2)",
          "Si stock = 0: texto 'Agotado' en rojo en vez del boton",
        ],
      },
      {
        name: "Estado Vacio",
        elements: [
          "Icono Heart semitransparente",
          "Titulo 'Tu lista de deseos esta vacia'",
          "Mensaje motivacional",
          "Boton 'Explorar Productos'",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframePlaceholder h="h-3" text="Lista de Deseos (3)" color="bg-gray-200" />
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3].map((i) => (
            <WireframeBox key={i} label={`PROD ${i}`}>
              <WireframePlaceholder h="h-10" text="Imagen" color="bg-blue-100" />
              <div className="mt-1 space-y-0.5">
                <WireframePlaceholder h="h-2" text="Nombre" color="bg-gray-200" />
                <WireframePlaceholder h="h-2" w="w-10" text="★★★★" color="bg-amber-100" />
                <WireframePlaceholder h="h-2" w="w-8" text="$299" color="bg-green-200" />
                <div className="flex gap-0.5">
                  <WireframePlaceholder h="h-3" text="Agregar" color="bg-green-300" />
                  <WireframePlaceholder h="h-3" w="w-5" text="X" color="bg-red-100" />
                </div>
              </div>
            </WireframeBox>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "seller-products",
    title: "Mis Productos (Vendedor)",
    route: "/vendedor/productos",
    role: "Vendedor",
    icon: <Package size={18} />,
    description:
      "CRUD completo de productos del vendedor. Tabla con columnas: Producto (imagen+nombre), Precio, Stock (badge coloreado), Categoria, Estado (Activo/Inactivo), Acciones (editar, desactivar, eliminar). Formulario modal para crear/editar con campos: nombre, descripcion, precio, stock, categoria, upload de imagenes. Barra de busqueda para filtrar.",
    sections: [
      {
        name: "Barra Superior",
        elements: [
          "Titulo 'Mis Productos'",
          "Boton '+ Nuevo Producto' que abre formulario",
          "Barra de busqueda con icono Search",
        ],
      },
      {
        name: "Formulario Crear/Editar",
        elements: [
          "Titulo dinamico: 'Nuevo Producto' o 'Editar Producto'",
          "Campos: Nombre (full), Descripcion (textarea full), Precio y Stock (2 col), Categoria select (fiestas) e Imagenes (drag/drop area)",
          "Botones: Crear/Actualizar + Cancelar",
        ],
      },
      {
        name: "Tabla de Productos",
        elements: [
          "Encabezados: Producto, Precio, Stock, Categoria, Estado, Acciones",
          "Stock con badge: rojo (0), ambar (<10), verde (>10)",
          "Estado: badge verde 'Activo' o gris 'Inactivo'",
          "Acciones: Edit (editar), EyeOff/Eye (toggle activo), Trash2 (eliminar)",
          "Hover en filas",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="flex gap-2">
          <WireframeBox label="SIDEBAR" className="w-24 bg-gray-50">
            <div className="space-y-1">
              <WireframePlaceholder h="h-3" text="Productos" color="bg-green-200" />
              <WireframePlaceholder h="h-3" text="Inventario" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" text="Paquetes" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" text="Pedidos" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" text="Ventas" color="bg-gray-200" />
            </div>
          </WireframeBox>
          <div className="flex-1 space-y-1">
            <div className="flex gap-1">
              <WireframePlaceholder h="h-3" text="Mis Productos" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" w="w-20" text="+ Nuevo" color="bg-green-300" />
            </div>
            <WireframePlaceholder h="h-3" text="🔍 Buscar..." color="bg-gray-100" />
            <WireframeBox label="TABLA">
              <div className="space-y-0.5">
                <WireframePlaceholder h="h-2" text="Producto | Precio | Stock | Cat | Estado | ⚙" color="bg-gray-300" />
                <WireframePlaceholder h="h-3" text="Prod 1 | $299 | 25 ● | Bodas | Activo | ✎🚫🗑" color="bg-gray-100" />
                <WireframePlaceholder h="h-3" text="Prod 2 | $150 | 3 ⚠ | Cumple | Activo | ✎🚫🗑" color="bg-amber-50" />
                <WireframePlaceholder h="h-3" text="Prod 3 | $89 | 0 ✗ | Navid | Inactivo | ✎👁🗑" color="bg-red-50" />
              </div>
            </WireframeBox>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "seller-inventory",
    title: "Control de Inventario",
    route: "/vendedor/inventario",
    role: "Vendedor",
    icon: <Boxes size={18} />,
    description:
      "Panel de control de inventario con 3 KPI cards (Total Productos, Stock Bajo, Agotados), y tabla editable con columnas: Producto (imagen+nombre), Stock Actual (input numerico editable in-place), Estado (badge con icono: En Stock/Stock Bajo/Agotado), y botones de ajuste rapido (-1, +10). Filas con stock bajo resaltadas en rojo claro.",
    sections: [
      {
        name: "KPI Cards",
        elements: [
          "Total Productos (color primario)",
          "Stock Bajo (color ambar)",
          "Agotados (color rojo)",
        ],
      },
      {
        name: "Tabla de Inventario",
        elements: [
          "Columnas: Producto, Stock Actual, Estado, Ajustar",
          "Stock: input numerico editable directamente",
          "Estado: badge con icono (Check verde, AlertTriangle ambar, XCircle rojo)",
          "Ajustar: botones -1 y +10",
          "Filas con stock < 10 tienen fondo rojo suave",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-1">
          <WireframePlaceholder h="h-8" text="Total: 8" color="bg-green-100" />
          <WireframePlaceholder h="h-8" text="Bajo: 2" color="bg-amber-100" />
          <WireframePlaceholder h="h-8" text="Agotado: 1" color="bg-red-100" />
        </div>
        <WireframeBox label="TABLA INVENTARIO">
          <div className="space-y-0.5">
            <WireframePlaceholder h="h-2" text="Producto | Stock | Estado | Ajustar" color="bg-gray-300" />
            <WireframePlaceholder h="h-3" text="Prod 1 | [25] | ✓ En Stock | -1 +10" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Prod 2 | [3] | ⚠ Stock Bajo | -1 +10" color="bg-amber-50" />
            <WireframePlaceholder h="h-3" text="Prod 3 | [0] | ✗ Agotado | -1 +10" color="bg-red-50" />
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "seller-bundles",
    title: "Paquetes Promocionales",
    route: "/vendedor/paquetes",
    role: "Vendedor",
    icon: <Gift size={18} />,
    description:
      "Gestion de paquetes/bundles del vendedor. Formulario para crear bundles: nombre del paquete, precio del paquete, checkboxes de productos a incluir (con imagen, nombre y precio). Lista de bundles existentes con nombre, lista de productos incluidos, precio original vs precio del paquete, porcentaje de ahorro, y botones editar/eliminar.",
    sections: [
      {
        name: "Formulario Crear Bundle",
        elements: [
          "Input nombre del paquete",
          "Input precio del paquete (numerico)",
          "Lista de productos del vendedor con checkboxes, imagen, nombre y precio",
          "Botones Crear Paquete + Cancelar",
        ],
      },
      {
        name: "Lista de Bundles",
        elements: [
          "Cards por bundle: nombre, productos incluidos con imagenes",
          "Precio paquete vs precio original",
          "Badge de ahorro en porcentaje",
          "Botones: Editar (Edit) y Eliminar (Trash2)",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <WireframeBox label="CREAR PAQUETE">
          <div className="grid grid-cols-2 gap-1">
            <WireframePlaceholder h="h-3" text="Nombre paquete" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Precio $" color="bg-gray-100" />
          </div>
          <div className="mt-1 space-y-0.5">
            <WireframePlaceholder h="h-3" text="☑ Prod 1 - $299" color="bg-green-50" />
            <WireframePlaceholder h="h-3" text="☐ Prod 2 - $150" color="bg-gray-50" />
            <WireframePlaceholder h="h-3" text="☑ Prod 3 - $89" color="bg-green-50" />
          </div>
          <WireframePlaceholder h="h-3" text="Crear Paquete" color="bg-green-300" />
        </WireframeBox>
        <WireframeBox label="BUNDLES EXISTENTES">
          <div className="grid grid-cols-2 gap-1">
            <WireframeBox label="Pack Fiesta">
              <WireframePlaceholder h="h-4" text="3 productos" color="bg-purple-100" />
              <WireframePlaceholder h="h-2" text="$350 (antes $538) -35%" color="bg-green-100" />
            </WireframeBox>
            <WireframeBox label="Pack Premium">
              <WireframePlaceholder h="h-4" text="4 productos" color="bg-purple-100" />
              <WireframePlaceholder h="h-2" text="$800 (antes $1120) -29%" color="bg-green-100" />
            </WireframeBox>
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "seller-orders",
    title: "Pedidos Recibidos (Vendedor)",
    route: "/vendedor/pedidos",
    role: "Vendedor",
    icon: <ClipboardList size={18} />,
    description:
      "Gestion de pedidos recibidos por el vendedor con filtros por estado (Todos, En preparacion, Enviado, Entregado). Lista accordion con folio, fecha, comprador, total, badge de estado. Al expandir: detalle de items y select para actualizar estado del pedido.",
    sections: [
      {
        name: "Filtros",
        elements: [
          "Botones tipo toggle: Todos, En preparacion, Enviado, Entregado",
          "Boton activo con color primario",
        ],
      },
      {
        name: "Lista de Pedidos",
        elements: [
          "Card por pedido: folio, fecha (Calendar), nombre comprador, total",
          "Badge de estado coloreado",
          "Expandible con ChevronDown/Up",
        ],
      },
      {
        name: "Detalle Expandido",
        elements: [
          "Items: imagen, nombre, cantidad x precio, subtotal",
          "Direccion de envio",
          "Select para actualizar estado: En preparacion / Enviado / Entregado",
          "Toast de confirmacion al cambiar estado",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="flex gap-1">
          <WireframePlaceholder h="h-3" w="w-12" text="Todos" color="bg-green-300" />
          <WireframePlaceholder h="h-3" w="w-16" text="En prep" color="bg-gray-200" />
          <WireframePlaceholder h="h-3" w="w-14" text="Enviado" color="bg-gray-200" />
          <WireframePlaceholder h="h-3" w="w-16" text="Entregado" color="bg-gray-200" />
        </div>
        <WireframeBox label="PEDIDO #FE-001 (expandido)">
          <div className="flex justify-between mb-1">
            <WireframePlaceholder w="w-20" h="h-2" text="#FE-001 | 01/03" color="bg-gray-200" />
            <WireframePlaceholder w="w-16" h="h-2" text="Enviado" color="bg-blue-200" />
          </div>
          <div className="border-t border-dashed pt-1 space-y-0.5">
            <WireframePlaceholder h="h-3" text="Item 1 x2 = $598" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Item 2 x1 = $150" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Actualizar: [Enviado ▾]" color="bg-amber-100" />
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "seller-sales",
    title: "Resumen de Ventas",
    route: "/vendedor/ventas",
    role: "Vendedor",
    icon: <BarChart3 size={18} />,
    description:
      "Dashboard de metricas del vendedor con 4 KPI cards (Total Ordenes, Ingresos Totales, Calificacion Promedio, Productos Activos), 2 graficas (barras para ordenes/mes y linea para ingresos/mes usando Recharts), y lista de productos mejor calificados con ranking, imagen, nombre, resenas y rating.",
    sections: [
      {
        name: "KPI Cards (4 columnas)",
        elements: [
          "Total Ordenes con icono ShoppingBag (fondo primary/10)",
          "Ingresos Totales con icono DollarSign (fondo green-50)",
          "Calificacion Promedio con icono Star (fondo amber-50)",
          "Productos Activos con icono TrendingUp (fondo blue-50)",
        ],
      },
      {
        name: "Graficas (2 columnas)",
        elements: [
          "BarChart: Ordenes por Mes (Oct-Mar) con barras color primario",
          "LineChart: Ingresos por Mes (MXN) con linea color primario",
          "Ambas con CartesianGrid, XAxis, YAxis, Tooltip (Recharts)",
        ],
      },
      {
        name: "Productos Mejor Calificados",
        elements: [
          "Top 5 productos ordenados por rating",
          "Cada fila: ranking (#1-#5) con badge, imagen, nombre, conteo de resenas, rating con estrella",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-1">
          <WireframePlaceholder h="h-8" text="Ordenes: 130" color="bg-green-100" />
          <WireframePlaceholder h="h-8" text="$99,300" color="bg-green-100" />
          <WireframePlaceholder h="h-8" text="★ 4.6" color="bg-amber-100" />
          <WireframePlaceholder h="h-8" text="Prods: 8" color="bg-blue-100" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <WireframeBox label="ORDENES/MES (Barras)">
            <div className="flex items-end gap-0.5 h-12">
              {[30, 50, 90, 60, 75, 40].map((h, i) => (
                <div key={i} className="flex-1 bg-green-300 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </WireframeBox>
          <WireframeBox label="INGRESOS/MES (Linea)">
            <div className="h-12 flex items-center">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <polyline
                  points="5,30 20,25 40,10 55,18 75,12 95,22"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </WireframeBox>
        </div>
        <WireframeBox label="TOP PRODUCTOS">
          <div className="space-y-0.5">
            {[1, 2, 3].map((i) => (
              <WireframePlaceholder key={i} h="h-3" text={`#${i} | Producto ${i} | ★${(5 - i * 0.2).toFixed(1)}`} color="bg-gray-100" />
            ))}
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "admin-users",
    title: "Gestion de Usuarios",
    route: "/admin/usuarios",
    role: "Admin",
    icon: <Users size={18} />,
    description:
      "Panel de administracion de usuarios con busqueda, filtros por rol (Todos/Compradores/Vendedores) y estado (Todos/Activos/Bloqueados). Tabla con avatar+nombre+email, badge de rol (azul comprador, morado vendedor), fecha de registro, badge de estado (verde activo, rojo bloqueado), acciones bloquear/desbloquear y eliminar con modal de confirmacion.",
    sections: [
      {
        name: "Filtros y Busqueda",
        elements: [
          "Input busqueda con icono Search (busca nombre y email)",
          "Select filtro por rol: Todos, Compradores, Vendedores",
          "Select filtro por estado: Todos, Activos, Bloqueados",
        ],
      },
      {
        name: "Tabla de Usuarios",
        elements: [
          "Columnas: Usuario (avatar+nombre+email), Rol, Registro, Estado, Acciones",
          "Avatar circular con inicial y fondo primary/10",
          "Rol: badge azul (comprador) o morado (vendedor)",
          "Estado: badge verde (Activo) o rojo (Bloqueado)",
          "Acciones: ShieldOff/Shield (bloquear/desbloquear) + Trash2 (eliminar)",
        ],
      },
      {
        name: "Modal Confirmacion Eliminar",
        elements: [
          "Overlay oscuro (bg-black/50)",
          "Card centrada con titulo 'Confirmar Eliminacion'",
          "Mensaje de advertencia irreversible",
          "Botones: Cancelar (outline) + Eliminar (rojo)",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="flex gap-2">
          <WireframeBox label="SIDEBAR" className="w-24 bg-gray-50">
            <div className="space-y-1">
              <WireframePlaceholder h="h-3" text="Usuarios" color="bg-green-200" />
              <WireframePlaceholder h="h-3" text="Reportes" color="bg-gray-200" />
            </div>
          </WireframeBox>
          <div className="flex-1 space-y-1">
            <div className="flex gap-1">
              <WireframePlaceholder h="h-3" text="🔍 Buscar..." color="bg-gray-100" />
              <WireframePlaceholder h="h-3" w="w-16" text="Rol ▾" color="bg-gray-200" />
              <WireframePlaceholder h="h-3" w="w-16" text="Estado ▾" color="bg-gray-200" />
            </div>
            <WireframeBox label="TABLA USUARIOS">
              <div className="space-y-0.5">
                <WireframePlaceholder h="h-2" text="Usuario | Rol | Fecha | Estado | ⚙" color="bg-gray-300" />
                <WireframePlaceholder h="h-3" text="Juan | Comprador | 15/01 | Activo | 🛡🗑" color="bg-gray-100" />
                <WireframePlaceholder h="h-3" text="Maria | Vendedor | 20/02 | Activo | 🛡🗑" color="bg-gray-100" />
                <WireframePlaceholder h="h-3" text="Pedro | Comprador | 03/03 | Bloqueado | ✓🗑" color="bg-red-50" />
              </div>
            </WireframeBox>
          </div>
        </div>
        <WireframeBox label="MODAL ELIMINAR (overlay)">
          <div className="text-center space-y-1">
            <WireframePlaceholder h="h-2" text="Confirmar Eliminacion" color="bg-gray-200" />
            <WireframePlaceholder h="h-2" text="Accion irreversible" color="bg-gray-100" />
            <div className="flex gap-1 justify-center">
              <WireframePlaceholder w="w-16" h="h-3" text="Cancelar" color="bg-gray-200" />
              <WireframePlaceholder w="w-16" h="h-3" text="Eliminar" color="bg-red-300" />
            </div>
          </div>
        </WireframeBox>
      </div>
    ),
  },
  {
    id: "admin-reports",
    title: "Reportes y Denuncias",
    route: "/admin/reportes",
    role: "Admin",
    icon: <Flag size={18} />,
    description:
      "Sistema de reportes/denuncias con filtros por estado (Todos, Pendiente, Revisado, Resuelto). Lista accordion donde cada reporte muestra: icono de estado, ID, reportador, reportado, categoria (Producto/Usuario), fecha, badge de estado. Al expandir: razon, descripcion detallada, y botones de accion (Resolver, Advertir Usuario, Bloquear Usuario, Desestimar).",
    sections: [
      {
        name: "Filtros",
        elements: [
          "Botones toggle: Todos, Pendiente, Revisado, Resuelto",
          "Icono Filter",
          "Contador de pendientes en subtitulo",
        ],
      },
      {
        name: "Lista de Reportes",
        elements: [
          "Card por reporte: icono estado (CheckCircle verde, AlertTriangle ambar, Clock rojo)",
          "ID del reporte en mayusculas",
          "Nombre del reportador y reportado",
          "Badge categoria: Producto (azul) o Usuario (morado)",
          "Fecha y badge de estado",
          "Expandible con chevron",
        ],
      },
      {
        name: "Detalle Expandido",
        elements: [
          "Razon del reporte (titulo)",
          "Descripcion detallada (parrafo)",
          "4 botones de accion:",
          "  - Resolver (verde con CheckCircle)",
          "  - Advertir Usuario (ambar con AlertTriangle)",
          "  - Bloquear Usuario (rojo con ShieldOff)",
          "  - Desestimar (outline con X)",
        ],
      },
    ],
    wireframe: (
      <div className="space-y-2">
        <div className="flex gap-1">
          <WireframePlaceholder h="h-3" w="w-12" text="Todos" color="bg-green-300" />
          <WireframePlaceholder h="h-3" w="w-16" text="Pendiente" color="bg-gray-200" />
          <WireframePlaceholder h="h-3" w="w-14" text="Revisado" color="bg-gray-200" />
          <WireframePlaceholder h="h-3" w="w-14" text="Resuelto" color="bg-gray-200" />
        </div>
        <WireframeBox label="REPORTE #R1 (expandido)">
          <div className="flex justify-between mb-1">
            <WireframePlaceholder w="w-32" h="h-2" text="⏱ #R1 | Juan → Maria | Producto" color="bg-gray-200" />
            <WireframePlaceholder w="w-14" h="h-2" text="Pendiente" color="bg-red-200" />
          </div>
          <div className="border-t border-dashed pt-1 space-y-1">
            <WireframePlaceholder h="h-2" text="Razon: Producto falso" color="bg-gray-100" />
            <WireframePlaceholder h="h-3" text="Descripcion del reporte..." color="bg-gray-50" />
            <div className="flex gap-0.5">
              <WireframePlaceholder h="h-3" text="✓ Resolver" color="bg-green-200" />
              <WireframePlaceholder h="h-3" text="⚠ Advertir" color="bg-amber-200" />
              <WireframePlaceholder h="h-3" text="🛡 Bloquear" color="bg-red-200" />
              <WireframePlaceholder h="h-3" text="✗ Desestimar" color="bg-gray-200" />
            </div>
          </div>
        </WireframeBox>
        <WireframeBox label="REPORTE #R2">
          <WireframePlaceholder h="h-3" text="✓ #R2 | Pedro → FiestaMax | Usuario | Resuelto" color="bg-green-50" />
        </WireframeBox>
      </div>
    ),
  },
];

const sharedComponents = [
  {
    name: "Navbar",
    file: "/src/app/components/layout/navbar.tsx",
    description:
      "Barra de navegacion sticky superior con gradiente azul oscuro. Contiene: logo con icono Store + nombre, barra de busqueda con autocomplete (muestra imagen, nombre y precio), iconos de usuario (con menu dropdown: Mi Cuenta, Mis Pedidos, Panel segun rol, Cerrar Sesion), wishlist con badge contador, carrito con badge contador. Barra de categorias secundaria. Menu hamburguesa responsive para movil.",
  },
  {
    name: "Footer",
    file: "/src/app/components/layout/footer.tsx",
    description:
      "Footer con fondo verde muy oscuro y 4 columnas: (1) Logo + descripcion del marketplace, (2) Links de categorias de fiestas, (3) Links de cuenta (Perfil, Pedidos, Deseos, Carrito), (4) Links de vendedores. Barra inferior con copyright.",
  },
  {
    name: "DashboardLayout",
    file: "/src/app/components/layout/dashboard-layout.tsx",
    description:
      "Layout compartido para paneles de Vendedor y Admin. Sidebar izquierdo con titulo y links de navegacion (NavLink con estilo activo primary/10). En movil, la sidebar se convierte en barra horizontal con scroll. Incluye Navbar arriba y Footer abajo. Contenido via Outlet.",
  },
  {
    name: "ProductCard",
    file: "/src/app/components/product-card.tsx",
    description:
      "Tarjeta de producto reutilizable con: imagen (aspect-square con hover scale), badge de descuento ambar si tiene precio original, botones hover (carrito + wishlist con iconos ShoppingCart y Heart), nombre truncado a 2 lineas, precio actual en primary + precio original tachado, StarRating con conteo, nombre del vendedor en muted. Link completo al detalle.",
  },
  {
    name: "StarRating",
    file: "/src/app/components/star-rating.tsx",
    description:
      "Componente de estrellas reutilizable. Props: rating (0-5, soporta medias estrellas), size, showCount, count, interactive (para formularios), onChange. Renderiza 5 estrellas con fill parcial via clip-path. Modo interactivo con hover y click.",
  },
];

export function WireframesPage() {
  const [activeScreen, setActiveScreen] = useState<string>("home");
  const [showShared, setShowShared] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const activeDoc = screens.find((s) => s.id === activeScreen);

  const roleColors: Record<string, string> = {
    Publico: "bg-gray-100 text-gray-700",
    Comprador: "bg-blue-100 text-blue-700",
    Vendedor: "bg-purple-100 text-purple-700",
    Admin: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>
                Wireframes - TultiMarket
              </h1>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>
                Documentacion de {screens.length} pantallas + {sharedComponents.length} componentes compartidos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              style={{ fontSize: 14 }}
            >
              <Eye size={16} /> Ver App
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Screen List */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-20">
              <div className="p-4 border-b border-border">
                <h2 style={{ fontSize: 16, fontWeight: 600 }}>Pantallas</h2>
              </div>
              <nav className="p-2 max-h-[60vh] overflow-y-auto">
                {/* Group by role */}
                {(["Publico", "Comprador", "Vendedor", "Admin"] as const).map((role) => {
                  const roleScreens = screens.filter((s) => s.role === role);
                  if (roleScreens.length === 0) return null;
                  return (
                    <div key={role} className="mb-2">
                      <p
                        className="px-3 py-1 text-muted-foreground"
                        style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}
                      >
                        {role}
                      </p>
                      {roleScreens.map((screen) => (
                        <button
                          key={screen.id}
                          onClick={() => {
                            setActiveScreen(screen.id);
                            setShowShared(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                            activeScreen === screen.id && !showShared
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-gray-50"
                          }`}
                          style={{ fontSize: 13 }}
                        >
                          {screen.icon}
                          <span className="truncate">{screen.title}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={() => setShowShared(true)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                      showShared
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-gray-50"
                    }`}
                    style={{ fontSize: 13 }}
                  >
                    <Layout size={18} />
                    Componentes Compartidos
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {showShared ? (
              <div className="space-y-4">
                <h2 style={{ fontSize: 24, fontWeight: 600 }}>Componentes Compartidos</h2>
                <p className="text-muted-foreground" style={{ fontSize: 15 }}>
                  Estos componentes se reutilizan en multiples pantallas de la aplicacion.
                </p>
                {sharedComponents.map((comp) => (
                  <div key={comp.name} className="bg-white rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 style={{ fontSize: 18, fontWeight: 600 }}>{comp.name}</h3>
                      <code
                        className="bg-gray-100 text-muted-foreground px-2 py-1 rounded"
                        style={{ fontSize: 12 }}
                      >
                        {comp.file}
                      </code>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.7 }}>
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : activeDoc ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 style={{ fontSize: 24, fontWeight: 600 }}>{activeDoc.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full ${roleColors[activeDoc.role]}`}
                      style={{ fontSize: 12, fontWeight: 500 }}
                    >
                      {activeDoc.role}
                    </span>
                    <code
                      className="bg-gray-100 text-muted-foreground px-3 py-1 rounded"
                      style={{ fontSize: 13 }}
                    >
                      {activeDoc.route}
                    </code>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: 15, lineHeight: 1.7 }}>
                    {activeDoc.description}
                  </p>
                </div>

                {/* Live Preview + Wireframe side by side */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="flex items-center gap-2" style={{ fontSize: 16, fontWeight: 600 }}>
                      <Eye size={18} /> Captura en Vivo de la Pantalla
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewMode("desktop")}
                        className={`p-2 rounded-lg transition-colors ${
                          previewMode === "desktop"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-gray-100"
                        }`}
                        title="Vista Desktop"
                      >
                        <Monitor size={18} />
                      </button>
                      <button
                        onClick={() => setPreviewMode("mobile")}
                        className={`p-2 rounded-lg transition-colors ${
                          previewMode === "mobile"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-gray-100"
                        }`}
                        title="Vista Mobile"
                      >
                        <Smartphone size={18} />
                      </button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <button
                        onClick={() => setPreviewExpanded(!previewExpanded)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-gray-100 transition-colors"
                        title={previewExpanded ? "Reducir" : "Expandir"}
                      >
                        {previewExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                      </button>
                      <a
                        href={activeDoc.route.includes(":") ? activeDoc.route.replace(":id", "p1") : activeDoc.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                        style={{ fontSize: 13 }}
                      >
                        <ExternalLink size={14} /> Abrir
                      </a>
                    </div>
                  </div>
                  <div
                    className={`mx-auto bg-gray-100 rounded-xl border-2 border-border overflow-hidden transition-all duration-300 ${
                      previewMode === "mobile" ? "max-w-[375px]" : "w-full"
                    }`}
                  >
                    {/* Browser chrome mockup */}
                    <div className="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div
                        className="flex-1 bg-white rounded px-3 py-1 text-muted-foreground truncate"
                        style={{ fontSize: 11 }}
                      >
                        localhost:3000{activeDoc.route.includes(":") ? activeDoc.route.replace(":id", "p1") : activeDoc.route}
                      </div>
                    </div>
                    <iframe
                      key={`${activeDoc.id}-${previewMode}`}
                      src={activeDoc.route.includes(":") ? activeDoc.route.replace(":id", "p1") : activeDoc.route}
                      title={`Vista previa: ${activeDoc.title}`}
                      className="w-full bg-white"
                      style={{
                        height: previewExpanded ? 900 : 550,
                        border: "none",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-center mt-3" style={{ fontSize: 12 }}>
                    Vista previa en vivo ({previewMode === "desktop" ? "Desktop" : "Mobile 375px"}) — La interaccion esta deshabilitada. Usa "Abrir" para navegar.
                  </p>
                </div>

                {/* Wireframe */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: 16, fontWeight: 600 }}>
                    <Monitor size={18} /> Wireframe Esquematico
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-border p-4">
                    {activeDoc.wireframe}
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>Secciones y Elementos</h3>
                  {activeDoc.sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-border p-6"
                    >
                      <h4
                        className="mb-3 flex items-center gap-2"
                        style={{ fontSize: 16, fontWeight: 600 }}
                      >
                        <span
                          className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center"
                          style={{ fontSize: 12, fontWeight: 700 }}
                        >
                          {idx + 1}
                        </span>
                        {section.name}
                      </h4>
                      <ul className="space-y-2">
                        {section.elements.map((el, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-muted-foreground"
                            style={{ fontSize: 14 }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                            {el}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

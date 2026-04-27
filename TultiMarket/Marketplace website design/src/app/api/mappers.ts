import type {
  Product,
  Review,
  User,
  Address,
  PaymentMethod,
  Order,
} from "../data/mock-data";

const API_BASE = "http://localhost:3000";

function toImageUrl(path: string | null | undefined): string {
  if (!path) return "https://placehold.co/400x400?text=Sin+imagen";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function mapImageGallery(
  imagenPrincipal: string | null | undefined,
  imagenes: Array<{ url_imagen: string; orden_visual: number }> | null | undefined
): string[] {
  const ordered = (imagenes ?? [])
    .slice()
    .sort((a, b) => Number(a.orden_visual) - Number(b.orden_visual))
    .map((item) => toImageUrl(item.url_imagen));

  const fallback = toImageUrl(imagenPrincipal);
  return [...new Set(ordered.length > 0 ? ordered : [fallback])];
}

function formatBranchAddress(
  direccion:
    | {
        calle: string | null;
        ciudad: string | null;
        estado: string | null;
        codigo_postal: string | null;
        pais: string | null;
      }
    | null
    | undefined
): string | undefined {
  if (!direccion) return undefined;

  const parts = [
    direccion.calle,
    direccion.ciudad,
    direccion.estado,
    direccion.codigo_postal,
    direccion.pais,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : undefined;
}

export interface RawResena {
  id: number;
  calificacion: number;
  comentario: string | null;
  compra_verificada: boolean;
  fecha_creacion: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

export interface RawProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string | null;
  calificacion: number | null;
  precio: number;
  sku: string | null;
  fecha_registro: string;
  imagen_principal: string | null;
  imagenes: Array<{
    id: number;
    url_imagen: string;
    es_principal: boolean;
    orden_visual: number;
  }>;
  empresa: string;
  id_negocio: number | null;
  sucursal: {
    nombre: string;
    direccion: {
      calle: string | null;
      ciudad: string | null;
      estado: string | null;
      codigo_postal: string | null;
      pais: string | null;
    };
  } | null;
  stock_total: number;
  numero_resenas: number;
  categorias: string[];
  resenas: RawResena[];
}

export interface RawProductoLista {
  id: number;
  nombre: string;
  calificacion: number | null;
  precio: number;
  imagen_principal: string | null;
  empresa: string;
  numero_resenas: number;
}

export interface RawServicioDetalle {
  id: number;
  nombre: string;
  descripcion: string | null;
  calificacion: number | null;
  precio: number;
  duracion_minutos: number | null;
  fecha_registro: string;
  imagen_principal: string | null;
  imagenes: Array<{
    id: number;
    url_imagen: string;
    es_principal: boolean;
    orden_visual: number;
  }>;
  empresa: string;
  id_negocio: number | null;
  sucursal: {
    nombre: string;
    direccion: {
      calle: string | null;
      ciudad: string | null;
      estado: string | null;
      codigo_postal: string | null;
      pais: string | null;
    };
  } | null;
  numero_resenas: number;
  categorias: string[];
  resenas: RawResena[];
  agenda_disponible: RawAgendaSlot[];
}

export interface RawAgendaSlot {
  id: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  estado: string;
}

export interface RawCategoria {
  id: number;
  nombre: string;
  tipo: "producto" | "servicio" | "ambos";
}

export interface RawUsuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: "comprador" | "vendedor" | "admin";
}

export interface RawDireccion {
  id: number;
  calle: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  es_principal: boolean;
  tipo_direccion: string;
}

export interface RawMetodoPago {
  id: number;
  proveedor_pago: string;
  ultimos_cuatro: string;
  fecha_expiracion: string;
}

export interface RawPedidoItem {
  id: number;
  type: "producto" | "servicio";
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface RawPedido {
  id: number;
  folio: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  total: number;
  status: string;
  address: Record<string, unknown>;
  items: RawPedidoItem[];
}

export function mapResena(raw: RawResena): Review {
  return {
    id: String(raw.id),
    userId: String(raw.usuario.id),
    userName: raw.usuario.nombre,
    rating: raw.calificacion,
    comment: raw.comentario ?? "",
    date: raw.fecha_creacion.split("T")[0],
    verifiedPurchase: raw.compra_verificada,
  };
}

export function mapProductoDetalle(raw: RawProductoDetalle): Product {
  const gallery = mapImageGallery(raw.imagen_principal, raw.imagenes);

  return {
    id: String(raw.id),
    name: raw.nombre,
    description: raw.descripcion ?? "",
    price: Number(raw.precio),
    image: gallery[0],
    images: gallery,
    category: raw.categorias[0] ?? "general",
    rating: raw.calificacion ?? 0,
    reviewCount: raw.numero_resenas,
    stock: raw.stock_total,
    sellerId: String(raw.id_negocio ?? 0),
    sellerName: raw.empresa,
    reviews: raw.resenas.map(mapResena),
    type: "producto",
    status: "Aprobado",
    sku: raw.sku ?? undefined,
    publicationDate: raw.fecha_registro?.split("T")[0],
    branchName: raw.sucursal?.nombre,
    branchAddress: formatBranchAddress(raw.sucursal?.direccion),
    businessId: raw.id_negocio !== null ? String(raw.id_negocio) : undefined,
  };
}

export function mapProductoLista(raw: RawProductoLista): Product {
  return {
    id: String(raw.id),
    name: raw.nombre,
    description: "",
    price: Number(raw.precio),
    image: toImageUrl(raw.imagen_principal),
    images: [toImageUrl(raw.imagen_principal)],
    category: "general",
    rating: raw.calificacion ?? 0,
    reviewCount: raw.numero_resenas,
    stock: 0,
    sellerId: "0",
    sellerName: raw.empresa,
    reviews: [],
    type: "producto",
    status: "Aprobado",
  };
}

export function mapServicioDetalle(raw: RawServicioDetalle): Product {
  const gallery = mapImageGallery(raw.imagen_principal, raw.imagenes);

  return {
    id: String(raw.id),
    name: raw.nombre,
    description: raw.descripcion ?? "",
    price: Number(raw.precio),
    image: gallery[0],
    images: gallery,
    category: raw.categorias[0] ?? "general",
    rating: raw.calificacion ?? 0,
    reviewCount: raw.numero_resenas,
    stock: 99,
    sellerId: String(raw.id_negocio ?? 0),
    sellerName: raw.empresa,
    reviews: raw.resenas.map(mapResena),
    type: "servicio",
    durationMin: raw.duracion_minutos ?? undefined,
    availability: raw.agenda_disponible.length > 0
      ? `${raw.agenda_disponible.length} horarios disponibles`
      : "Sin horarios disponibles",
    status: "Aprobado",
    publicationDate: raw.fecha_registro?.split("T")[0],
    branchName: raw.sucursal?.nombre,
    branchAddress: formatBranchAddress(raw.sucursal?.direccion),
    businessId: raw.id_negocio !== null ? String(raw.id_negocio) : undefined,
  };
}

export function mapUsuario(raw: RawUsuario): User {
  return {
    id: String(raw.id),
    name: raw.nombre,
    email: raw.email,
    role: raw.rol,
    registrationDate: new Date().toISOString().split("T")[0],
    status: "Activo",
    phone: raw.telefono ?? undefined,
  };
}

export function mapDireccion(raw: RawDireccion): Address {
  return {
    id: String(raw.id),
    label: raw.tipo_direccion === "hogar" ? "Casa" :
      raw.tipo_direccion === "trabajo" ? "Oficina" : raw.tipo_direccion,
    street: raw.calle,
    city: raw.ciudad,
    state: raw.estado,
    zip: raw.codigo_postal,
    country: raw.pais,
    isDefault: raw.es_principal,
  };
}

export function mapDireccionToBack(addr: Omit<Address, "id">): object {
  return {
    calle: addr.street,
    ciudad: addr.city,
    estado: addr.state,
    codigo_postal: addr.zip,
    pais: addr.country,
    es_principal: addr.isDefault,
    tipo_direccion: addr.label === "Casa" ? "hogar" :
      addr.label === "Oficina" ? "trabajo" : "otro",
  };
}

export function mapMetodoPago(raw: RawMetodoPago): PaymentMethod {
  return {
    id: String(raw.id),
    userId: "0",
    provider: raw.proveedor_pago,
    lastFour: raw.ultimos_cuatro,
    expiry: raw.fecha_expiracion,
    isDefault: false,
  };
}

export function mapPedidoVendedor(raw: RawPedido): Order {
  const items = raw.items.map((item) => ({
    product: {
      id: String(item.id),
      name: item.name,
      description: "",
      price: item.price,
      image: "",
      images: [],
      category: "general",
      rating: 0,
      reviewCount: 0,
      stock: 0,
      sellerId: "0",
      sellerName: "",
      reviews: [],
      type: item.type,
      status: "Aprobado" as const,
    },
    quantity: item.quantity,
  }));

  const statusMap: Record<string, Order["status"]> = {
    "PENDIENTE": "En preparacion",
    "EN PREPARACION": "En preparacion",
    "ENVIADO": "Enviado",
    "ENTREGADO": "Entregado",
    "CANCELADO": "En preparacion",
  };

  return {
    id: String(raw.id),
    folio: raw.folio,
    date: typeof raw.date === "string" ? raw.date.split("T")[0] : String(raw.date),
    items,
    total: raw.total,
    status: statusMap[raw.status?.toUpperCase()] ?? "En preparacion",
    buyerName: raw.buyerName,
    buyerId: "0",
    address: typeof raw.address === "object"
      ? Object.values(raw.address).filter(Boolean).join(", ")
      : String(raw.address),
  };
}

export function mapCategoria(raw: RawCategoria): { id: string; name: string; tipo: string } {
  return {
    id: String(raw.id),
    name: raw.nombre,
    tipo: raw.tipo,
  };
}

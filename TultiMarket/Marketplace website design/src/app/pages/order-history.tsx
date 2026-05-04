import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, ChevronDown, ChevronUp, Calendar, Loader2, CreditCard, MapPin, AlertCircle } from "lucide-react";
import { useStore } from "../context/store-context";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { getPedidosCompradorApi } from "../api/api-client";
import type { Order } from "../data/mock-data";

/**
 * Mis Compras — Muestra SIEMPRE las compras personales del usuario logueado,
 * sin importar su rol (comprador, vendedor o admin).
 *
 * Las ventas del negocio se ven en /vendedor/pedidos (SellerOrdersPage).
 */
export function OrderHistoryPage() {
  const { currentUser } = useStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    setLoadError(null);

    getPedidosCompradorApi()
      .then((data) => setMyOrders(data))
      .catch((err) => {
        console.error("Error al cargar mis compras:", err);
        setLoadError("No se pudieron cargar tus compras. Intenta de nuevo.");
        setMyOrders([]);
      })
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "ENTREGADO": return "bg-green-100 text-green-700";
      case "ENVIADO": return "bg-blue-100 text-blue-700";
      case "EN PREPARACION": return "bg-amber-100 text-amber-700";
      case "CANCELADO": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="mb-6">
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Mis Compras</h1>
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>
            Consulta tus compras, estatus y detalle de cada orden.
          </p>
        </div>

        {/* Estado: Cargando */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-border py-16 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>

        /* Estado: Error de red */
        ) : loadError ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="mb-2" style={{ fontSize: 20, fontWeight: 600 }}>{loadError}</h2>
            <button
              onClick={() => {
                setIsLoading(true);
                setLoadError(null);
                getPedidosCompradorApi()
                  .then((data) => setMyOrders(data))
                  .catch(() => setLoadError("No se pudieron cargar tus compras."))
                  .finally(() => setIsLoading(false));
              }}
              className="text-primary hover:underline"
              style={{ fontSize: 14 }}
            >
              Reintentar
            </button>
          </div>

        /* Estado: Sin pedidos */
        ) : myOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="mb-2" style={{ fontSize: 20, fontWeight: 600 }}>No tienes compras aún</h2>
            <Link to="/" className="text-primary hover:underline" style={{ fontSize: 14 }}>
              Ir a comprar
            </Link>
          </div>

        /* Estado: Lista de pedidos */
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.product.image || "https://placehold.co/80x80?text=Item"}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{order.folio}</p>
                      <p className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 13 }}>
                        <Calendar size={12} /> {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`} style={{ fontSize: 13, fontWeight: 500 }}>
                      {order.status}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>${(Number(order.total) || 0).toFixed(2)}</span>
                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-border p-5 bg-gray-50/50">
                    {/* Items del pedido */}
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <img
                            src={item.product.image || "https://placehold.co/80x80?text=Item"}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <Link to={`/producto/${item.product.id}`} className="hover:text-primary transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                              {item.product.name}
                            </Link>
                            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Cantidad: {item.quantity}</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>${((Number(item.product.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Info de dirección y método de pago */}
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-muted-foreground" style={{ fontSize: 13 }}>{order.address}</p>
                        </div>
                      )}
                      {order.paymentMethod && (
                        <div className="flex items-start gap-2">
                          <CreditCard size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-muted-foreground" style={{ fontSize: 13 }}>{order.paymentMethod}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Store,
  ChevronRight,
  Clock,
  Calendar,
  MapPin,
  Package,
  Loader2,
  CheckCircle2,
  CalendarDays,
  Hash,
} from "lucide-react";
import { products as mockProducts, mockBundles, type Product } from "../data/mock-data";
import { getProductoDetalleApi, getServicioDetalleApi, createReviewApi } from "../api/api-client";
import { StarRating } from "../components/star-rating";
import { useStore } from "../context/store-context";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams();
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"descripcion" | "resenas" | "vendedor">("descripcion");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // States para Servicios
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const formatDate = (date?: string) => {
    if (!date) return "No disponible";
    return new Date(`${date}T00:00:00`).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ─── Cargar producto SOLO del backend (fiel a la BD) ──────────────────────
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0) {
      // ID no válido
      setProduct(null);
      setIsLoading(false);
      return;
    }

    // Buscar en el backend: primero como producto, luego como servicio
    setIsLoading(true);
    getProductoDetalleApi(numericId)
      .then((p) => setProduct(p))
      .catch(() => {
        return getServicioDetalleApi(numericId)
          .then((s) => setProduct(s))
          .catch(() => setProduct(null));
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const isService = product?.type === "servicio";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2>Producto no encontrado</h2>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">Volver al inicio</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const sellerBundles = mockBundles.filter((b) => b.sellerId === product.sellerId);
  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isService) {
      if (!selectedDate || !selectedTime) {
        toast.error("Por favor selecciona una fecha y hora para el servicio");
        return;
      }
      addToCart(product, 1, selectedDate, selectedTime);
      toast.success(`${product.name} agendado para el ${selectedDate} a las ${selectedTime}`);
    } else {
      if (product.stock === 0) {
        toast.error("Este producto esta agotado");
        return;
      }
      if (quantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }
      addToCart(product, quantity);
      toast.success(`${product.name} (x${quantity}) agregado al carrito`);
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast("Eliminado de lista de deseos");
    } else {
      addToWishlist(product);
      toast.success("Agregado a lista de deseos");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || isSubmittingReview) return;
    
    if (reviewRating === 0) {
      toast.error("Selecciona una calificacion");
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 10) {
      toast.error("El comentario debe tener al menos 10 caracteres");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      await createReviewApi(
        product.type as "producto" | "servicio",
        Number(product.id),
        reviewRating,
        reviewComment
      );
      toast.success("Resena enviada exitosamente");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
      
      // Recargar el producto para ver la reseña inmediatamente
      const numericId = Number(product.id);
      if (product.type === "servicio") {
        const prod = await getServicioDetalleApi(numericId);
        setProduct(prod);
      } else {
        const prod = await getProductoDetalleApi(numericId);
        setProduct(prod);
      }
    } catch (error: any) {
      toast.error(error.message || "Error al enviar la resena");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-muted-foreground" style={{ fontSize: 13 }}>
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <ChevronRight size={14} />
        <Link to={`/?categoria=${product.category}`} className="hover:text-primary capitalize">
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground truncate">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === selectedImage ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 lg:border-l border-border">
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/?buscar=${product.sellerName}`} className="text-primary hover:underline" style={{ fontSize: 14 }}>
                  <Store size={14} className="inline mr-1" />
                  {product.sellerName}
                </Link>
              </div>

              <h1 className="mb-3" style={{ fontSize: 24, fontWeight: 600 }}>{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} size={18} showCount count={product.reviewCount} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl border border-border bg-gray-50 p-3">
                  <p className="text-muted-foreground flex items-center gap-2" style={{ fontSize: 12 }}>
                    <Hash size={14} /> SKU
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{product.sku || "No disponible"}</p>
                </div>
                <div className="rounded-xl border border-border bg-gray-50 p-3">
                  <p className="text-muted-foreground flex items-center gap-2" style={{ fontSize: 12 }}>
                    <CalendarDays size={14} /> Publicado
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(product.publicationDate)}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-primary" style={{ fontSize: 32, fontWeight: 700 }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-muted-foreground line-through" style={{ fontSize: 18 }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded" style={{ fontSize: 13, fontWeight: 600 }}>
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock / Duration */}
              <div className="mb-6">
                {isService ? (
                  <span className="text-primary flex items-center gap-2" style={{ fontSize: 14, fontWeight: 500 }}>
                    <Clock size={16} /> Duracion estimada: {product.durationMin} minutos
                  </span>
                ) : (
                  <>
                    {product.stock > 10 ? (
                      <span className="text-green-600" style={{ fontSize: 14, fontWeight: 500 }}>
                        En stock
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="text-amber-600" style={{ fontSize: 14, fontWeight: 500 }}>
                        Quedan solo {product.stock} unidades
                      </span>
                    ) : (
                      <span className="text-red-600" style={{ fontSize: 14, fontWeight: 500 }}>
                        Agotado
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Quantity or Agenda */}
              {isService ? (
                <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-xl border border-border">
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Agendar Servicio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
                        <Calendar size={14} className="text-primary" /> Fecha
                      </label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500 }}>
                        <Clock size={14} className="text-primary" /> Horario
                      </label>
                      <select 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary"
                      >
                        <option value="">Selecciona hora</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <span style={{ fontSize: 14 }}>Cantidad:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-4 py-2 min-w-[48px] text-center" style={{ fontSize: 16, fontWeight: 600 }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!isService && product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: 16, fontWeight: 600 }}
                >
                  <ShoppingCart size={20} />
                  {isService ? "Agendar y Agregar" : "Agregar al Carrito"}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border-2 transition-colors ${
                    inWishlist
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-border text-muted-foreground hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  <Heart size={22} className={inWishlist ? "fill-current" : ""} />
                </button>
              </div>

              {/* Delivery info / Geolocation */}
              {isService ? (
                <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-3">
                  <MapPin size={20} className="text-primary shrink-0" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Geolocalizacion Activa</p>
                    <p className="text-muted-foreground" style={{ fontSize: 13 }}>Este servicio esta disponible en un radio de 15km</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <Package size={20} className="text-primary shrink-0" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>Envio estimado: 3-5 dias habiles</p>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>Contexto: Fiestas</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
                    <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{product.branchName || "Sucursal principal"}</p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>
                        {product.branchAddress || "Ubicacion no disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-border mt-6 overflow-hidden">
          <div className="flex border-b border-border">
            {(["descripcion", "resenas", "vendedor"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                {tab === "resenas" ? `Resenas (${product.reviews.length})` : tab === "vendedor" ? "Info del Vendedor" : "Descripcion"}
              </button>
            ))}
          </div>
          <div className="p-6 lg:p-8">
            {activeTab === "descripcion" && (
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 15 }}>
                {product.description}
              </p>
            )}
            {activeTab === "resenas" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>Resenas de Clientes</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ fontSize: 14 }}
                  >
                    Escribir Resena
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="mb-3" style={{ fontSize: 16, fontWeight: 500 }}>Tu Calificacion</h4>
                    <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={28} />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      rows={3}
                      className="w-full mt-4 px-4 py-3 rounded-lg border border-border bg-white outline-none focus:border-primary"
                      style={{ fontSize: 14 }}
                    />
                    <div className="flex gap-2 mt-3">
                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 disabled:opacity-50" 
                        style={{ fontSize: 14 }}
                      >
                        {isSubmittingReview && <Loader2 size={14} className="animate-spin" />}
                        {isSubmittingReview ? "Enviando..." : "Enviar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-border rounded-lg"
                        style={{ fontSize: 14 }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                {product.reviews.length === 0 ? (
                  <p className="text-muted-foreground" style={{ fontSize: 14 }}>Aun no hay resenas para este producto.</p>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary" style={{ fontSize: 14, fontWeight: 600 }}>
                            {review.userName[0]}
                          </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p style={{ fontSize: 14, fontWeight: 500 }}>{review.userName}</p>
                              {review.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700" style={{ fontSize: 11, fontWeight: 600 }}>
                                  <CheckCircle2 size={12} /> Compra verificada
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground" style={{ fontSize: 12 }}>{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                        <p className="text-muted-foreground mt-2" style={{ fontSize: 14 }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "vendedor" && (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Store size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{product.sellerName}</h3>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>
                    Perfil de Negocio
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bundles */}
        {sellerBundles.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4" style={{ fontSize: 20, fontWeight: 600 }}>
              Paquetes Promocionales del Vendedor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerBundles.map((bundle) => (
                <div key={bundle.id} className="bg-white rounded-xl border border-border p-6">
                  <h3 className="mb-3" style={{ fontSize: 16, fontWeight: 600 }}>{bundle.name}</h3>
                  <div className="space-y-2 mb-4">
                    {bundle.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: 14 }}>{p.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 13 }}>${p.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-primary" style={{ fontSize: 24, fontWeight: 700 }}>
                      ${bundle.bundlePrice.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground line-through" style={{ fontSize: 14 }}>
                      ${bundle.originalTotal.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded" style={{ fontSize: 12, fontWeight: 600 }}>
                      Ahorras ${(bundle.originalTotal - bundle.bundlePrice).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      bundle.products.forEach((p) => addToCart(p));
                      toast.success("Paquete agregado al carrito");
                    }}
                    className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ fontSize: 14 }}
                  >
                    Agregar Paquete al Carrito
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4" style={{ fontSize: 20, fontWeight: 600 }}>
              Productos Similares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.id}`}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="aspect-square bg-gray-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <p className="truncate" style={{ fontSize: 14 }}>{p.name}</p>
                    <p className="text-primary mt-1" style={{ fontSize: 16, fontWeight: 600 }}>${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

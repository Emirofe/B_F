import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Loader2 } from "lucide-react";
import {
  getProductosVendedorApi,
  createProductoVendedorApi,
  updateProductoVendedorApi,
  deleteProductoVendedorApi,
  getCategoriasApi,
} from "../../api/api-client";
import { useStore } from "../../context/store-context";
import { toast } from "sonner";
import { DynamicCategoryField } from "../../components/dynamic-category-field";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  sku: string;
}

// Tipo interno para los productos del vendedor (del backend)
interface SellerProduct {
  id: number;
  id_negocio: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock_total: number;
  sku: string | null;
  esta_activo: boolean;
  fecha_registro: string;
}

export function SellerProductsPage() {
  const { negocioId } = useStore();
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sku: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; tipo?: string }[]>([]);

  // ─── Cargar categorías del backend ────────────────────────────────────────
  useEffect(() => {
    getCategoriasApi("producto")
      .then((cats) => {
        setDbCategories(cats);
        if (cats.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: cats[0].id }));
        }
      })
      .catch(() => setDbCategories([]));
  }, []);

  // ─── Cargar productos del backend ─────────────────────────────────────────
  useEffect(() => {
    if (!negocioId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getProductosVendedorApi(negocioId)
      .then((data) => {
        setSellerProducts(data);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        toast.error("Error al cargar productos del negocio");
      })
      .finally(() => setIsLoading(false));
  }, [negocioId]);

  const filtered = sellerProducts.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Crear o Editar producto (conectado al backend) ───────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!negocioId) {
      toast.error("No tienes un negocio asociado. Contacta al administrador.");
      return;
    }

    const imagenesUrls = imageUrl.trim() ? [imageUrl.trim()] : [];
    const catId = Number(formData.category);
    const categoriasIds = !isNaN(catId) && catId > 0 ? [catId] : [];

    try {
      if (editingId) {
        await updateProductoVendedorApi(editingId, {
          nombre: formData.name,
          descripcion: formData.description || undefined,
          precio: parseFloat(formData.price),
          stock_total: formData.stock ? parseInt(formData.stock) : undefined,
          sku: formData.sku || undefined,
          imagenes: imagenesUrls.length > 0 ? imagenesUrls : undefined,
        });
        // Actualizar categorías por separado si se proporcionó
        if (categoriasIds.length > 0) {
          await fetch(`http://localhost:3000/api/vendedor/productos/${editingId}/categorias`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_categorias: categoriasIds }),
          });
        }
        toast.success("Producto actualizado");
      } else {
        await createProductoVendedorApi({
          nombre: formData.name,
          descripcion: formData.description || undefined,
          precio: parseFloat(formData.price),
          id_negocio: negocioId,
          stock_total: formData.stock ? parseInt(formData.stock) : 0,
          sku: formData.sku || undefined,
          imagenes: imagenesUrls,
          id_categorias: categoriasIds,
        });
        toast.success("Producto creado");
      }
      closeForm();

      // Recargar lista
      const data = await getProductosVendedorApi(negocioId);
      setSellerProducts(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al guardar producto";
      toast.error(msg);
    }
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingId(product.id);
    setFormData({
      name: product.nombre,
      description: product.descripcion ?? "",
      price: String(product.precio),
      stock: String(product.stock_total),
      category: "cumpleanos",
      sku: product.sku ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", stock: "", category: dbCategories[0]?.id || "", sku: "" });
    setImageUrl("");
  };

  // ─── Activar/Desactivar producto (conectado al backend) ───────────────────
  const toggleActive = async (product: SellerProduct) => {
    if (!negocioId) return;
    try {
      // ✅ INVOCANDO: updateProductoVendedorApi (para cambiar esta_activo)
      await updateProductoVendedorApi(product.id, {
        nombre: product.nombre,
        descripcion: product.descripcion ?? undefined,
        precio: product.precio,
        esta_activo: !product.esta_activo,
      });
      toast.success(`Producto ${product.esta_activo ? "desactivado" : "activado"}`);

      // Recargar lista
      const data = await getProductosVendedorApi(negocioId);
      setSellerProducts(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al cambiar estado";
      toast.error(msg);
    }
  };

  // ─── Eliminar producto (conectado al backend) ─────────────────────────────
  const handleDelete = async (product: SellerProduct) => {
    if (!negocioId) return;
    try {
      // ✅ INVOCANDO: deleteProductoVendedorApi
      await deleteProductoVendedorApi(product.id);
      toast.success("Producto eliminado");

      // Recargar lista
      const data = await getProductosVendedorApi(negocioId);
      setSellerProducts(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  // ─── Sin negocio vinculado ────────────────────────────────────────────────
  if (!negocioId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground" style={{ fontSize: 18 }}>
          No tienes un negocio vinculado a tu cuenta.
        </p>
        <p className="text-muted-foreground mt-2" style={{ fontSize: 14 }}>
          Contacta al administrador para crear tu negocio.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Mis Productos</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", description: "", price: "", stock: "", category: dbCategories[0]?.id || "", sku: "" });
            setImageUrl("");
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          style={{ fontSize: 14 }}
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar mis productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:border-primary outline-none"
          style={{ fontSize: 14 }}
        />
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="mb-4" style={{ fontSize: 18, fontWeight: 600 }}>
            {editingId ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Nombre del producto</label>
              <input value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Descripcion</label>
              <textarea value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} rows={3} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Precio (MXN)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} required />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData(p => ({...p, stock: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} required />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Categoría</label>
              <DynamicCategoryField
                allowedType="producto"
                categories={dbCategories}
                value={formData.category}
                onChange={(category) => setFormData((prev) => ({ ...prev, category }))}
                onCreated={(category) => {
                  setDbCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>SKU (opcional)</label>
              <input value={formData.sku} onChange={(e) => setFormData(p => ({...p, sku: e.target.value}))} placeholder="Ej: CAM-ROJ-M" className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>URL de Imagen (opcional)</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} />
            </div>
            {imageUrl && (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground mb-1" style={{ fontSize: 12 }}>Vista previa:</p>
                <img src={imageUrl} alt="preview" className="h-24 rounded-lg object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg" style={{ fontSize: 14 }}>
                {editingId ? "Actualizar" : "Crear Producto"}
              </button>
              <button type="button" onClick={closeForm} className="px-6 py-2.5 border border-border rounded-lg" style={{ fontSize: 14 }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        /* Product table */
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Producto</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Precio</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Stock</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>SKU</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Estado</th>
                  <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground" style={{ fontSize: 14 }}>
                      {searchQuery ? "No se encontraron productos" : "No tienes productos registrados"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-4">
                        <span className="truncate max-w-[250px] block" style={{ fontSize: 14 }}>
                          {product.nombre}
                        </span>
                      </td>
                      <td className="px-4 py-4" style={{ fontSize: 14 }}>
                        ${Number(product.precio).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded ${
                          product.stock_total === 0 ? "bg-red-100 text-red-700" :
                          product.stock_total < 10 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`} style={{ fontSize: 13 }}>
                          {product.stock_total}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground" style={{ fontSize: 14 }}>
                        {product.sku ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded ${product.esta_activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 13 }}>
                          {product.esta_activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(product)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => toggleActive(product)} className="p-2 text-muted-foreground hover:text-amber-600 rounded-lg hover:bg-amber-50">
                            {product.esta_activo ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => handleDelete(product)} className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

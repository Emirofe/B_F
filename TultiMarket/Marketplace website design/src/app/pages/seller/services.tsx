import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Loader2 } from "lucide-react";
import {
  getServiciosVendedorApi,
  createServicioVendedorApi,
  updateServicioVendedorApi,
  deleteServicioVendedorApi,
  getCategoriasApi,
  updateServicioCategoriasVendedorApi,
} from "../../api/api-client";
import { useStore } from "../../context/store-context";
import { toast } from "sonner";
import { DynamicCategoryField } from "../../components/dynamic-category-field";

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
}

interface SellerService {
  id: number;
  id_negocio: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  duracion_minutos: number | null;
  calificacion: number | null;
  esta_activo: boolean;
  fecha_registro: string;
  id_categoria?: number | null;
  imagen_principal?: string | null;
}

export function SellerServicesPage() {
  const { negocioId } = useStore();
  const [sellerServices, setSellerServices] = useState<SellerService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; tipo?: string }[]>([]);

  // ─── Cargar categorías del backend ────────────────────────────────────────
  useEffect(() => {
    getCategoriasApi("servicio")
      .then((cats) => {
        setDbCategories(cats);
        if (cats.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: cats[0].id }));
        }
      })
      .catch(() => setDbCategories([]));
  }, []);

  // ─── Cargar servicios del backend ─────────────────────────────────────────
  useEffect(() => {
    if (!negocioId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getServiciosVendedorApi(negocioId)
      .then((data) => setSellerServices(data))
      .catch((err) => {
        console.error("Error al cargar servicios:", err);
        toast.error("Error al cargar servicios del negocio");
      })
      .finally(() => setIsLoading(false));
  }, [negocioId]);

  const filtered = sellerServices.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Crear o Editar servicio ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!negocioId) {
      toast.error("No tienes un negocio asociado.");
      return;
    }

    const imagenesUrls = imageUrl.trim() ? [imageUrl.trim()] : [];
    const catId = Number(formData.category);
    const categoriasIds = !isNaN(catId) && catId > 0 ? [catId] : [];

    try {
      if (editingId) {
        await updateServicioVendedorApi(editingId, {
          nombre: formData.name,
          descripcion: formData.description || undefined,
          precio_base: parseFloat(formData.price),
          duracion_minutos: formData.duration ? parseInt(formData.duration) : undefined,
          imagenes: imagenesUrls.length > 0 ? imagenesUrls : undefined,
        });
        // Actualizar categorías
        if (categoriasIds.length > 0) {
          await updateServicioCategoriasVendedorApi(editingId, categoriasIds);
        }
        toast.success("Servicio actualizado");
      } else {
        await createServicioVendedorApi({
          nombre: formData.name,
          descripcion: formData.description || undefined,
          precio_base: parseFloat(formData.price),
          duracion_minutos: formData.duration ? parseInt(formData.duration) : undefined,
          id_negocio: negocioId,
          imagenes: imagenesUrls,
          id_categorias: categoriasIds,
        });
        toast.success("Servicio creado");
      }
      closeForm();

      const data = await getServiciosVendedorApi(negocioId);
      setSellerServices(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al guardar servicio";
      toast.error(msg);
    }
  };

  const handleEdit = (service: SellerService) => {
    setEditingId(service.id);
    setFormData({
      name: service.nombre,
      description: service.descripcion ?? "",
      price: String(service.precio_base),
      duration: service.duracion_minutos ? String(service.duracion_minutos) : "",
      category: service.id_categoria ? String(service.id_categoria) : dbCategories[0]?.id || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", duration: "", category: dbCategories[0]?.id || "" });
    setImageUrl("");
  };

  // ─── Activar/Desactivar servicio ──────────────────────────────────────────
  const toggleActive = async (service: SellerService) => {
    if (!negocioId) return;
    try {
      await updateServicioVendedorApi(service.id, {
        nombre: service.nombre,
        descripcion: service.descripcion ?? undefined,
        precio_base: service.precio_base,
        duracion_minutos: service.duracion_minutos ?? undefined,
        esta_activo: !service.esta_activo,
      });
      toast.success(`Servicio ${service.esta_activo ? "desactivado" : "activado"}`);
      const data = await getServiciosVendedorApi(negocioId);
      setSellerServices(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al cambiar estado";
      toast.error(msg);
    }
  };

  // ─── Eliminar servicio ────────────────────────────────────────────────────
  const handleDelete = async (service: SellerService) => {
    if (!negocioId) return;
    try {
      await deleteServicioVendedorApi(service.id);
      toast.success("Servicio eliminado");
      const data = await getServiciosVendedorApi(negocioId);
      setSellerServices(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  // ─── Sin negocio ─────────────────────────────────────────────────────────
  if (!negocioId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground" style={{ fontSize: 18 }}>
          No tienes un negocio vinculado a tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Mis Servicios</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", description: "", price: "", duration: "", category: dbCategories[0]?.id || "" });
            setImageUrl("");
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          style={{ fontSize: 14 }}
        >
          <Plus size={18} /> Nuevo Servicio
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar mis servicios..."
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
            {editingId ? "Editar Servicio" : "Nuevo Servicio"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Nombre del servicio</label>
              <input value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Descripcion</label>
              <textarea value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} rows={3} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Precio Base (MXN)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} required />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Duración (minutos)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData(p => ({...p, duration: e.target.value}))} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" style={{ fontSize: 14 }} placeholder="Ej: 60" />
            </div>
            <div>
              <label className="block mb-1 text-muted-foreground" style={{ fontSize: 13 }}>Categoría</label>
              <DynamicCategoryField
                allowedType="servicio"
                categories={dbCategories}
                value={formData.category}
                onChange={(category) => setFormData((prev) => ({ ...prev, category }))}
                onCreated={(category) => {
                  setDbCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
                }}
              />
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
                {editingId ? "Actualizar" : "Crear Servicio"}
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
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Servicio</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Precio Base</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Duración</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Estado</th>
                  <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground" style={{ fontSize: 14 }}>
                      {searchQuery ? "No se encontraron servicios" : "No tienes servicios registrados"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((service) => (
                    <tr key={service.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-4">
                        <span className="truncate max-w-[250px] block" style={{ fontSize: 14 }}>
                          {service.nombre}
                        </span>
                      </td>
                      <td className="px-4 py-4" style={{ fontSize: 14 }}>
                        ${Number(service.precio_base).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground" style={{ fontSize: 14 }}>
                        {service.duracion_minutos ? `${service.duracion_minutos} min` : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded ${service.esta_activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 13 }}>
                          {service.esta_activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(service)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => toggleActive(service)} className="p-2 text-muted-foreground hover:text-amber-600 rounded-lg hover:bg-amber-50">
                            {service.esta_activo ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => handleDelete(service)} className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50">
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

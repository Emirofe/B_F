import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Loader2, Tag } from "lucide-react";
import { getCategoriasAdminApi, createCategoriaAdminApi, updateCategoriaAdminApi, deleteCategoriaAdminApi } from "../../api/api-client";

interface Categoria {
  id: number;
  nombre_categoria: string;
  tipo: "producto" | "servicio";
}

export function AdminCategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre_categoria: "",
    tipo: "producto" as "producto" | "servicio",
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await getCategoriasAdminApi();
      setCategorias(response.categorias);
      setError(null);
    } catch (err) {
      setError("Error al cargar categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.nombre_categoria.trim()) {
      errors.nombre_categoria = "El nombre de la categoría es requerido";
    } else if (formData.nombre_categoria.trim().length < 2) {
      errors.nombre_categoria = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre_categoria.trim().length > 120) {
      errors.nombre_categoria = "El nombre no puede exceder 120 caracteres";
    }

    // Verificar unicidad
    const existing = categorias.find(
      (cat) =>
        cat.nombre_categoria.toLowerCase() === formData.nombre_categoria.trim().toLowerCase() &&
        cat.tipo === formData.tipo &&
        cat.id !== editingCategoria?.id
    );
    if (existing) {
      errors.nombre_categoria = "Ya existe una categoría con este nombre y tipo";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      const data = {
        nombre_categoria: formData.nombre_categoria.trim(),
        tipo: formData.tipo,
      };

      if (editingCategoria) {
        await updateCategoriaAdminApi(editingCategoria.id, data);
      } else {
        await createCategoriaAdminApi(data);
      }

      await loadCategorias();
      resetForm();
    } catch (err: any) {
      if (err.message?.includes("ya existe")) {
        setValidationErrors({ nombre_categoria: "Ya existe una categoría con este nombre y tipo" });
      } else {
        setError("Error al guardar la categoría");
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre_categoria: categoria.nombre_categoria,
      tipo: categoria.tipo,
    });
    setShowForm(true);
    setValidationErrors({});
  };

  const handleDelete = async (categoria: Categoria) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre_categoria}"?`)) {
      return;
    }

    try {
      await deleteCategoriaAdminApi(categoria.id);
      await loadCategorias();
    } catch (err) {
      setError("Error al eliminar la categoría");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ nombre_categoria: "", tipo: "producto" });
    setEditingCategoria(null);
    setShowForm(false);
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Gestión de Categorías</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
            Administra las categorías de productos y servicios disponibles en la plataforma
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          style={{ fontSize: 14, fontWeight: 500 }}
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800" style={{ fontSize: 14 }}>{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <h2 style={{ fontSize: 18, fontWeight: 600 }} className="mb-4">
            {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Categoría</label>
              <input
                type="text"
                value={formData.nombre_categoria}
                onChange={(e) => {
                  setFormData({ ...formData, nombre_categoria: e.target.value });
                  if (validationErrors.nombre_categoria) {
                    setValidationErrors({ ...validationErrors, nombre_categoria: "" });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg outline-none focus:border-primary transition-colors ${
                  validationErrors.nombre_categoria ? "border-red-300" : "border-border"
                }`}
                placeholder="Ej: Electrónicos, Ropa, Servicios de Limpieza"
              />
              {validationErrors.nombre_categoria && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.nombre_categoria}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "producto" | "servicio" })}
                className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary transition-colors"
              >
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCategoria ? "Actualizar" : "Crear"} Categoría
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Categorías ({categorias.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                  NOMBRE
                </th>
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                  TIPO
                </th>
                <th className="px-6 py-4 text-right" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{categoria.nombre_categoria}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        categoria.tipo === "producto"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {categoria.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(categoria)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categorias.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500" style={{ fontSize: 14 }}>
                No hay categorías registradas
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
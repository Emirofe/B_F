import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { createCategoriaVendedorApi } from "../../api/api-client";

interface Categoria {
  id: number;
  nombre_categoria: string;
  descripcion: string | null;
  icon_url: string | null;
  tipo: "producto" | "servicio" | "ambos";
}

export function SellerCategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_categoria: "",
    descripcion: "",
    icon_url: "",
    tipo: "producto" as "producto" | "servicio" | "ambos",
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.nombre_categoria.trim()) {
      errors.nombre_categoria = "El nombre de la categoría es requerido";
    } else if (formData.nombre_categoria.trim().length < 2) {
      errors.nombre_categoria = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre_categoria.trim().length > 120) {
      errors.nombre_categoria = "El nombre no puede exceder 120 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      errors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    if (formData.icon_url && !formData.icon_url.match(/^https?:\/\/.+/)) {
      errors.icon_url = "La URL del ícono debe ser una URL válida";
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
        descripcion: formData.descripcion.trim() || undefined,
        icon_url: formData.icon_url.trim() || undefined,
        tipo: formData.tipo,
      };

      await createCategoriaVendedorApi(data);

      setError(null);
      resetForm();
      // Nota: No recargamos la lista porque no hay API para listar categorías de vendedor
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

  const resetForm = () => {
    setFormData({
      nombre_categoria: "",
      descripcion: "",
      icon_url: "",
      tipo: "producto",
    });
    setValidationErrors({});
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Crear Nueva Categoría</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={formData.nombre_categoria}
                onChange={(e) => setFormData({ ...formData, nombre_categoria: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  validationErrors.nombre_categoria ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ej: Electrónica, Ropa, Servicios"
              />
              {validationErrors.nombre_categoria && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.nombre_categoria}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "producto" | "servicio" | "ambos" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  validationErrors.descripcion ? "border-red-300" : "border-gray-300"
                }`}
                rows={3}
                placeholder="Descripción opcional de la categoría"
              />
              {validationErrors.descripcion && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.descripcion}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Ícono</label>
              <input
                type="url"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  validationErrors.icon_url ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="https://ejemplo.com/icono.png"
              />
              {validationErrors.icon_url && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.icon_url}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Guardando..." : "Guardar Categoría"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías creadas (placeholder) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Categorías Creadas</h2>
        <p className="text-gray-500">Las categorías se guardan en la base de datos y estarán disponibles para su uso.</p>
        {/* Aquí podrías agregar una lista si implementas la API para listar categorías del vendedor */}
      </div>
    </div>
  );
}
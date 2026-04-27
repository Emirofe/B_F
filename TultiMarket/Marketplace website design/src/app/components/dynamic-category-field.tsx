import { useMemo, useState } from "react";
import { Plus, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createCategoriaVendedorApi } from "../api/api-client";

interface CategoryOption {
  id: string;
  name: string;
  tipo?: string;
}

interface DynamicCategoryFieldProps {
  allowedType: "producto" | "servicio";
  categories: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  onCreated: (category: CategoryOption) => void;
}

export function DynamicCategoryField({
  allowedType,
  categories,
  value,
  onChange,
  onCreated,
}: DynamicCategoryFieldProps) {
  const [showCreator, setShowCreator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const normalizedName = name.trim().toLowerCase();
  const duplicated = useMemo(
    () => categories.some((category) => category.name.trim().toLowerCase() === normalizedName),
    [categories, normalizedName]
  );

  const hasMinLength = name.trim().length >= 3;
  const isNameValid = hasMinLength && !duplicated;

  const resetCreator = () => {
    setShowCreator(false);
    setName("");
    setDescription("");
    setIsSubmitting(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNameValid) {
      toast.error(duplicated ? "La categoria ya existe" : "Usa al menos 3 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCategoriaVendedorApi({
        nombre_categoria: name.trim(),
        descripcion: description.trim() || undefined,
        tipo: allowedType,
      });

      const created = {
        id: String(result.categoria.id),
        name: result.categoria.nombre_categoria,
        tipo: result.categoria.tipo,
      };

      onCreated(created);
      onChange(created.id);
      toast.success("Categoria creada correctamente");
      resetCreator();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la categoria";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"
          style={{ fontSize: 14 }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowCreator((current) => !current)}
          className="shrink-0 px-3 py-3 rounded-lg border border-border bg-white hover:bg-gray-50"
          title="Crear categoria"
        >
          <Plus size={16} />
        </button>
      </div>

      {showCreator && (
        <form onSubmit={handleCreate} className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
          <div>
            <label className="block mb-1 text-muted-foreground" style={{ fontSize: 12 }}>
              Nueva categoria para {allowedType}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Candy bar premium"
              className="w-full px-3 py-2 rounded-lg border border-border bg-white"
              style={{ fontSize: 14 }}
            />
            <div className="mt-2 flex items-center gap-2" style={{ fontSize: 12 }}>
              {isNameValid ? (
                <>
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-700">Nombre disponible</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} className={duplicated ? "text-red-600" : "text-amber-600"} />
                  <span className={duplicated ? "text-red-700" : "text-amber-700"}>
                    {duplicated ? "Ya existe una categoria con ese nombre" : "Escribe al menos 3 caracteres"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-muted-foreground" style={{ fontSize: 12 }}>
              Descripcion breve
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              className="w-full px-3 py-2 rounded-lg border border-border bg-white"
              style={{ fontSize: 14 }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isNameValid || isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-60"
              style={{ fontSize: 14 }}
            >
              {isSubmitting ? "Creando..." : "Guardar categoria"}
            </button>
            <button
              type="button"
              onClick={resetCreator}
              className="px-4 py-2 rounded-lg border border-border"
              style={{ fontSize: 14 }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

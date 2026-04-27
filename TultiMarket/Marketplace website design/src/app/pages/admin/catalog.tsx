import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react";
import {
  getAdminCatalogoProductosApi,
  getAdminCatalogoServiciosApi,
  updateAdminEstadoProductoApi,
  updateAdminEstadoServicioApi,
  AdminCatalogItem
} from "../../api/api-client";
import { toast } from "sonner";

// Combinamos productos y servicios en un solo tipo para la tabla
interface CombinedCatalogItem extends AdminCatalogItem {
  type: "producto" | "servicio";
}

export function AdminCatalogPage() {
  const [items, setItems] = useState<CombinedCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productos, servicios] = await Promise.all([
        getAdminCatalogoProductosApi(),
        getAdminCatalogoServiciosApi()
      ]);

      const combined: CombinedCatalogItem[] = [
        ...productos.map(p => ({ ...p, type: "producto" as const })),
        ...servicios.map(s => ({ ...s, type: "servicio" as const }))
      ];

      // Ordenar por fecha_registro DESC
      combined.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime());
      
      setItems(combined);
    } catch (error) {
      console.error("Error al cargar catalogo:", error);
      toast.error("Error al cargar el catalogo para moderacion");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: number, type: "producto" | "servicio", newStatus: "APROBADO" | "RECHAZADO") => {
    try {
      if (type === "producto") {
        await updateAdminEstadoProductoApi(id, newStatus);
      } else {
        await updateAdminEstadoServicioApi(id, newStatus);
      }
      toast.success(`Item ${newStatus.toLowerCase()}`);
      loadData(); // Recargar la lista
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al actualizar estado";
      toast.error(msg);
    }
  };

  const filteredItems = items.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.negocio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || p.estado_catalogo === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Moderacion de Catalogo</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
            Revisa y aprueba productos o servicios subidos por los vendedores (RF-44, RF-46)
          </p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg outline-none focus:border-primary transition-colors"
              style={{ fontSize: 14 }}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 md:flex-none bg-white border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
              style={{ fontSize: 14 }}
            >
              <option value="todos">Todos los estados</option>
              <option value="Aprobado">Aprobados</option>
              <option value="Rechazado">Rechazados</option>
            </select>
          </div>
        </div>

        {/* Loading o Tabla */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>PRODUCTO / SERVICIO</th>
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>VENDEDOR</th>
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>PRECIO</th>
                <th className="px-6 py-4" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>ESTADO</th>
                <th className="px-6 py-4 text-right" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((p) => (
                <tr key={`${p.type}-${p.id}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-border flex items-center justify-center text-muted-foreground text-xs uppercase">
                        {p.type.substring(0, 4)}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500 }} className="truncate max-w-[250px]">{p.nombre}</p>
                        <span className="text-xs text-muted-foreground capitalize">{p.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: 14 }}>{p.negocio || "Sin empresa"}</td>
                  <td className="px-6 py-4" style={{ fontSize: 14, fontWeight: 500 }}>
                    ${Number(p.precio || p.precio_base || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.estado_catalogo === "Aprobado" ? "bg-green-100 text-green-700" :
                      p.estado_catalogo === "Rechazado" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {p.estado_catalogo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleStatusChange(p.id, p.type, "APROBADO")}
                        title="Aprobar"
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                         onClick={() => handleStatusChange(p.id, p.type, "RECHAZADO")}
                         title="Rechazar"
                         className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>No se encontraron elementos para moderar.</p>
            </div>
          )}
        </div>
        )}
      </div>
    </>
  );
}

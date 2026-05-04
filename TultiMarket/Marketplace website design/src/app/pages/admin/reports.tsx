import { useState } from "react";
import { Flag, AlertTriangle, CheckCircle, Clock, Filter, ChevronDown, ChevronUp, ShieldOff, Trash2, X } from "lucide-react";
import { mockReports, Report } from "../../data/mock-data";
import { toast } from "sonner";

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const reportStatuses = [
    "all",
    "Pendiente",
    "Revisado",
    "Advertencia formal",
    "Suspensión temporal",
    "Bloqueo permanente",
    "Desestimado",
    "Contenido eliminado",
    "Resuelto",
  ];

  const filtered = statusFilter === "all"
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resuelto":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Revisado":
        return <AlertTriangle size={16} className="text-amber-600" />;
      case "Advertencia formal":
        return <AlertTriangle size={16} className="text-orange-600" />;
      case "Suspensión temporal":
        return <ShieldOff size={16} className="text-yellow-600" />;
      case "Bloqueo permanente":
        return <X size={16} className="text-red-600" />;
      case "Desestimado":
        return <X size={16} className="text-slate-600" />;
      case "Contenido eliminado":
        return <Trash2 size={16} className="text-slate-600" />;
      default:
        return <Clock size={16} className="text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto":
        return "bg-green-100 text-green-700";
      case "Revisado":
        return "bg-amber-100 text-amber-700";
      case "Advertencia formal":
        return "bg-orange-100 text-orange-700";
      case "Suspensión temporal":
        return "bg-yellow-100 text-yellow-700";
      case "Bloqueo permanente":
        return "bg-red-100 text-red-700";
      case "Desestimado":
        return "bg-slate-100 text-slate-700";
      case "Contenido eliminado":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getNotificationMessage = (status: Report["status"], report: Report) => {
    switch (status) {
      case "Resuelto":
        return `Reporte ${report.id.toUpperCase()} resuelto. Se notificó a ${report.reporterName}.`;
      case "Revisado":
        return `Reporte ${report.id.toUpperCase()} marcado como revisado. Se notificó al reportante.`;
      case "Advertencia formal":
        return `Advertencia formal enviada a ${report.reportedName}. Reportante ${report.reporterName} notificado.`;
      case "Suspensión temporal":
        return `Suspensión temporal aplicada a ${report.reportedName}. Ambas partes han sido notificadas.`;
      case "Bloqueo permanente":
        return `Bloqueo permanente aplicado a ${report.reportedName}. Reportante ${report.reporterName} notificado.`;
      case "Desestimado":
        return `Reporte desestimado. Se notificó a ${report.reporterName}.`;
      case "Contenido eliminado":
        return `Contenido eliminado. Se notificó a ${report.reporterName} y ${report.reportedName}.`;
      default:
        return `Estado actualizado a ${status}.`;
    }
  };

  const updateReportStatus = (id: string, status: Report["status"]) => {
    const report = reports.find((r) => r.id === id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (report) {
      toast.success(getNotificationMessage(status, report));
    } else {
      toast.success(`Reporte actualizado a: ${status}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Reportes y Denuncias</h1>
          <p className="text-muted-foreground" style={{ fontSize: 14 }}>
            {reports.filter((r) => r.status === "Pendiente").length} pendientes de revision
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Filter size={18} className="text-muted-foreground" />
        {reportStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-gray-50"
            }`}
            style={{ fontSize: 14 }}
          >
            {status === "all" ? "Todos" : status}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="space-y-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-border overflow-hidden">
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
              onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <span style={{ fontSize: 15, fontWeight: 600 }}>#{report.id.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 13 }}>Reporta: {report.reporterName}</p>
                  <p style={{ fontSize: 14 }}>Contra: {report.reportedName}</p>
                </div>
                <span className={`px-2 py-1 rounded ${
                  report.category === "Producto" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                }`} style={{ fontSize: 12 }}>
                  {report.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>{report.date}</span>
                <span className={`px-3 py-1 rounded-full ${getStatusColor(report.status)}`} style={{ fontSize: 13, fontWeight: 500 }}>
                  {report.status}
                </span>
                {expandedReport === report.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {expandedReport === report.id && (
              <div className="border-t border-border p-5 bg-gray-50/50">
                <div className="mb-4">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: 13 }}>Razon del reporte</p>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{report.reason}</p>
                </div>
                <div className="mb-6">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: 13 }}>Descripcion detallada</p>
                  <p className="text-muted-foreground" style={{ fontSize: 14 }}>{report.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateReportStatus(report.id, "Resuelto")}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    style={{ fontSize: 14 }}
                  >
                    <CheckCircle size={16} /> Resolver
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, "Advertencia formal")}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    style={{ fontSize: 14 }}
                  >
                    <AlertTriangle size={16} /> Advertencia formal
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, "Suspensión temporal")}
                    className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    style={{ fontSize: 14 }}
                  >
                    <ShieldOff size={16} /> Suspensión temporal
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, "Bloqueo permanente")}
                    className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    style={{ fontSize: 14 }}
                  >
                    <X size={16} /> Bloqueo permanente
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, "Contenido eliminado")}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
                    style={{ fontSize: 14 }}
                  >
                    <Trash2 size={16} /> Eliminar contenido
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, "Desestimado")}
                    className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg hover:bg-gray-50"
                    style={{ fontSize: 14 }}
                  >
                    <X size={16} /> Desestimar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <Flag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground" style={{ fontSize: 16 }}>No hay reportes con este filtro</p>
        </div>
      )}
    </div>
  );
}
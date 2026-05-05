import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";
import { getEstadisticasVendedorApi } from "../../api/api-client";

interface SalesData {
  mes: string;
  ordenes: number;
  ingresos: number;
}

interface SalesStats {
  totalOrders: number;
  totalRevenue: number;
  salesData: SalesData[];
  porEstado: { estado_pedido: string; cantidad: string; total_ventas: string }[];
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function SellerSalesPage() {
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEstadisticasVendedorApi()
      .then((data) => {
        const stats = data.estadisticas;
        const salesData: SalesData[] = (stats.ventas_mensuales || []).map((row: any) => ({
          mes: monthNames[new Date(row.mes).getMonth()],
          ordenes: parseInt(row.cantidad_pedidos),
          ingresos: parseFloat(row.total_ventas || 0),
        })).reverse();

        setSalesStats({
          totalOrders: stats.total_pedidos || 0,
          totalRevenue: stats.total_ventas || 0,
          salesData,
          porEstado: stats.por_estado || [],
        });
      })
      .catch(() => {
        setSalesStats({
          totalOrders: 0,
          totalRevenue: 0,
          salesData: [],
          porEstado: [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!salesStats) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-border">
        <p className="text-muted-foreground">No se pudieron cargar los datos de ventas</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6" style={{ fontSize: 24, fontWeight: 600 }}>Resumen de Ventas</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-primary" />
            </div>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Total Ordenes</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700 }}>{salesStats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Ingresos Totales</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700 }}>${salesStats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Promedio por Orden</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700 }}>
            ${salesStats.totalOrders > 0 ? (salesStats.totalRevenue / salesStats.totalOrders).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Estado de Pedidos */}
      {salesStats.porEstado.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {salesStats.porEstado.map((e) => (
            <div key={e.estado_pedido} className="bg-white rounded-xl border border-border p-4 text-center">
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>{e.estado_pedido}</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{e.cantidad}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {salesStats.salesData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="mb-4" style={{ fontSize: 16, fontWeight: 600 }}>Ordenes por Mes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesStats.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="ordenes" fill="#065F46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="mb-4" style={{ fontSize: 16, fontWeight: 600 }}>Ingresos por Mes (MXN)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesStats.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Line type="monotone" dataKey="ingresos" stroke="#065F46" strokeWidth={2} dot={{ fill: "#065F46" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border mb-8">
          <p className="text-muted-foreground" style={{ fontSize: 16 }}>
            Aún no tienes ventas registradas. Las gráficas aparecerán aquí cuando se concreten pedidos.
          </p>
        </div>
      )}
    </div>
  );
}
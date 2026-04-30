import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, CheckCircle2, Clock, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { getServiciosVendedorApi } from "../../api/api-client";
import { useStore } from "../../context/store-context";
import { toast } from "sonner";

type SellerService = Awaited<ReturnType<typeof getServiciosVendedorApi>>[number];

interface Appointment {
  id: string;
  serviceId: number;
  client: string;
  date: string;
  time: string;
  status: "Pendiente" | "Confirmado" | "Cancelado";
}

interface Availability {
  days: Record<string, boolean>;
  start: string;
  end: string;
}

const defaultAvailability: Availability = {
  days: {
    Lunes: true,
    Martes: true,
    Miercoles: true,
    Jueves: true,
    Viernes: true,
    Sabado: false,
    Domingo: false,
  },
  start: "09:00",
  end: "18:00",
};

export function SellerAgendaPage() {
  const { negocioId } = useStore();
  const storageKey = `seller-agenda-${negocioId ?? "none"}`;
  const [services, setServices] = useState<SellerService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<Availability>(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceId: "",
    client: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (!negocioId) {
      setLoading(false);
      return;
    }

    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAppointments(parsed.appointments ?? []);
      setAvailability(parsed.availability ?? defaultAvailability);
    }

    getServiciosVendedorApi(negocioId)
      .then((data) => setServices(data.filter((service) => service.esta_activo)))
      .catch(() => toast.error("Error al cargar servicios para agenda"))
      .finally(() => setLoading(false));
  }, [negocioId, storageKey]);

  const saveAgenda = (nextAppointments = appointments, nextAvailability = availability) => {
    setAppointments(nextAppointments);
    setAvailability(nextAvailability);
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ appointments: nextAppointments, availability: nextAvailability })
    );
  };

  const serviceById = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]));
  }, [services]);

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    saveAgenda(appointments.map((appointment) => appointment.id === id ? { ...appointment, status } : appointment));
    toast.success(`Cita ${status.toLowerCase()}`);
  };

  const deleteAppointment = (id: string) => {
    saveAgenda(appointments.filter((appointment) => appointment.id !== id));
    toast.success("Cita eliminada");
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.client || !formData.date || !formData.time) {
      toast.error("Completa los datos de la cita");
      return;
    }

    const next: Appointment = {
      id: `appointment-${Date.now()}`,
      serviceId: Number(formData.serviceId),
      client: formData.client.trim(),
      date: formData.date,
      time: formData.time,
      status: "Pendiente",
    };

    saveAgenda([...appointments, next].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)));
    setFormData({ serviceId: "", client: "", date: "", time: "" });
    toast.success("Cita agregada");
  };

  const saveAvailability = () => {
    saveAgenda(appointments, availability);
    toast.success("Disponibilidad guardada");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Mi Agenda</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
            Gestiona disponibilidad y citas de tus servicios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 border border-border bg-white rounded-xl p-6 h-fit">
          <h2 className="mb-4 flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
            <CalendarIcon size={20} className="text-primary" /> Dias Disponibles
          </h2>
          <div className="space-y-3">
            {Object.entries(availability.days).map(([day, isAvailable]) => (
              <div key={day} className="flex items-center justify-between">
                <span style={{ fontSize: 14 }}>{day}</span>
                <button
                  type="button"
                  onClick={() => setAvailability((prev) => ({ ...prev, days: { ...prev.days, [day]: !isAvailable } }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAvailable ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="mb-3" style={{ fontSize: 14, fontWeight: 500 }}>Horario Base</h3>
            <div className="flex gap-2">
              <input type="time" value={availability.start} onChange={(e) => setAvailability((prev) => ({ ...prev, start: e.target.value }))} className="flex-1 px-3 py-2 border border-border rounded-lg" style={{ fontSize: 13 }} />
              <span className="self-center">a</span>
              <input type="time" value={availability.end} onChange={(e) => setAvailability((prev) => ({ ...prev, end: e.target.value }))} className="flex-1 px-3 py-2 border border-border rounded-lg" style={{ fontSize: 13 }} />
            </div>
            <button onClick={saveAvailability} className="w-full mt-4 bg-primary text-white py-2 rounded-lg" style={{ fontSize: 14 }}>
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleAddAppointment} className="bg-white border border-border rounded-xl p-6">
            <h2 className="mb-4 flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
              <Plus size={18} className="text-primary" /> Nueva cita
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={formData.serviceId} onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))} className="px-4 py-3 rounded-lg border border-border bg-white" required>
                <option value="">Servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.nombre}</option>
                ))}
              </select>
              <input value={formData.client} onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))} placeholder="Cliente" className="px-4 py-3 rounded-lg border border-border" required />
              <input type="date" value={formData.date} onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))} className="px-4 py-3 rounded-lg border border-border" required />
              <input type="time" value={formData.time} onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))} className="px-4 py-3 rounded-lg border border-border" required />
            </div>
            <button type="submit" disabled={services.length === 0} className="mt-4 bg-primary text-white px-5 py-2.5 rounded-lg disabled:opacity-50" style={{ fontSize: 14 }}>
              Agregar cita
            </button>
            {services.length === 0 && <p className="text-muted-foreground mt-3" style={{ fontSize: 13 }}>Crea un servicio activo antes de agendar citas.</p>}
          </form>

          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="mb-4" style={{ fontSize: 18, fontWeight: 600 }}>Proximas Citas</h2>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No tienes citas programadas.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-border rounded-lg p-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 500 }}>{serviceById.get(appointment.serviceId)?.nombre ?? "Servicio eliminado"}</h3>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>Cliente: {appointment.client}</p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded" style={{ fontSize: 12 }}>
                          <CalendarIcon size={14} /> {appointment.date}
                        </span>
                        <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded" style={{ fontSize: 12 }}>
                          <Clock size={14} /> {appointment.time}
                        </span>
                        <span className="text-muted-foreground" style={{ fontSize: 12 }}>{appointment.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button onClick={() => updateAppointmentStatus(appointment.id, "Confirmado")} className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-3 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100" type="button">
                        <CheckCircle2 size={16} /> <span style={{ fontSize: 13 }}>Confirmar</span>
                      </button>
                      <button onClick={() => updateAppointmentStatus(appointment.id, "Cancelado")} className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100" type="button">
                        <XCircle size={16} /> <span style={{ fontSize: 13 }}>Cancelar</span>
                      </button>
                      <button onClick={() => deleteAppointment(appointment.id)} className="px-3 py-2 border border-border rounded-lg text-muted-foreground hover:text-red-600" type="button" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

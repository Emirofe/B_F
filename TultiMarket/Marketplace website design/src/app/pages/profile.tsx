import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  MapPin,
  Plus,
  Trash2,
  LogOut,
  Package,
  Heart,
  CreditCard,
  ShieldCheck,
  Settings,
  Store,
  BarChart3,
  Shield,
  ClipboardList,
} from "lucide-react";
import { useStore } from "../context/store-context";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { toast } from "sonner";
import { getNegocioVendedorApi } from "../api/api-client";

type ProfileTab = "info" | "addresses" | "payments" | "security";

export function ProfilePage() {
  const {
    currentUser,
    addresses,
    addAddress,
    removeAddress,
    logout,
    paymentMethods,
  } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", street: "", city: "", state: "", zip: "", country: "" });
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [businessName, setBusinessName] = useState<string>("");

  useEffect(() => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setPhone(currentUser?.phone || "");
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role !== "vendedor") {
      setBusinessName("");
      return;
    }

    getNegocioVendedorApi()
      .then((result) => setBusinessName(result.negocio.nombre_comercial))
      .catch(() => setBusinessName(""));
  }, [currentUser?.role]);

  const roleCopy = useMemo(() => {
    switch (currentUser?.role) {
      case "vendedor":
        return {
          title: "Perfil del vendedor",
          subtitle: businessName || "Gestiona tu tienda, catalogo y pedidos desde un solo lugar.",
          links: [
            { to: "/vendedor/productos", label: "Productos", helper: "Gestionar catalogo", icon: <Store size={22} className="text-primary" /> },
            { to: "/vendedor/pedidos", label: "Pedidos", helper: "Seguimiento comercial", icon: <ClipboardList size={22} className="text-primary" /> },
            { to: "/vendedor/ventas", label: "Ventas", helper: "Metricas del negocio", icon: <BarChart3 size={22} className="text-primary" /> },
          ],
        };
      case "admin":
        return {
          title: "Perfil de administrador",
          subtitle: "Centraliza moderacion, catalogo y control de usuarios.",
          links: [
            { to: "/admin/usuarios", label: "Usuarios", helper: "Control de accesos", icon: <Shield size={22} className="text-primary" /> },
            { to: "/admin/catalogo", label: "Catalogo", helper: "Moderacion del marketplace", icon: <Package size={22} className="text-primary" /> },
            { to: "/admin/reportes", label: "Reportes", helper: "Casos y denuncias", icon: <ClipboardList size={22} className="text-primary" /> },
          ],
        };
      default:
        return {
          title: "Mi cuenta",
          subtitle: "Mantén tus datos, direcciones y métodos de pago al día.",
          links: [
            { to: "/pedidos", label: "Mis pedidos", helper: "Ver historial", icon: <Package size={22} className="text-primary" /> },
            { to: "/wishlist", label: "Lista de deseos", helper: "Productos guardados", icon: <Heart size={22} className="text-red-500" /> },
            { to: "/checkout", label: "Checkout", helper: "Completar compra", icon: <CreditCard size={22} className="text-primary" /> },
          ],
        };
    }
  }, [businessName, currentUser?.role]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4" style={{ fontSize: 22, fontWeight: 600 }}>Inicia sesion para ver tu perfil</h2>
            <Link to="/login" className="text-primary hover:underline">Iniciar Sesion</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil actualizado");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress({ ...newAddr, isDefault: false });
    setNewAddr({ label: "", street: "", city: "", state: "", zip: "", country: "" });
    setShowAddAddress(false);
    toast.success("Direccion agregada");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    toast.success("Contraseña actualizada exitosamente");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary" style={{ fontSize: 24, fontWeight: 700 }}>
                {currentUser.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 600 }}>{roleCopy.title}</h1>
                <p className="text-muted-foreground capitalize" style={{ fontSize: 14 }}>
                  {currentUser.role} · {roleCopy.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 hover:bg-gray-50"
              style={{ fontSize: 14 }}
            >
              <LogOut size={16} /> Cerrar sesion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {roleCopy.links.map((link) => (
            <Link key={link.to} to={link.to} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {link.icon}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 500 }}>{link.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{link.helper}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex border-b border-border mb-6 overflow-x-auto bg-white rounded-t-xl px-2">
          {[
            { id: "info", label: "Informacion", icon: <User size={18} /> },
            { id: "addresses", label: "Direcciones", icon: <MapPin size={18} /> },
            { id: "payments", label: "Pagos", icon: <CreditCard size={18} /> },
            { id: "security", label: "Seguridad", icon: <ShieldCheck size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-gray-900"
              }`}
              style={{ fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500 }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Nombre</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Telefono</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
                    Guardar cambios
                  </button>
                </div>
              </form>

              <div className="rounded-xl border border-border bg-gray-50 p-5">
                <h3 className="mb-3" style={{ fontSize: 16, fontWeight: 600 }}>Resumen del rol</h3>
                <div className="space-y-3 text-muted-foreground" style={{ fontSize: 14 }}>
                  <p><span className="text-foreground" style={{ fontWeight: 600 }}>Rol:</span> {currentUser.role}</p>
                  <p><span className="text-foreground" style={{ fontWeight: 600 }}>Registro:</span> {currentUser.registrationDate}</p>
                  <p><span className="text-foreground" style={{ fontWeight: 600 }}>Estado:</span> {currentUser.status}</p>
                  {currentUser.role === "vendedor" && (
                    <p><span className="text-foreground" style={{ fontWeight: 600 }}>Negocio:</span> {businessName || "Pendiente de configuracion"}</p>
                  )}
                  {currentUser.role === "admin" && (
                    <p><span className="text-foreground" style={{ fontWeight: 600 }}>Acceso:</span> Moderacion y control operativo del marketplace.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
                <MapPin size={20} /> Direcciones
              </h3>
              <button onClick={() => setShowAddAddress(!showAddAddress)} className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: 14, fontWeight: 500 }}>
                <Plus size={16} /> Agregar nueva
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-dashed border-primary/30">
                <input placeholder="Etiqueta" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <input placeholder="Calle y numero" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <input placeholder="Ciudad" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <input placeholder="Estado" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <input placeholder="Codigo postal" value={newAddr.zip} onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <input placeholder="Pais" value={newAddr.country} onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }} required />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg" style={{ fontSize: 14 }}>Guardar</button>
                  <button type="button" onClick={() => setShowAddAddress(false)} className="px-4 py-2 border border-border rounded-lg" style={{ fontSize: 14 }}>Cancelar</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No tienes direcciones registradas.</p>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-border transition-colors hover:bg-gray-100/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{addr.label}</p>
                        {addr.isDefault && (
                          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 600 }}>PREDETERMINADA</span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
                        {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeAddress(addr.id);
                        toast.error("Direccion eliminada");
                      }}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
                <CreditCard size={20} /> Metodos de pago
              </h3>
              <button className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: 14, fontWeight: 500 }} onClick={() => toast.info("La captura de nuevos metodos de pago sigue pendiente de integracion")}>
                <Plus size={16} /> Agregar tarjeta
              </button>
            </div>

            {paymentMethods.length === 0 ? (
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>Todavia no tienes metodos de pago registrados.</p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-border">
                        <span style={{ fontSize: 10, fontWeight: 700 }}>{method.provider.toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>**** **** **** {method.lastFour}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 13 }}>Expira {method.expiry}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 600 }}>ACTIVA</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="flex items-center gap-2 mb-6" style={{ fontSize: 18, fontWeight: 600 }}>
              <ShieldCheck size={20} /> Seguridad de la cuenta
            </h3>

            <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
              <div>
                <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Contraseña actual</label>
                <input type="password" required value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Nueva contraseña</label>
                <input type="password" required value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Confirmar nueva contraseña</label>
                <input type="password" required value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none" style={{ fontSize: 14 }} />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors" style={{ fontSize: 14, fontWeight: 600 }}>
                Actualizar contraseña
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

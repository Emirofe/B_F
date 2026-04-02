import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, MapPin, Plus, Trash2, LogOut, Package, Heart, CreditCard, ShieldCheck, Settings } from "lucide-react";
import { useStore } from "../context/store-context";
import { mockPaymentMethods as initialPayments } from "../data/mock-data";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { toast } from "sonner";

export function ProfilePage() {
  const { currentUser, addresses, addAddress, removeAddress, logout } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", street: "", city: "", state: "", zip: "", country: "" });
  
  // New States for Tabs and Security
  const [activeTab, setActiveTab] = useState<"info" | "addresses" | "payments" | "security">("info");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [payments, setPayments] = useState(initialPayments);

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

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({ ...newAddr, isDefault: false });
    setNewAddr({ label: "", street: "", city: "", state: "", zip: "", country: "" });
    setShowAddAddress(false);
    toast.success("Direccion agregada");
  };
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    toast.success("Contraseña actualizada exitosamente");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleRemovePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    toast.success("Metodo de pago eliminado");
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="mb-6" style={{ fontSize: 28, fontWeight: 600 }}>Mi Cuenta</h1>

        {/* Quick nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link to="/pedidos" className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Package size={24} className="text-primary" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500 }}>Mis Pedidos</p>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>Ver historial</p>
            </div>
          </Link>
          <Link to="/wishlist" className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-red-500" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500 }}>Lista de Deseos</p>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>Productos guardados</p>
            </div>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <LogOut size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500 }}>Cerrar Sesion</p>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>Salir de tu cuenta</p>
            </div>
          </button>
        </div>

        {/* Tabs Desktop */}
        <div className="flex border-b border-border mb-6 overflow-x-auto bg-white rounded-t-xl px-2">
          {[
            { id: "info", label: "Informacion", icon: <User size={18} /> },
            { id: "addresses", label: "Direcciones", icon: <MapPin size={18} /> },
            { id: "payments", label: "Pagos", icon: <CreditCard size={18} /> },
            { id: "security", label: "Seguridad", icon: <ShieldCheck size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-gray-900"
              }`}
              style={{ fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500 }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "info" && (
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary" style={{ fontSize: 24, fontWeight: 700 }}>
                  {currentUser.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 600 }}>{currentUser.name}</h2>
                  <p className="text-muted-foreground capitalize" style={{ fontSize: 14 }}>{currentUser.role}</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Telefono</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
                  <MapPin size={20} /> Mis Direcciones
                </h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-1 text-primary hover:underline"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  <Plus size={16} /> Agregar Nueva
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-dashed border-primary/30">
                  <input
                    placeholder="Etiqueta (Casa, Oficina...)"
                    value={newAddr.label}
                    onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
                  <input
                    placeholder="Calle y numero"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
                  <input
                    placeholder="Ciudad"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
                  <input
                    placeholder="Estado"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
                  <input
                    placeholder="Codigo postal"
                    value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
                  <input
                    placeholder="País"
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: 14 }}
                    required
                  />
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
                  <CreditCard size={20} /> Metodos de Pago
                </h3>
                <button
                  className="flex items-center gap-1 text-primary hover:underline"
                  style={{ fontSize: 14, fontWeight: 500 }}
                  onClick={() => toast.info("Funcionalidad de agregar tarjeta proximamente con Pasarela Real")}
                >
                  <Plus size={16} /> Agregar Tarjeta
                </button>
              </div>

              <div className="space-y-4">
                {payments.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-border">
                        <span style={{ fontSize: 10, fontWeight: 700 }}>{pm.provider.toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>**** **** **** {pm.lastFour}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 13 }}>Expira {pm.expiry}</p>
                      </div>
                      {pm.isDefault && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 600 }}>ACTIVA</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemovePayment(pm.id)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 className="flex items-center gap-2 mb-6" style={{ fontSize: 18, fontWeight: 600 }}>
                <ShieldCheck size={20} /> Seguridad de la Cuenta
              </h3>
              
              <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Contraseña Actual</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <hr className="border-border my-4" />
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Nueva Contraseña</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-muted-foreground" style={{ fontSize: 13 }}>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:border-primary outline-none"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

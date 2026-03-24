import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Store, Eye, EyeOff } from "lucide-react";
import { useStore } from "../context/store-context";
import { toast } from "sonner";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("comprador");
  const [showPassword, setShowPassword] = useState(false);
  
  // Business Fields for Sellers
  const [businessName, setBusinessName] = useState("");
  const [rfc, setRfc] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Inline error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useStore();
  const navigate = useNavigate();

  const clearError = (field: string) => {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const getPasswordStrength = (p: string): { label: string; color: string; width: string } => {
    if (p.length === 0) return { label: "", color: "", width: "0%" };
    if (p.length < 6) return { label: "Debil", color: "bg-red-500", width: "33%" };
    if (p.length < 10) return { label: "Media", color: "bg-amber-500", width: "66%" };
    return { label: "Fuerte", color: "bg-green-500", width: "100%" };
  };
  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "El correo es obligatorio";
    else if (!emailRegex.test(email)) newErrors.email = "Ingresa un correo valido (ej. tu@correo.com)";
    if (!password) newErrors.password = "La contrasena es obligatoria";
    else if (password.length < 8) newErrors.password = "Minimo 8 caracteres";
    if (!confirmPassword) newErrors.confirmPassword = "Confirma tu contrasena";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Las contrasenas no coinciden";

    if (role === "vendedor") {
      if (!businessName.trim()) newErrors.businessName = "El nombre del negocio es obligatorio";
      if (!rfc.trim()) newErrors.rfc = "El RFC es obligatorio";
      else {
        const rfcRegex = /^[A-Z0-9]{12,13}$/i;
        if (!rfcRegex.test(rfc)) newErrors.rfc = "El RFC debe tener 12 o 13 caracteres alfanumericos";
      }
      if (!businessAddress.trim()) newErrors.businessAddress = "La direccion fiscal es obligatoria";
    }

    if (email === "existente@correo.com") newErrors.email = "Este correo ya esta registrado";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Corrige los campos marcados en rojo");
      return;
    }

    register(name, email, password, role);
    toast.success("Cuenta creada exitosamente");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Store size={36} className="text-primary" />
            <span className="text-primary" style={{ fontSize: 28, fontWeight: 700 }}>TultiMarket</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h1 className="text-center mb-6" style={{ fontSize: 24, fontWeight: 600 }}>Crear Cuenta</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                placeholder="Tu nombre completo"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500 bg-red-50/50" : "border-border bg-input-background"} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                style={{ fontSize: 14 }}
              />
              {errors.name && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.name}</p>}
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="tu@correo.com"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500 bg-red-50/50" : "border-border bg-input-background"} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                style={{ fontSize: 14 }}
              />
              {errors.email && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  placeholder="Minimo 8 caracteres"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-500 bg-red-50/50" : "border-border bg-input-background"} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12`}
                  style={{ fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.password}</p>}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>Seguridad: {strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Confirmar contrasena</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                placeholder="Repite tu contrasena"
                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? "border-red-500 bg-red-50/50" : "border-border bg-input-background"} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                style={{ fontSize: 14 }}
              />
              {errors.confirmPassword && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: 14 }}>Tipo de cuenta</label>
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setRole("comprador")}
                  className={`flex-1 py-2.5 transition-colors ${
                    role === "comprador" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-gray-50"
                  }`}
                  style={{ fontSize: 14 }}
                >
                  Comprador
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vendedor")}
                  className={`flex-1 py-2.5 transition-colors ${
                    role === "vendedor" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-gray-50"
                  }`}
                  style={{ fontSize: 14 }}
                >
                  Vendedor
                </button>
              </div>
            </div>

            {role === "vendedor" && (
              <div className="space-y-4 pt-4 border-t border-border mt-4">
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>Datos del Negocio</h3>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13 }}>Nombre del Negocio</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); clearError("businessName"); }}
                    placeholder="Ej. Eventos Tultitlan"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.businessName ? "border-red-500 bg-red-50/50" : "border-border bg-gray-50"} focus:border-primary outline-none`}
                    style={{ fontSize: 14 }}
                  />
                  {errors.businessName && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.businessName}</p>}
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13 }}>RFC del Negocio</label>
                  <input
                    type="text"
                    value={rfc}
                    onChange={(e) => { setRfc(e.target.value); clearError("rfc"); }}
                    placeholder="RFC de 12-13 caracteres"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.rfc ? "border-red-500 bg-red-50/50" : "border-border bg-gray-50"} focus:border-primary outline-none uppercase`}
                    style={{ fontSize: 14 }}
                    maxLength={13}
                  />
                  {errors.rfc && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.rfc}</p>}
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 13 }}>Direccion Fiscal / Local</label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => { setBusinessAddress(e.target.value); clearError("businessAddress"); }}
                    placeholder="Calle, Numero, Col, CP"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.businessAddress ? "border-red-500 bg-red-50/50" : "border-border bg-gray-50"} focus:border-primary outline-none`}
                    style={{ fontSize: 14 }}
                  />
                  {errors.businessAddress && <p className="text-red-500 mt-1" style={{ fontSize: 12 }}>{errors.businessAddress}</p>}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: 14 }}>
            Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary hover:underline" style={{ fontWeight: 600 }}>
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Store, Eye, EyeOff } from "lucide-react";
import { useStore } from "../context/store-context";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const { login, currentUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    const loggedInUser = login(email, password);
    if (!loggedInUser) {
      toast.error("Credenciales invalidas");
      return;
    }
    
    toast.success("Sesion iniciada correctamente");
    if (loggedInUser.role === "vendedor") navigate("/vendedor/productos");
    else if (loggedInUser.role === "admin") navigate("/admin/usuarios");
    else navigate("/");
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
          <h1 className="text-center mb-6" style={{ fontSize: 24, fontWeight: 600 }}>Iniciar Sesion</h1>


          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: 14 }}>Contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                  style={{ fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="remember" style={{ fontSize: 13 }}>Recordarme</label>
              </div>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-primary hover:underline" 
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              Iniciar Sesion
            </button>
          </form>

          {/* Forgot Password Modal */}
          {showForgotModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="mb-2" style={{ fontSize: 20, fontWeight: 600 }}>Recuperar Contraseña</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 13 }}>
                  Ingresa tu correo electronico y te enviaremos instrucciones para restablecer tu cuenta.
                </p>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 mb-4 outline-none focus:border-primary"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                        toast.success("Enlace de recuperacion enviado a " + forgotEmail);
                        setShowForgotModal(false);
                    }}
                    className="flex-1 bg-primary text-white py-2 rounded-lg"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    Enviar Enlace
                  </button>
                  <button 
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 border border-border py-2 rounded-lg"
                    style={{ fontSize: 14 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-muted-foreground" style={{ fontSize: 14 }}>
            No tienes cuenta?{" "}
            <Link to="/registro" className="text-primary hover:underline" style={{ fontWeight: 600 }}>
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
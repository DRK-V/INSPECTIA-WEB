import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  Check
} from "lucide-react";

const BACKEND_URL = "https://inspectia-web.onrender.com";

export default function LoginNew() {
  const { login } = useUser();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Validación en tiempo real
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campo si ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    return !emailError && !passwordError && formData.email && formData.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });

    if (Object.keys(newErrors).length > 0) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales incorrectas");
      }

      const data = await res.json();
      console.log("Usuario logueado:", data.user);

      login(data.user);
      toast.success(`¡Bienvenido, ${data.user.nombre}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión");
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center pt-16 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">
            Accede a tu panel de gestión QA
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? "border-red-300 focus:ring-red-500"
                      : formData.email && !errors.email
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
                {formData.email && !errors.email && touched.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password && touched.password
                      ? "border-red-300 focus:ring-red-500"
                      : formData.password && !errors.password
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.div>
              )}
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !isFormValid()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:transform active:scale-[0.98] shadow-lg"
              }`}
              whileHover={{ scale: loading || !isFormValid() ? 1 : 1.02 }}
              whileTap={{ scale: loading || !isFormValid() ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Nuevo en INSPECTIA-WEB?</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Crear cuenta nueva
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Demo credentials note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          <p className="bg-gray-50 rounded-lg p-3 border">
            <strong>Demo:</strong> Puedes probar con credenciales de ejemplo <br />
            o crear una cuenta nueva para comenzar.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

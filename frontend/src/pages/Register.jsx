import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  Check,
  ArrowLeft
} from "lucide-react";

const BACKEND_URL = "https://inspectia-web.onrender.com";

export default function RegisterNew() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    empresa: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Validación en tiempo real
  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case 'nombre':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      case 'apellido':
        if (!value) return 'El apellido es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Debe incluir mayúscula, minúscula y número';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== allData.password) return 'Las contraseñas no coinciden';
        return '';
      case 'telefono':
        if (!value) return 'El teléfono es requerido';
        if (!/^\+?[\d\s-()]{10,15}$/.test(value)) return 'Formato de teléfono inválido';
        return '';
      case 'empresa':
        if (!value) return 'La empresa es requerida';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Validar campo si ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value, newFormData);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Validar confirmPassword si password cambia
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, newFormData);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const fields = Object.keys(formData);
    return fields.every(field => {
      const error = validateField(field, formData[field]);
      return !error && formData[field];
    });
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Muy débil', color: 'text-red-600' };
      case 2: return { text: 'Débil', color: 'text-orange-600' };
      case 3: return { text: 'Regular', color: 'text-yellow-600' };
      case 4: return { text: 'Fuerte', color: 'text-green-600' };
      case 5: return { text: 'Muy fuerte', color: 'text-green-700' };
      default: return { text: '', color: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("¡Cuenta creada exitosamente! Redirigiendo...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || "No se pudo crear la cuenta");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 pt-16 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Regístrate y comienza a optimizar tus procesos de testing con IA. 
            Únete a la nueva generación de gestión de calidad.
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
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.nombre && touched.nombre
                        ? "border-red-300 focus:ring-red-500"
                        : formData.nombre && !errors.nombre
                        ? "border-green-300 focus:ring-green-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="Tu nombre"
                    disabled={loading}
                  />
                  {formData.nombre && !errors.nombre && touched.nombre && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.nombre && touched.nombre && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.nombre}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.apellido && touched.apellido
                        ? "border-red-300 focus:ring-red-500"
                        : formData.apellido && !errors.apellido
                        ? "border-green-300 focus:ring-green-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="Tu apellido"
                    disabled={loading}
                  />
                  {formData.apellido && !errors.apellido && touched.apellido && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.apellido && touched.apellido && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.apellido}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.telefono && touched.telefono
                        ? "border-red-300 focus:ring-red-500"
                        : formData.telefono && !errors.telefono
                        ? "border-green-300 focus:ring-green-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="+1 (555) 123-4567"
                    disabled={loading}
                  />
                  {formData.telefono && !errors.telefono && touched.telefono && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.telefono && touched.telefono && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.telefono}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.empresa && touched.empresa
                      ? "border-red-300 focus:ring-red-500"
                      : formData.empresa && !errors.empresa
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                  placeholder="Nombre de tu empresa"
                  disabled={loading}
                />
                {formData.empresa && !errors.empresa && touched.empresa && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.empresa && touched.empresa && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.empresa}
                </motion.div>
              )}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Fortaleza:</span>
                      <span className={strengthInfo.color}>{strengthInfo.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength <= 2 ? 'bg-red-500' :
                          passwordStrength === 3 ? 'bg-yellow-500' :
                          passwordStrength === 4 ? 'bg-green-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : formData.confirmPassword && !errors.confirmPassword
                        ? "border-green-300 focus:ring-green-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="Confirma tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </motion.div>
                )}
              </div>
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Iniciar sesión
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

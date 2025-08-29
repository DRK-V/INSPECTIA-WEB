const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  // Usuarios
  registerUser,
  loginUser,
  getUserById,
  // Proyectos
  getProyectoById,
  createProyecto,
  getProyectosByUsuario,
  getAllProyectos,
  downloadArchivoHU,
  updateCasoPruebaEstado,
  asignarProyecto,
  getCasosByProyecto,

  // Casos de prueba
  generarCasosPrueba,
  getCasoById,
  validarCasosProyecto,
  // Evidencias
  createEvidencia,
  getEvidenciasByEjecucion,

  crearEjecucion,
  subirEvidencia,
  obtenerEjecucionesPorCaso,
  obtenerEvidenciasPorEjecucion,
} = require("../controllers/datacontroller");

router.post("/ejecuciones", crearEjecucion);
router.get("/ejecuciones/:casoId", obtenerEjecucionesPorCaso);
router.put("/casos/:casoId/estado", updateCasoPruebaEstado);

router.post("/evidencias", upload.single("archivo"), subirEvidencia);
router.get("/evidencias/:ejecucionId", obtenerEvidenciasPorEjecucion);
/* ---------------------- USUARIOS ---------------------- */
// Autenticación
router.post("/register", registerUser);
router.post("/login", loginUser);


// CRUD usuarios

router.get("/users/:id", getUserById);

/* ---------------------- PROYECTOS ---------------------- */
router.post("/create", upload.single("archivo_hu"), createProyecto);
router.get("/proyectos/:usuario_id", getProyectosByUsuario);
// Obtener todos los proyectos
router.get("/proyectos", getAllProyectos);
router.get("/proyectos/:proyecto_id/hu", downloadArchivoHU);
router.post("/proyectos/:proyecto_id/generar-casos", generarCasosPrueba);
router.get("/proyecto/:id", getProyectoById);
router.post("/asignarProyecto", asignarProyecto);
router.get("/:proyecto_id/validar-casos", validarCasosProyecto);
/* ------------------- CASOS DE PRUEBA ------------------- */
router.get("/casos/:id", getCasoById);
router.get("/proyectos/:proyecto_id/casos", getCasosByProyecto);

/* -------------------- EJECUCIONES ---------------------- */

/* --------------------- EVIDENCIAS ---------------------- */
router.post("/evidencias", createEvidencia);
router.get("/evidencias/:ejecucion_id", getEvidenciasByEjecucion);

module.exports = router;

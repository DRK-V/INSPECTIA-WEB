/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         telefono:
 *           type: string
 *           nullable: true
 *         empresa:
 *           type: string
 *           nullable: true
 *         rol:
 *           type: string
 *           enum: [cliente, qa_manager, qa_tester, admin]
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *         ultimo_login:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fecha_actualizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       example:
 *         id: 1
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         email: "juan@email.com"
 *         telefono: "+573001112233"
 *         empresa: "Tech Solutions"
 *         rol: "cliente"
 *         fecha_registro: "2025-08-28T15:30:00Z"
 *         ultimo_login: "2025-08-29T09:10:00Z"
 *         fecha_actualizacion: "2025-08-29T10:00:00Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Proyecto:
 *       type: object
 *       required:
 *         - usuario_id
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *         usuario_id:
 *           type: integer
 *           description: ID del cliente dueño del proyecto
 *         nombre:
 *           type: string
 *         url:
 *           type: string
 *           nullable: true
 *         descripcion:
 *           type: string
 *           nullable: true
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 10
 *         usuario_id: 1
 *         nombre: "Proyecto Web QA"
 *         url: "https://miweb.com"
 *         descripcion: "Proyecto de pruebas para la web corporativa"
 *         fecha_creacion: "2025-08-29T09:00:00Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     HistoriaUsuario:
 *       type: object
 *       required:
 *         - proyecto_id
 *         - titulo
 *       properties:
 *         id:
 *           type: integer
 *         proyecto_id:
 *           type: integer
 *         titulo:
 *           type: string
 *         descripcion:
 *           type: string
 *           nullable: true
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 100
 *         proyecto_id: 10
 *         titulo: "Como usuario quiero registrarme"
 *         descripcion: "Registro con email y contraseña"
 *         fecha_creacion: "2025-08-29T09:30:00Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CasoPrueba:
 *       type: object
 *       required:
 *         - historia_id
 *         - descripcion
 *       properties:
 *         id:
 *           type: integer
 *         historia_id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [funcional, no_funcional, seguridad, rendimiento]
 *         prioridad:
 *           type: string
 *           enum: [alta, media, baja]
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 200
 *         historia_id: 100
 *         descripcion: "Validar que el registro sea exitoso con datos válidos"
 *         tipo: "funcional"
 *         prioridad: "alta"
 *         fecha_creacion: "2025-08-29T09:45:00Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Ejecucion:
 *       type: object
 *       required:
 *         - caso_id
 *         - tester_id
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *         caso_id:
 *           type: integer
 *         tester_id:
 *           type: integer
 *         estado:
 *           type: string
 *           enum: [aprobado, fallido, bloqueado, pendiente]
 *         observaciones:
 *           type: string
 *           nullable: true
 *         fecha_ejecucion:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 300
 *         caso_id: 200
 *         tester_id: 5
 *         estado: "aprobado"
 *         observaciones: "Todo correcto"
 *         fecha_ejecucion: "2025-08-29T10:00:00Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Evidencia:
 *       type: object
 *       required:
 *         - ejecucion_id
 *         - tipo
 *         - url
 *       properties:
 *         id:
 *           type: integer
 *         ejecucion_id:
 *           type: integer
 *         tipo:
 *           type: string
 *           enum: [imagen, video, log, archivo]
 *         url:
 *           type: string
 *           description: Ruta o enlace a la evidencia
 *         fecha_subida:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 400
 *         ejecucion_id: 300
 *         tipo: "imagen"
 *         url: "https://miapi.com/evidencias/captura1.png"
 *         fecha_subida: "2025-08-29T10:15:00Z"
 */

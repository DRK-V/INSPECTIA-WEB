/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Email del usuario
 *       example:
 *         id: "123"
 *         nombre: "Juan"
 *         email: "juan@email.com"
 */

class User {
    constructor(id, nombre, email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }
}

module.exports = User;

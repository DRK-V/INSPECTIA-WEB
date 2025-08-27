const supabase = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Registro de usuario
const registerUser = async (req, res) => {
    const { email, password, nombre, apellido, telefono, empresa } = req.body;

    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({ message: 'Los campos email, password, nombre y apellido son requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    email,
                    password_hash: hashedPassword,
                    nombre,
                    apellido,
                    telefono,
                    empresa
                }
            ])
            .select();

        if (error) return res.status(400).json({ message: error.message });

        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: data[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Los campos email y password son requeridos.' });
    }

    try {
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Actualizar último login
        await supabase.from('usuarios')
            .update({ ultimo_login: new Date() })
            .eq('id', user.id);

        res.status(200).json({ message: 'Inicio de sesión exitoso.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// Verificar email
const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('email', email)
            .single();

        if (error || !data) return res.status(404).json({ message: 'Correo no encontrado' });

        res.json({ id: data.id, email: data.email });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar el correo' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { id, email, password } = req.body;

    if (!id || !email || !password) {
        return res.status(400).json({ message: 'Los campos id, email y password son requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { error } = await supabase
            .from('usuarios')
            .update({ password_hash: hashedPassword })
            .eq('id', id)
            .eq('email', email);

        if (error) return res.status(500).json({ message: 'Error al cambiar la contraseña.' });

        res.json({ message: 'Contraseña cambiada con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

module.exports = { 
    registerUser,
    loginUser,
    checkEmail,
    resetPassword
};

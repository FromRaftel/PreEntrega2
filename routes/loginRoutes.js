const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta de login
router.get('/', (req, res) => {
  res.render('login', { message: req.flash('error') }); // Agregamos el mensaje flash si existe
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/productos',
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res) => {
  // Si el correo y la contraseña coinciden con las credenciales del usuario "admin"
  if (req.body.email === 'adminCoder@coder.com' && req.user.role === 'admin') {
    req.user.role = 'admin';
  }
});

// Ruta de logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;

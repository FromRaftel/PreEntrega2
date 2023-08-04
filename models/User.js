const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'usuario' }, // Rol por defecto: 'usuario'
});

const User = mongoose.model('User', userSchema);

module.exports = User;

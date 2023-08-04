const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const Product = require('./models/Product');
const User = require('./models/User');

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');

// Middleware para parsear el body de las peticiones a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar las rutas para los recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Configurar sesión de usuario con express-session
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
}));

// Configurar mensajes flash
app.use(flash());

// Configurar passport
app.use(passport.initialize());
app.use(passport.session());

// Estrategia local de passport para el login
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado.' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize y deserialize el usuario para la sesión de passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Rutas
const exampleRouter = require('./routes/exampleRoutes');
const loginRouter = require('./routes/loginRoutes');
const productsRouter = require('./routes/productsRoutes');

app.use('/api/example', exampleRouter);
app.use('/login', loginRouter);
app.use('/api/products', productsRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para la página de productos (con autenticación requerida)
app.get('/productos', isAuthenticated, (req, res) => {
  res.render('productos', { user: req.user });
});

// Ruta para el carrito de compras (con autenticación requerida)
app.get('/carrito', isAuthenticated, (req, res) => {
  res.send('Aquí se mostrará el contenido del carrito de compras');
});

// Ruta para la página de contacto (con autenticación requerida)
app.get('/contacto', isAuthenticated, (req, res) => {
  res.send('Aquí podrás ponerte en contacto con nosotros');
});

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: 'usuario',
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para el login de usuarios
app.post('/login', passport.authenticate('local', {
  successRedirect: '/productos',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Ruta para el logout de usuarios
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

// Conectar a la base de datos
const dbURL = 'mongodb://localhost:27017/MangaStore';
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión exitosa a la base de datos');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

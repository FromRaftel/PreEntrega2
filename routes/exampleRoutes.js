const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ruta de ejemplo');
});

module.exports = router;

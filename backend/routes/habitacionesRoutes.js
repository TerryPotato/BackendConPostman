const express = require('express');
const router = express.Router();
const { getHabitaciones, createHabitacion, updateHabitacion, deleteHabitacion } = require('../controllers/habitacionesControllers');

// Obtenemos las habitaciones
router.get('/', getHabitaciones);
// Creamos una habitación
router.post('/', createHabitacion);
// Modificamos la disponibilidad de una habitación
router.put('/', updateHabitacion);
// Eliminamos una habitación
router.delete('/', deleteHabitacion);

module.exports = router;
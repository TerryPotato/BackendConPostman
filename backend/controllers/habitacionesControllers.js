const asyngHandler = require('express-async-handler');
const Habitaciones = require('../models/habitacionesModel');

const getHabitaciones = asyngHandler(async (req, res) => {
    const habitaciones = await Habitaciones.find();
    res.status(200).json({ habitaciones }); 
});

const createHabitacion = asyngHandler(async (req, res) => {
    const {numero, tipo ,precio} = req.body;
    if (!numero || !tipo || !precio) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    const habitacion = await Habitaciones.create({
        numero,
        tipo,
        precio
    });
    res.status(201).json({ habitacion });
});

const updateHabitacion = asyngHandler(async (req, res) => {

    //Pide el numero de habitación a cambiar
    const {numero} = req.body;
    if (!numero) {
        res.status(400);
        throw new Error("Por favor proporciona un número de habitación");
    }
    //Busca la habitacion
    const habitacion = await Habitaciones.findOne({ numero});
    if (!habitacion) {
        res.status(404);
        throw new Error("Habitacion no encontrada");
    }
    //Cambia la habitacion
    habitacion.disponibilidad = !habitacion.disponibilidad;
    const habitacionActualizada = await habitacion.save();
    if (!habitacionActualizada) {
        res.status(400);
        throw new Error("Error al actualizar la habitación");
    }
    //Devuelve la habitación actualizada
    res.status(200).json({
        mensaje: `Habitacion con numero ${numero} actualizada`,
        habitacion: habitacionActualizada
    })

    res.status(200).json({ mensaje: `Habitacion con id ${req.params.id} actualizada` });




});

const deleteHabitacion = asyngHandler(async (req, res) => {
    const {numero} = req.body;
    if (!numero) {
        res.status(400);
        throw new Error("Por favor proporciona un número de habitación");
    }
    //Busca la habitacion y elimina
    const habitacionEliminada = await Habitaciones.findOneAndDelete({ numero });
    if (!habitacionEliminada) {
        res.status(404);
        throw new Error("Habitacion no encontrada");
    }

    res.status(200).json({ mensaje: `Habitacion con numero ${numero} eliminada` });
});

module.exports = {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion
};
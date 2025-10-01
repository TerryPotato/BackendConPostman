const request = require('supertest');
const express = require('express');
const asyncHandler = require('express-async-handler');
const Habitacion = require('../models/habitacionesModel');
const habitacionesRoutes = require('../routes/habitacionesRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/habitaciones', habitacionesRoutes);

// Mock the error handler to see the actual error
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

describe('Habitaciones API', () => {

  describe('GET /api/habitaciones', () => {
    it('should return an empty array when no habitaciones exist', async () => {
      const res = await request(app).get('/api/habitaciones');
      expect(res.statusCode).toEqual(200);
      expect(res.body.habitaciones).toEqual([]);
    });

    it('should return all habitaciones', async () => {
      await Habitacion.create([
        { numero: 101, tipo: 'Individual', precio: 50 },
        { numero: 102, tipo: 'Doble', precio: 80 },
      ]);
      const res = await request(app).get('/api/habitaciones');
      expect(res.statusCode).toEqual(200);
      expect(res.body.habitaciones.length).toEqual(2);
    });
  });

  describe('POST /api/habitaciones', () => {
    it('should create a new habitacion', async () => {
      const newHabitacion = {
        numero: 103,
        tipo: 'Suite',
        precio: 150,
      };
      const res = await request(app)
        .post('/api/habitaciones')
        .send(newHabitacion);
      expect(res.statusCode).toEqual(201);
      expect(res.body.habitacion.numero).toEqual(newHabitacion.numero);
      expect(res.body.habitacion.tipo).toEqual(newHabitacion.tipo);
      expect(res.body.habitacion.precio).toEqual(newHabitacion.precio);

      const habitacionInDb = await Habitacion.findOne({ numero: 103 });
      expect(habitacionInDb).not.toBeNull();
    });

    it('should return 400 if required fields are missing', async () => {
      const newHabitacion = {
        numero: 104,
        // Missing tipo and precio
      };
      const res = await request(app)
        .post('/api/habitaciones')
        .send(newHabitacion);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Por favor, completa todos los campos obligatorios');
    });
  });

  describe('PUT /api/habitaciones', () => {
    it('should update a habitacion\'s disponibilidad', async () => {
      const habitacion = await Habitacion.create({
        numero: 201,
        tipo: 'Individual',
        precio: 55,
        disponibilidad: true,
      });

      const res = await request(app)
        .put('/api/habitaciones')
        .send({ numero: 201 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.habitacion.disponibilidad).toEqual(false);

      const updatedHabitacion = await Habitacion.findOne({ numero: 201 });
      expect(updatedHabitacion.disponibilidad).toEqual(false);
    });

    it('should return 400 if numero is not provided', async () => {
        const res = await request(app)
          .put('/api/habitaciones')
          .send({}); // No numero
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Por favor proporciona un número de habitación');
      });

    it('should return 404 if habitacion is not found', async () => {
      const res = await request(app)
        .put('/api/habitaciones')
        .send({ numero: 999 }); // Non-existent numero
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Habitacion no encontrada');
    });
  });

  describe('DELETE /api/habitaciones', () => {
    it('should delete a habitacion', async () => {
        await Habitacion.create({
            numero: 301,
            tipo: 'Doble',
            precio: 90,
        });

        const res = await request(app)
            .delete('/api/habitaciones')
            .send({ numero: 301 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.mensaje).toEqual('Habitacion con numero 301 eliminada');

        const habitacionInDb = await Habitacion.findOne({ numero: 301 });
        expect(habitacionInDb).toBeNull();
    });

    it('should return 400 if numero is not provided', async () => {
        const res = await request(app)
          .delete('/api/habitaciones')
          .send({}); // No numero
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Por favor proporciona un número de habitación');
      });

    it('should return 404 if habitacion not found', async () => {
      const res = await request(app)
        .delete('/api/habitaciones')
        .send({ numero: 999 }); // Non-existent numero
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Habitacion no encontrada');
    });
  });
});
const mongoose = require('mongoose');

const habitacionesSchema = mongoose.Schema({ 
    numero: {
        type : Number,
        required: [true, "El número de habitación es obligatorio"]
    },
    tipo: {
        type : String,
        required: [true, "El tipo de habitación es obligatorio"]
    },
    precio: {
        type : Number,
        required: [true, "El precio de habitación es obligatorio"]
    },
    disponibilidad: {
        type : Boolean,
        default: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Habitaciones", habitacionesSchema, `Habitaciones`);
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Electrónica', 'Alimentos', 'Ropa', 'Hogar', 'Otros']
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    proveedor: {
        type: String,
        required: true
    },
    fechaIngreso: {
        type: Date,
        default: Date.now
    },
    codigoBarras: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('Producto', productoSchema);
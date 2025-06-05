const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Página principal
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ fechaIngreso: -1 }).limit(10);
        res.render('index', { productos });
    } catch (err) {
        console.error(err);
        res.render('index', { productos: [] });
    }
});

// Mostrar formulario para agregar producto
router.get('/agregar', (req, res) => {
    res.render('agregar',{error:false});
});

// Agregar nuevo producto
router.post('/agregar', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('agregar', { error: 'Error al agregar el producto' });
    }
});

// Buscar productos (búsqueda simple)
router.get('/buscar', async (req, res) => {
    const query = req.query.q;
    try {
        const productos = await Producto.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { descripcion: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('buscar', { productos, query ,busquedaAvanzada:false});
    } catch (err) {
        console.error(err);
        res.render('buscar', { productos: [], query,busquedaAvanzada:false});
    }
});

// Búsqueda avanzada
router.get('/busqueda-avanzada', async (req, res) => {
    const { categoria, minPrecio, maxPrecio, minCantidad } = req.query;
    const filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (minPrecio) filtro.precio = { ...filtro.precio, $gte: Number(minPrecio) };
    if (maxPrecio) filtro.precio = { ...filtro.precio, $lte: Number(maxPrecio) };
    if (minCantidad) filtro.cantidad = { $gte: Number(minCantidad) };

    try {
        const productos = await Producto.find(filtro);
        res.render('buscar', { 
            productos, 
            busquedaAvanzada: true,
            filtros: { categoria, minPrecio, maxPrecio, minCantidad }
        });
    } catch (err) {
        console.error(err);
        res.render('buscar', { productos: [], busquedaAvanzada: true });
    }
});

// Mostrar detalles de producto
router.get('/producto/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        res.render('producto', { producto });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        res.render('editar', {producto,error:false});
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Actualizar producto
router.post('/editar/:id', async (req, res) => {
    try {
        await Producto.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/producto/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.render('editar', { error: 'Error al actualizar el producto' });
    }
});

// Eliminar producto
router.post('/eliminar/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const path = require('path');

const productManager = new ProductManager(
  path.resolve('src/data/products.json')
);
const router = Router();


router.get('/', async (request, response) => {
    try {
        const productos = await productManager.getAll();
        response.send({ productos });
    } catch (error) {
        response.send({ error: 'No se pudieron leer los productos', detalle: error.message });
    }
});

router.get('/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        const producto = await productManager.getById(productId);
        if (!producto) return response.send({ error: 'Producto no encontrado' });
        response.send({ producto });
    } catch (error) {
        response.send({ error: 'No se pudo leer el producto', detalle: error.message });
    }
});

router.post('/', async (request, response) => {
    try {
        const datos = request.body || {};
        if (!datos.title || !datos.description || !datos.code ||
            datos.price === undefined || datos.status === undefined ||
            datos.stock === undefined || !datos.category || datos.drop === undefined) {
            return response.send({ error: 'Faltan datos para crear el producto' });
        }
        const producto = await productManager.add(datos);
        response.send({ mensaje: 'Producto agregado', producto });
    } catch (error) {
        response.send({ error: error.message });
    }
});

router.put('/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        const cambios = request.body || {};
        const producto = await productManager.update(productId, cambios);
        response.send({ mensaje: 'Producto actualizado', producto });
    } catch (error) {
        response.send({ error: error.message });
    }
});

router.delete('/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        const eliminado = await productManager.delete(productId);
        response.send({ mensaje: 'Producto eliminado', eliminado });
    } catch (error) {
        response.send({ error: error.message });
    }
});



module.exports = router;

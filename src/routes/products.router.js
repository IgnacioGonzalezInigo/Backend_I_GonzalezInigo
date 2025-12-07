const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();


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
        if (!datos.title || !datos.description || !datos.code || datos.price === undefined || datos.status === undefined || datos.stock === undefined || !datos.category) {
            return response.send({ error: 'Faltan datos para crear el producto' });
        }
        const producto = await productManager.add(datos);
        response.send({ mensaje: 'Producto agregado', producto });
    } catch (error) {
        response.send({ error: error.message });
    }
});
module.exports = router;

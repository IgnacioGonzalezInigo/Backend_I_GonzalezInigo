const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();


router.get('/', async (request, response) => {
    try {
        const productos = await productManager.getAll();
        response.json({
            status: 'ok',
            mensaje: 'Listado de productos',
            data: productos
        });
    } catch (error) {
        response.status(500).json({
            status: 'error',
            mensaje: 'No se pudieron leer los productos',
            detalle: error.message
        });
    }
});

router.get('/:pid', async (request, response) => {
    try {
        const productId = request.params.pid;
        const producto = await productManager.getById(productId);

        if (!producto) {
            return response.status(404).json({
                status: 'error',
                mensaje: 'Producto no encontrado'
            });
        }

        response.json({
            status: 'ok',
            mensaje: 'Detalle de producto',
            data: producto
        });
    } catch (error) {
        response.status(500).json({
            status: 'error',
            mensaje: 'No se pudo leer el producto',
            detalle: error.message
        });
    }
});

module.exports = router;

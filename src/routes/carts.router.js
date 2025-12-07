const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();
const cartManager = new CartManager();

router.get('/:cid', async (request, response) => {
    try {
        const cartId = request.params.cid;
        const carrito = await cartManager.getById(cartId);
        if (!carrito) return response.send({ error: 'Carrito no encontrado' });
        response.send({ productos: carrito.products });
    } catch (error) {
        response.send({ error: error.message });
    }
});

router.post('/', async (request, response) => {
    try {
        const carrito = await cartManager.create();
        response.send({ mensaje: 'Carrito creado', carrito });
    } catch (error) {
        response.send({ error: error.message });
    }
});

module.exports = router;
const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');


const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

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

router.post('/:cid/product/:pid', async (request, response) => {
    try {
        const cartId = request.params.cid;
        const productId = request.params.pid;
        const quantity = request.body && request.body.quantity ? Number(request.body.quantity) : 1;

        
        const existeProducto = await productManager.getById(productId);
        if (!existeProducto) return response.send({ error: 'El producto no existe' });

        const carrito = await cartManager.addProduct(cartId, productId, quantity);
        response.send({ mensaje: 'Producto agregado al carrito', carrito });
    } catch (error) {
        response.send({ error: error.message });
    }
});

module.exports = router;
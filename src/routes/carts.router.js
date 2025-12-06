const { Router } = require('express');

const router = Router();

router.get('/', (request, response) => {
    response.json({
        status: 'ok',
        mensaje: 'Listado de carritos (router OK)'
    });
});

router.get('/:cid', (request, response) => {
    const cartId = request.params.cid;

    response.json({
        status: 'ok',
        mensaje: `Productos del carrito ${cartId} (router OK)`
    });
});


router.post('/:cid/product/:pid', (request, response) => {
    const cartId = request.params.cid;
    const productId = request.params.pid;

    response.json({
        status: 'ok',
        mensaje: `Producto ${productId} agregado al carrito ${cartId} (router OK)`,
        cantidad: request.body?.quantity ?? 1
    });
});

module.exports = router;

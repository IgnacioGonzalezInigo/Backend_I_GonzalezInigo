const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAll();

        const drops = products.map(p => Number(p.drop)).filter(n => Number.isFinite(n));
        const dropActual = drops.length ? Math.max(...drops) : null;

        const dropProducts = dropActual ? products.filter(p => Number(p.drop) === dropActual) : [];
        const chunkSize = 3;
        const dropChunks = [];
        for (let i = 0; i < dropProducts.length; i += chunkSize) {
        dropChunks.push(dropProducts.slice(i, i + chunkSize));
        }

        res.render('home', {
        title: 'Home',
        products,
        dropActual,
        dropProducts,
        dropChunks
        });
    } catch (error) {
        res.status(500).send(`Error cargando productos: ${error.message}`);
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render('realTimeProducts', {
            title: 'Productos en tiempo real',
            products
        });
    } catch (error) {
        res.status(500).send(`Error cargando productos: ${error.message}`);
    }
});

router.get('/cart', (req, res) => {
    res.render('cart', { title: 'Tu Carrito' });
});

module.exports = router;
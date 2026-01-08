const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render('home', {
            title: 'Productos',
            products
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

module.exports = router;
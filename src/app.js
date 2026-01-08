const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = 8080;

const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.set('socketServer', socketServer);

socketServer.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);

    try {
        const products = await productManager.getAll();
        socket.emit('productsUpdated', products);
    } catch (err) {
        socket.emit('productsUpdated', []);
    }

    socket.on('createProduct', async (data) => {
        try {
            await productManager.add(data);
            const updatedProducts = await productManager.getAll();
            socketServer.emit('productsUpdated', updatedProducts);
        } catch (error) {
            console.error('Error creando producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.delete(id);
            const updatedProducts = await productManager.getAll();
            socketServer.emit('productsUpdated', updatedProducts);
        } catch (error) {
            console.error('Error eliminando producto:', error.message);
        }
    });

});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
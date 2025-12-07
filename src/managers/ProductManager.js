const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath = path.join(__dirname, '..', 'data', 'products.json')) {
        this.filePath = filePath;
    }

    async #asegurarArchivo() {
        try {
            await fs.access(this.filePath);
        } catch {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });
            await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
        }
    }

    async #leerTodo() {
        await this.#asegurarArchivo();
        const contenido = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(contenido || '[]');
    }
    async #escribirTodo(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async getAll() {
        return this.#leerTodo();
    }

    async getById(id) {
        const productos = await this.#leerTodo();
        return productos.find(item => String(item.id) === String(id)) || null;
    }

    #generarId() {
        return Date.now().toString();
    }

    async add(datos) {
        const requeridos = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
        for (const campo of requeridos) {
            if (datos[campo] === undefined) throw new Error(`Falta el campo: ${campo}`);
        }

        const productos = await this.#leerTodo();
        if (productos.some(p => p.code === String(datos.code))) {
            throw new Error('El "code" ya existe, debe ser único');
        }

        const nuevo = {
            id: this.#generarId(),
            title: String(datos.title),
            description: String(datos.description),
            code: String(datos.code),
            price: Number(datos.price),
            status: Boolean(datos.status),
            stock: Number(datos.stock),
            category: String(datos.category),
            thumbnails: Array.isArray(datos.thumbnails) ? datos.thumbnails.map(String) : []
        };

        productos.push(nuevo);
        await this.#escribirTodo(productos);
        return nuevo;
    }
    
}

module.exports = ProductManager;

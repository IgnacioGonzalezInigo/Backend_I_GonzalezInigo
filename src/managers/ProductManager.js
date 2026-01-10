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
        return productos.find(item => String(item.id).trim() === String(id).trim()) || null;
    }

    #generarId() {
        return Date.now().toString();
    }

    async add(datos) {
        const requeridos = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'drop'];
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
            drop: Number(datos.drop), // <-- NUEVO
            thumbnails: Array.isArray(datos.thumbnails) ? datos.thumbnails.map(String) : []
        };

        productos.push(nuevo);
        await this.#escribirTodo(productos);
        return nuevo;
    }
    
    async update(id, cambios) {
        const productos = await this.#leerTodo();
        const indice = productos.findIndex(p => String(p.id) === String(id));
        if (indice === -1) throw new Error('Producto no encontrado');

        if ('id' in cambios) delete cambios.id;

        if (cambios.code && productos.some(p => p.code === String(cambios.code) && String(p.id) !== String(id))) {
            throw new Error('El "code" ingresado ya existe en otro producto');
        }

        const actual = productos[indice];
        const actualizado = {
            ...actual,
            ...cambios,
            price: cambios.price !== undefined ? Number(cambios.price) : actual.price,
            status: cambios.status !== undefined ? Boolean(cambios.status) : actual.status,
            stock: cambios.stock !== undefined ? Number(cambios.stock) : actual.stock,
            drop: cambios.drop !== undefined ? Number(cambios.drop) : actual.drop, // <-- NUEVO
            thumbnails: cambios.thumbnails !== undefined
                ? (Array.isArray(cambios.thumbnails) ? cambios.thumbnails.map(String) : actual.thumbnails)
                : actual.thumbnails
        };

        productos[indice] = actualizado;
        await this.#escribirTodo(productos);
        return actualizado;
    }

    async delete(id) {
        const productos = await this.#leerTodo();
        const indice = productos.findIndex(p => String(p.id) === String(id));
        if (indice === -1) throw new Error('Producto no encontrado');
        const [eliminado] = productos.splice(indice, 1);
        await this.#escribirTodo(productos);
        return eliminado;
    }

}

module.exports = ProductManager;

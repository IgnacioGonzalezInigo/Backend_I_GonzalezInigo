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

    // Público
    async getAll() {
        return this.#leerTodo();
    }

    async getById(id) {
        const productos = await this.#leerTodo();
        return productos.find(item => String(item.id) === String(id)) || null;
    }
}

module.exports = ProductManager;

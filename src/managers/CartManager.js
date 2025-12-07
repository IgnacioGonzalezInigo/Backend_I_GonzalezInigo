const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath = path.join(__dirname, '..', 'data', 'carts.json')) {
        this.filePath = filePath;
    }

    async #asegurarArchivo() {
        try { await fs.access(this.filePath); }
        catch {
            await fs.mkdir(path.dirname(this.filePath), { recursive: true });
            await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
        }
    }

    async #leerTodo() {
        await this.#asegurarArchivo();
        const raw = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(raw || '[]');
    }

    async #escribirTodo(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    #generarId() { return Date.now().toString(); }

    async create() {
        const carts = await this.#leerTodo();
        const nuevo = { id: this.#generarId(), products: [] };
        carts.push(nuevo);
        await this.#escribirTodo(carts);
        return nuevo;
    }

    async getById(cid) {
        const carts = await this.#leerTodo();
        return carts.find(c => String(c.id) === String(cid)) || null;
    }
}

module.exports = CartManager;

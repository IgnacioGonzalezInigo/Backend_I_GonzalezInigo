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

    async addProduct(cid, pid, quantity = 1) {
        const carts = await this.#leerTodo();
        const index = carts.findIndex(c => String(c.id) === String(cid));
        if (index === -1) throw new Error('Carrito no encontrado');

        const q = Number(quantity || 1);
        if (!Number.isFinite(q) || q <= 0) throw new Error('La cantidad debe ser mayor a 0');

        const cart = carts[index];
        const existente = cart.products.find(p => String(p.product) === String(pid));

        if (existente) {
            existente.quantity = Number(existente.quantity) + q;
        } else {
            cart.products.push({ product: String(pid), quantity: q });
        }

        carts[index] = cart;
        await this.#escribirTodo(carts);
        return cart;
    }
}

module.exports = CartManager;

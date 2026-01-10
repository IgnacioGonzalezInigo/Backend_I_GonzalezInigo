function money(n) {
    return `$${Number(n || 0)} ARS`;
}

function alertMsg(zone, msg, type = 'danger') {
    zone.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
        ${msg}
        <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function renderEmpty(container) {
    container.innerHTML = `<div class="alert alert-light border mb-0">Tu carrito está vacío.</div>`;
}

// Storage (NO async)
function getCartId() {
    return localStorage.getItem('cid');
}

// API
async function fetchCart(cid) {
    const res = await fetch(`/api/carts/${cid}`);
    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    return data.productos || [];
}

async function fetchAllProducts() {
    const res = await fetch('/api/products');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || data.payload || []);
}

function renderCart(container, items, productsIndex) {
    if (!items.length) {
        renderEmpty(container);
        return;
    }

    const rows = items
        .map((i) => {
        const key = String(i.product).trim(); // id del producto en el carrito
        const p = productsIndex.get(key);     // producto completo
        const title = p?.title ?? `Producto (${key})`;
        const price = Number(p?.price ?? 0);
        const qty = Number(i.quantity ?? 0);
        const subtotal = price * qty;

        return `
            <tr>
            <td>${title}</td>
            <td class="text-end">${qty}</td>
            <td class="text-end">${money(price)}</td>
            <td class="text-end">${money(subtotal)}</td>
            </tr>
        `;
        })
        .join("");

    const total = items.reduce((acc, i) => {
        const key = String(i.product).trim();
        const p = productsIndex.get(key);
        return acc + Number(p?.price ?? 0) * Number(i.quantity ?? 0);
    }, 0);

    container.innerHTML = `
        <div class="table-responsive">
        <table class="table align-middle">
            <thead>
            <tr>
                <th>Producto</th>
                <th class="text-end">Qty</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Subtotal</th>
            </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
            <tr>
                <th colspan="3" class="text-end">Total</th>
                <th class="text-end">${money(total)}</th>
            </tr>
            </tfoot>
        </table>
        </div>
    `;

}

function getProductKey(p) {
  // probamos los campos típicos (ajustable)
    const raw = p?.id ?? p?._id ?? p?.pid ?? p?.code;
    return raw ? String(raw).trim() : null;
}


// Init -- POO II visto en la facultad
async function initCartPage() {

    const container = document.getElementById("cartContainer");
    const alertZone = document.getElementById("cartAlert");

    if (!container) {
        console.error("Falta #cartContainer en la vista cart.handlebars");
        return;
    }

    try {
        const cid = await getCartId();

        if (!cid) {
            renderEmpty(container);
        return;
        }

        
        const [items, allProducts] = await Promise.all([
        fetchCart(cid),
        fetchAllProducts(),
        ]);

    
    const productsIndex = new Map(
        allProducts
            .map(p => [getProductKey(p), p])
            .filter(([k]) => k) 
    );

    renderCart(container, items, productsIndex);
    } catch (err) {
        if (String(err.message).includes("Carrito no encontrado")) {
        localStorage.removeItem("cid");
        }

    alertMsg(alertZone, err.message);
    renderEmpty(container);
    }
}

initCartPage();

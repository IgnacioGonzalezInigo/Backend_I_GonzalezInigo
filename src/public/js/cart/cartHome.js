async function ensureCartId() {
    let cid = localStorage.getItem('cid');

    if (cid) {
        const check = await fetch(`/api/carts/${cid}`);
        const checkData = await check.json();

        if (!checkData?.error) return cid;

        localStorage.removeItem('cid');
        cid = null;
    }

    const res = await fetch('/api/carts', { method: 'POST' });
    const data = await res.json();

    if (!data?.carrito?.id) throw new Error(data?.error || 'No se pudo crear el carrito');

    cid = data.carrito.id;
    localStorage.setItem('cid', cid);
    return cid;
}
async function addToCart(pid, quantity = 1) {
    const cid = await ensureCartId();

    const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    });

    const data = await res.json();
    if (data?.error) throw new Error(data.error);
}

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-add-to-cart');
    if (!btn) return;

    try {
        btn.disabled = true;
        await addToCart(btn.dataset.pid, 1);
        btn.textContent = 'Agregado al carrito';
        setTimeout(() => (btn.textContent = 'Agregar'), 800);
    } catch (err) {
        alert(err.message);
    } finally {
        btn.disabled = false;
    }
});

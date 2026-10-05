// Demo storefront logic — written by Muse
const PRODUCTS = [
  { id: 1, name: "Cotton T-Shirt",  desc: "Soft, breathable everyday tee.",        price: 899,  emoji: "👕" },
  { id: 2, name: "Ceramic Mug",     desc: "350ml mug for your chai breaks.",      price: 549,  emoji: "☕" },
  { id: 3, name: "Canvas Tote Bag", desc: "Carry groceries in style.",            price: 699,  emoji: "👜" },
  { id: 4, name: "LED Desk Lamp",   desc: "Warm light for late-night work.",      price: 1899, emoji: "💡" },
  { id: 5, name: "Notebook Set",    desc: "Three dotted notebooks, A5 size.",      price: 749,  emoji: "📓" },
  { id: 6, name: "Water Bottle",    desc: "1L insulated steel bottle.",            price: 1299, emoji: "🧴" },
];

const fmt = (n) => "Rs " + n.toLocaleString("en-PK");

// --- Cart state (persisted in localStorage) ---
let cart = {};
try {
  cart = JSON.parse(localStorage.getItem("aam-saman-cart") || "{}");
} catch { cart = {}; }

const saveCart = () => localStorage.setItem("aam-saman-cart", JSON.stringify(cart));
const cartQty = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () =>
  Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

// --- Render products ---
const grid = document.getElementById("product-grid");
grid.innerHTML = PRODUCTS.map(
  (p) => `
  <article class="product-card">
    <div class="product-img">${p.emoji}</div>
    <div class="product-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="product-price">${fmt(p.price)}</div>
      <button class="add-btn" data-add="${p.id}">Add to cart</button>
    </div>
  </article>`
).join("");

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const id = btn.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openDrawer();
});

// --- Render cart ---
const itemsEl = document.getElementById("cart-items");
const countEl = document.getElementById("cart-count");
const totalEl = document.getElementById("cart-total");

function renderCart() {
  const entries = Object.entries(cart);
  countEl.textContent = cartQty();
  totalEl.textContent = fmt(cartTotal());

  if (!entries.length) {
    itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.<br>Add something nice 👆</p>`;
    return;
  }
  itemsEl.innerHTML = entries
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === Number(id));
      if (!p) return "";
      return `
      <div class="cart-item">
        <div class="thumb">${p.emoji}</div>
        <div class="info">
          <strong>${p.name}</strong>
          <span>${fmt(p.price)} each</span>
        </div>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Decrease">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Increase">+</button>
        </div>
      </div>`;
    })
    .join("");
}

itemsEl.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) cart[inc.dataset.inc]++;
  if (dec) {
    const id = dec.dataset.dec;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  if (inc || dec) { saveCart(); renderCart(); }
});

// --- Drawer ---
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const openDrawer = () => { drawer.classList.add("open"); overlay.classList.add("show"); };
const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("show"); };

document.getElementById("cart-btn").addEventListener("click", openDrawer);
document.getElementById("cart-close").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// --- Checkout (demo) ---
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!cartQty()) { alert("Your cart is empty — add something first!"); return; }
  const total = fmt(cartTotal());
  alert(`🎉 Demo checkout complete!\n\nOrder total: ${total}\n\n(This is just a demo — no real order was placed.)`);
  cart = {};
  saveCart();
  renderCart();
  closeDrawer();
});

renderCart();

const CART_KEY = "veora-cart";
const WISH_KEY = "veora-wish";
const CODE_KEY = "veora-code";
const ORDERS_KEY = "veora-orders";

const heartSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"/></svg>`;

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getCart() { return read(CART_KEY, []); }
function getWish() { return read(WISH_KEY, []); }
function getOrders() { return read(ORDERS_KEY, []); }
function getCode() { return localStorage.getItem(CODE_KEY) || ""; }

function setOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateBadges();
}
function setWish(ids) {
  localStorage.setItem(WISH_KEY, JSON.stringify(ids));
  updateBadges();
  document.querySelectorAll("[data-wish]").forEach((btn) => {
    const on = ids.includes(btn.dataset.wish);
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateBadges() {
  const cart = cartCount();
  const wish = getWish().length;
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(cart);
  });
  document.querySelectorAll("[data-wish-count]").forEach((el) => {
    el.textContent = String(wish);
    el.hidden = wish === 0;
  });
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function stars(rating) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return `<span class="stars" style="--pct:${pct}%" aria-label="${rating} out of 5 stars"><span class="stars-base">★★★★★</span><span class="stars-fill">★★★★★</span></span>`;
}

function wished(id) {
  return getWish().includes(id);
}

function productCard(product) {
  const badgeClass = product.badge === "New" ? "badge badge-new" : "badge";
  return `
    <article class="product-card">
      <div class="product-media">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${esc(product.name)}">
        </a>
        ${product.badge ? `<span class="${badgeClass}">${esc(product.badge)}</span>` : ""}
        <button class="wish ${wished(product.id) ? "on" : ""}" type="button" data-wish="${product.id}" aria-label="Save ${esc(product.name)}" aria-pressed="${wished(product.id)}">${heartSvg}</button>
      </div>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}">${esc(product.name)}</a></h3>
        <p class="cat">${esc(product.category)}</p>
        <div class="price-row">
          <span>${money(product.price)}</span>
          ${product.compare ? `<s>${money(product.compare)}</s>` : ""}
        </div>
        <div class="rating">${stars(product.rating)} <span>(${product.reviews})</span></div>
        <button class="quick-add" type="button" data-add="${product.id}">Add to cart</button>
      </div>
    </article>`;
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = `${esc(message)} <a href="cart.html">View cart</a>`;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

function addToCart(id, qty = 1, size, color) {
  const product = findProduct(id);
  if (!product) return;
  const pickedSize = size || product.sizes[Math.min(1, product.sizes.length - 1)];
  const pickedColor = color || product.colors[0];
  const cart = getCart();
  const row = cart.find((item) => item.id === id && item.size === pickedSize && item.color === pickedColor);
  if (row) row.qty = Math.min(10, row.qty + qty);
  else cart.push({ id, qty, size: pickedSize, color: pickedColor });
  setCart(cart);
  toast(`${product.name} added`);
}

function toggleWish(id) {
  const ids = getWish();
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  setWish(next);
  const product = findProduct(id);
  if (product && document.body.dataset.page === "wishlist") renderWishlist();
  const saveBtn = document.getElementById("save-product");
  if (saveBtn && saveBtn.dataset.wish === id) {
    saveBtn.textContent = next.includes(id) ? "Saved" : "Save";
  }
}

function sortProducts(list, mode) {
  const copy = [...list];
  if (mode === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (mode === "price-desc") copy.sort((a, b) => b.price - a.price);
  if (mode === "rating") copy.sort((a, b) => b.rating - a.rating);
  return copy;
}

function renderHome() {
  const grid = document.getElementById("best-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter((product) => product.bestseller).map(productCard).join("");
}

function renderCatalog(list, target) {
  const grid = document.getElementById(target);
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>Nothing in this edit yet</h2><p>Try another category or check back when the next drop lands.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(productCard).join("");
}

function currentCat() {
  return new URLSearchParams(location.search).get("cat") || "All";
}

function renderShop() {
  const cat = currentCat();
  const sort = document.getElementById("sort")?.value || "featured";
  let list = PRODUCTS.filter((product) => cat === "All" || product.category === cat);
  list = sortProducts(list, sort);
  renderCatalog(list, "catalog");
  const label = document.getElementById("result-count");
  if (label) label.textContent = `${list.length} ${list.length === 1 ? "style" : "styles"}`;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.filter === cat);
  });
  const title = document.getElementById("shop-title");
  if (title) title.textContent = cat === "All" ? "The Collection" : cat;
}

function renderArrivals() {
  renderCatalog(PRODUCTS.filter((product) => product.isNew), "arrivals");
}

function renderWishlist() {
  const ids = getWish();
  const list = PRODUCTS.filter((product) => ids.includes(product.id));
  const grid = document.getElementById("wish-grid");
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>No saved pieces yet</h2><p>Tap the heart on anything you want to come back to.</p><a class="btn btn-primary" href="shop.html">Browse the shop</a></div>`;
    return;
  }
  grid.innerHTML = list.map(productCard).join("");
}

function renderProduct() {
  const root = document.getElementById("product-root");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const product = findProduct(id);
  if (!product) {
    root.innerHTML = `<div class="empty"><h2>That piece has left the floor</h2><p>It may have sold through. The rest of the collection is still here.</p><a class="btn btn-primary" href="shop.html">Back to shop</a></div>`;
    return;
  }
  document.title = `${product.name} · Véora`;
  const sizeButtons = product.sizes.map((size, index) => `<button type="button" class="size ${index === Math.min(1, product.sizes.length - 1) ? "on" : ""}" data-size="${esc(size)}">${esc(size)}</button>`).join("");
  const colorButtons = product.colors.map((color, index) => `<button type="button" class="swatch ${index === 0 ? "on" : ""}" data-color="${esc(color)}">${esc(color)}</button>`).join("");
  const related = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  root.innerHTML = `
    <div class="product-layout">
      <div class="gallery"><img src="${product.image}" alt="${esc(product.name)}"></div>
      <div class="product-info">
        <p class="product-kicker">${esc(product.category)}</p>
        <h1>${esc(product.name)}</h1>
        <div class="rating">${stars(product.rating)} <span>${product.rating} · ${product.reviews} reviews</span></div>
        <div class="product-price"><span>${money(product.price)}</span>${product.compare ? `<s>${money(product.compare)}</s>` : ""}</div>
        <p class="desc">${esc(product.description)}</p>
        <p class="option-label">Color · <span id="color-label">${esc(product.colors[0])}</span></p>
        <div class="swatches" id="colors">${colorButtons}</div>
        <p class="option-label">Size</p>
        <div class="sizes" id="sizes">${sizeButtons}</div>
        <div class="buy-row">
          <div class="qty">
            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
            <span id="qty-value">1</span>
            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary" type="button" id="add-product">Add to cart</button>
          <button class="btn btn-ghost" type="button" id="save-product" data-wish="${product.id}">${wished(product.id) ? "Saved" : "Save"}</button>
        </div>
        <div class="assurance">
          <span>Free shipping worldwide</span>
          <span>Secure checkout</span>
          <span>Easy returns & exchanges</span>
          <span>24/7 customer support</span>
        </div>
      </div>
    </div>
    <section class="section related">
      <div class="section-head"><h2>You may also like</h2><a class="link-arrow" href="shop.html?cat=${encodeURIComponent(product.category)}">View ${esc(product.category)} →</a></div>
      <div class="product-grid">${related.map(productCard).join("")}</div>
    </section>`;

  let qty = 1;
  const qtyEl = document.getElementById("qty-value");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyEl.textContent = String(qty);
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyEl.textContent = String(qty);
  });
  root.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-size]").forEach((item) => item.classList.remove("on"));
      btn.classList.add("on");
    });
  });
  root.querySelectorAll("[data-color]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-color]").forEach((item) => item.classList.remove("on"));
      btn.classList.add("on");
      document.getElementById("color-label").textContent = btn.dataset.color;
    });
  });
  document.getElementById("add-product").addEventListener("click", () => {
    const size = root.querySelector("[data-size].on")?.dataset.size;
    const color = root.querySelector("[data-color].on")?.dataset.color;
    addToCart(product.id, qty, size, color);
  });
  document.getElementById("save-product").addEventListener("click", () => toggleWish(product.id));
}

function lineTotal(item) {
  const product = findProduct(item.id);
  return product ? product.price * item.qty : 0;
}

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderOrders() {
  const root = document.getElementById("orders-root");
  if (!root) return;
  const orders = getOrders();
  if (!orders.length) {
    root.innerHTML = `<div class="empty"><h2>No orders yet</h2><p>Orders you place will show up here, with the details kept in this browser.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>`;
    return;
  }
  root.innerHTML = orders.map((order) => `
    <article class="panel" style="margin-bottom:18px">
      <div class="order-head">
        <div>
          <h2 style="font-size:20px;letter-spacing:-0.02em">Order ${esc(order.orderNo)}</h2>
          <p class="muted">Placed ${esc(formatDate(order.date))}</p>
        </div>
        <strong class="order-total">${money(order.total)}</strong>
      </div>
      <div class="order-lines">
        ${order.items.map((item) => `
          <div class="cart-row">
            <img src="${item.image}" alt="">
            <div>
              <h3>${esc(item.name)}</h3>
              <p class="muted">${esc(item.color)} · Size ${esc(item.size)} · Qty ${item.qty}</p>
            </div>
            <strong class="line-price">${money(item.price * item.qty)}</strong>
          </div>`).join("")}
      </div>
      <div class="summary-line"><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
      ${order.discount ? `<div class="summary-line"><span>Discount</span><span>−${money(order.discount)}</span></div>` : ""}
      <div class="summary-line"><span>Shipping</span><span>Free</span></div>
      <div class="total-line"><span>Total</span><span>${money(order.total)}</span></div>
      <div class="order-meta">
        <p class="muted"><strong>Ship to</strong> ${esc(order.name)} · ${esc(order.address)}</p>
        <p class="muted"><strong>Email</strong> ${esc(order.email)}</p>
      </div>
    </article>`).join("");
}

function renderCart() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  const cart = getCart().filter((item) => findProduct(item.id));
  if (cart.length !== getCart().length) setCart(cart);
  if (!cart.length) {
    root.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>The best sellers are a good place to start.</p><a class="btn btn-primary" href="shop.html">Shop now</a></div>`;
    return;
  }
  const sub = cart.reduce((sum, item) => sum + lineTotal(item), 0);
  const code = getCode();
  const valid = code.toUpperCase() === "VEORA10";
  const discount = valid ? sub * 0.1 : 0;
  const total = sub - discount;
  root.innerHTML = `
    <div class="cart-layout">
      <div class="panel" id="cart-lines">
        ${cart.map((item, index) => {
          const product = findProduct(item.id);
          return `<article class="cart-row">
            <a href="product.html?id=${product.id}"><img src="${product.image}" alt=""></a>
            <div>
              <h3><a href="product.html?id=${product.id}">${esc(product.name)}</a></h3>
              <p class="muted">${esc(item.color)} · Size ${esc(item.size)}</p>
              <div class="qty" style="margin-top:8px">
                <button type="button" data-delta="-1" data-index="${index}" aria-label="Decrease">−</button>
                <span>${item.qty}</span>
                <button type="button" data-delta="1" data-index="${index}" aria-label="Increase">+</button>
              </div>
              <button class="remove" type="button" data-remove="${index}">Remove</button>
            </div>
            <strong class="line-price">${money(product.price * item.qty)}</strong>
          </article>`;
        }).join("")}
      </div>
      <aside class="panel">
        <h2 style="font-size:22px;letter-spacing:-0.03em">Order summary</h2>
        <div class="promo-row">
          <input id="promo-input" placeholder="Promo code" value="${esc(code)}" aria-label="Promo code">
          <button class="btn btn-ghost" type="button" id="apply-code">Apply</button>
        </div>
        <p class="fine" id="code-msg">${valid ? "VEORA10 applied · 10% off" : "Try VEORA10 for 10% off this demo order."}</p>
        <div class="summary-line"><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="summary-line"><span>Discount</span><span>−${money(discount)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>Free</span></div>
        <div class="total-line"><span>Total</span><span>${money(total)}</span></div>
        <form id="checkout" style="margin-top:16px">
          <div class="field"><label for="co-name">Full name</label><input id="co-name" required autocomplete="name"></div>
          <div class="field"><label for="co-email">Email</label><input id="co-email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="co-address">Shipping address</label><input id="co-address" required autocomplete="street-address"></div>
          <button class="btn btn-primary" type="submit" style="width:100%">Place order</button>
          <p class="fine" style="margin-top:8px">Demo checkout only. No payment is taken and nothing is shipped.</p>
        </form>
      </aside>
    </div>`;

  root.querySelectorAll("[data-delta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = getCart();
      const index = Number(btn.dataset.index);
      next[index].qty = Math.min(10, Math.max(1, next[index].qty + Number(btn.dataset.delta)));
      setCart(next);
      renderCart();
    });
  });
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = getCart();
      next.splice(Number(btn.dataset.remove), 1);
      setCart(next);
      renderCart();
    });
  });
  document.getElementById("apply-code").addEventListener("click", () => {
    const value = document.getElementById("promo-input").value.trim();
    if (value.toUpperCase() === "VEORA10") {
      localStorage.setItem(CODE_KEY, "VEORA10");
    } else {
      localStorage.removeItem(CODE_KEY);
      document.getElementById("code-msg").textContent = "That code is not active. VEORA10 still is.";
      return;
    }
    renderCart();
  });
  document.getElementById("checkout").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("co-name").value.trim();
    const email = document.getElementById("co-email").value.trim();
    const address = document.getElementById("co-address").value.trim();
    const orderNo = `VR-${Date.now().toString().slice(-6)}`;
    const items = cart.map((item) => {
      const product = findProduct(item.id);
      return {
        id: item.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
        size: item.size,
        color: item.color
      };
    });
    setOrders([{
      orderNo,
      date: new Date().toISOString(),
      name,
      email,
      address,
      items,
      subtotal: sub,
      discount,
      total
    }, ...getOrders()]);
    setCart([]);
    localStorage.removeItem(CODE_KEY);
    root.innerHTML = `<div class="empty"><div class="success-box" style="text-align:left;max-width:460px;margin:0 auto 16px"><h2>Order confirmed</h2><p class="muted">Thanks ${esc(name)}. Your demo order <strong>${orderNo}</strong> is in. Nothing was charged.</p></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="orders.html">View order details</a><a class="btn btn-ghost" href="shop.html">Keep browsing</a></div></div>`;
    updateBadges();
  });
}

const LOOKS = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
    title: "Weekend lilac",
    text: "Oversized hoodie, classic cap, court sneaker. Easy volume, one strong color."
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
    title: "City tailoring",
    text: "The lilac bomber over a clean tee, finished with oval sunglasses."
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80",
    title: "After hours",
    text: "Pleated midi, graphic tee, and the city tote for everything that does not fit in a pocket."
  }
];

function bindLookbook() {
  const open = document.getElementById("watch-open");
  const modal = document.getElementById("lookbook");
  if (!open || !modal) return;
  let index = 0;
  const show = () => {
    const look = LOOKS[index];
    modal.querySelector("img").src = look.image;
    modal.querySelector("img").alt = look.title;
    modal.querySelector("h3").textContent = look.title;
    modal.querySelector("p").textContent = look.text;
  };
  open.addEventListener("click", () => {
    index = 0;
    show();
    modal.hidden = false;
  });
  modal.querySelector(".modal-close").addEventListener("click", () => { modal.hidden = true; });
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.hidden = true; });
  modal.querySelector("[data-look='prev']").addEventListener("click", () => {
    index = (index + LOOKS.length - 1) % LOOKS.length;
    show();
  });
  modal.querySelector("[data-look='next']").addEventListener("click", () => {
    index = (index + 1) % LOOKS.length;
    show();
  });
}

function bindChrome() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const searchOpen = document.getElementById("search-open");
  const panel = document.getElementById("search-panel");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (searchOpen && panel && input && results) {
    const paint = () => {
      const q = input.value.trim().toLowerCase();
      const hits = !q ? PRODUCTS.slice(0, 4) : PRODUCTS.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(q)).slice(0, 6);
      results.innerHTML = hits.length
        ? hits.map((product) => `<a class="search-hit" href="product.html?id=${product.id}"><img src="${product.image}" alt=""><span><strong>${esc(product.name)}</strong><span>${esc(product.category)} · ${money(product.price)}</span></span></a>`).join("")
        : `<p class="search-empty">No matches for “${esc(input.value.trim())}”.</p>`;
    };
    searchOpen.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        paint();
        input.focus();
      }
    });
    input.addEventListener("input", paint);
  }

  const accountBtn = document.getElementById("account-open");
  const accountMenu = document.getElementById("account-menu");
  if (accountBtn && accountMenu) {
    accountBtn.addEventListener("click", () => {
      accountMenu.hidden = !accountMenu.hidden;
    });
  }

  document.addEventListener("click", (event) => {
    if (panel && !panel.hidden && !panel.contains(event.target) && event.target !== searchOpen && !searchOpen.contains(event.target)) {
      panel.hidden = true;
    }
    if (accountMenu && !accountMenu.hidden && !accountMenu.contains(event.target) && event.target !== accountBtn && !accountBtn.contains(event.target)) {
      accountMenu.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (panel) panel.hidden = true;
      if (accountMenu) accountMenu.hidden = true;
      const look = document.getElementById("lookbook");
      if (look) look.hidden = true;
      if (nav) nav.classList.remove("open");
    }
  });

  document.body.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    const wish = event.target.closest("[data-wish]");
    if (add && add.id !== "save-product") {
      event.preventDefault();
      addToCart(add.dataset.add);
    } else if (wish && wish.id !== "save-product") {
      event.preventDefault();
      toggleWish(wish.dataset.wish);
    }
  });

  const news = document.getElementById("newsletter");
  if (news) {
    news.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = new FormData(news).get("email");
      const note = document.getElementById("news-note");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
        note.textContent = "Enter a valid email to join the list.";
        return;
      }
      note.textContent = "You are on the list. Watch for the next drop.";
      news.reset();
    });
  }

  const contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contact);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const note = document.getElementById("contact-note");
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 8) {
        note.textContent = "Add your name, a real email, and a short message.";
        return;
      }
      contact.hidden = true;
      document.getElementById("contact-success").hidden = false;
    });
  }

  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      const mark = btn.querySelector("span");
      if (mark) mark.textContent = open ? "+" : "−";
      const answer = btn.nextElementSibling;
      if (answer) answer.hidden = open;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindChrome();
  bindLookbook();
  updateBadges();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "shop") {
    renderShop();
    document.getElementById("sort")?.addEventListener("change", renderShop);
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.filter;
        const url = cat === "All" ? "shop.html" : `shop.html?cat=${encodeURIComponent(cat)}`;
        history.pushState({}, "", url);
        renderShop();
      });
    });
    window.addEventListener("popstate", renderShop);
  }
  if (page === "arrivals") renderArrivals();
  if (page === "product") renderProduct();
  if (page === "cart") renderCart();
  if (page === "wishlist") renderWishlist();
  if (page === "orders") renderOrders();
});

// SpareShop Main JS
// Handles menu, tabs, catalog, cart, contact, and accessibility

// ========== Hamburger Menu ========== //
const navToggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  nav.classList.toggle('nav--open');
  document.body.classList.toggle('no-scroll', !expanded);
});

// Close menu on nav link click (mobile)
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
});

// ========== Tab Switching ========== //
const tabs = document.querySelectorAll('.tab');
const navLinks = document.querySelectorAll('.nav__link');

function showTab(tabId) {
  tabs.forEach(tab => {
    if (tab.id === tabId) {
      tab.classList.add('tab--active');
      tab.removeAttribute('hidden');
      tab.focus();
    } else {
      tab.classList.remove('tab--active');
      tab.setAttribute('hidden', '');
    }
  });
  navLinks.forEach(link => {
    if (link.getAttribute('href') === `#${tabId}`) {
      link.classList.add('nav__link--active');
    } else {
      link.classList.remove('nav__link--active');
    }
  });
}

// Handle hash change (for deep linking)
window.addEventListener('hashchange', () => {
  const tabId = location.hash.replace('#', '') || 'home';
  showTab(tabId);
});
// Initial tab
showTab(location.hash.replace('#', '') || 'home');

// ========== Catalog Data & Rendering (from API) ========== //
let PARTS = [];
const catalogGrid = document.getElementById('catalog-grid');
const catalogError = document.getElementById('catalog-error');

async function fetchParts() {
  try {
    catalogError.hidden = true;
    const res = await fetch('/api/parts');
    if (!res.ok) throw new Error('Failed to fetch parts');
    PARTS = await res.json();
    renderCatalog(PARTS);
  } catch (e) {
    catalogError.textContent = 'Error loading parts catalog.';
    catalogError.hidden = false;
    PARTS = [];
    renderCatalog([]);
  }
}

function renderCatalog(parts) {
  catalogGrid.innerHTML = '';
  if (!parts.length) {
    catalogError.textContent = 'No parts found for your criteria.';
    catalogError.hidden = false;
            return;
        }
  catalogError.hidden = true;
        parts.forEach(part => {
    const card = document.createElement('div');
    card.className = 'part-card';
    card.innerHTML = `
      <img src="${part.img}" alt="${part.name}" onerror="this.src='assets/images/vehicles/fallback.jpg'">
      <div class="part-card__name">${part.name}</div>
      <div class="part-card__desc">${part.desc}</div>
      <div class="part-card__price">$${Number(part.price).toFixed(2)}</div>
      <button class="btn btn--primary part-card__add" data-id="${part.id}"><i class="fa fa-cart-plus"></i> Add to Cart</button>
    `;
    catalogGrid.appendChild(card);
  });
}

// ========== Catalog Filters ========== //
function filterCatalog() {
  try {
    const model = document.getElementById('filter-model').value;
    const year = document.getElementById('filter-year').value;
    const search = document.getElementById('filter-search').value.trim().toLowerCase();
    let filtered = PARTS.filter(part => {
      let match = true;
      if (model && part.model !== model) match = false;
      if (year && part.year != year) match = false;
      if (search && !(`${part.name} ${part.desc}`.toLowerCase().includes(search) || String(part.id).includes(search))) match = false;
      return match;
    });
    renderCatalog(filtered);
  } catch (e) {
    catalogError.textContent = 'Error filtering parts.';
    catalogError.hidden = false;
  }
}

document.getElementById('filter-model').addEventListener('change', filterCatalog);
document.getElementById('filter-year').addEventListener('input', filterCatalog);
document.getElementById('filter-search').addEventListener('input', filterCatalog);

// Fetch parts from backend on load
fetchParts();

// ========== Cart Logic ========== //
const CART_KEY = 'spareCart';
const CART_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Load cart and check expiry
let cartData = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
if (cartData.createdAt && Date.now() - cartData.createdAt > CART_EXPIRY) {
  localStorage.removeItem(CART_KEY);
  cartData = { items: [], createdAt: Date.now() };
}
if (!cartData.items) cartData = { items: [], createdAt: Date.now() };
let cart = cartData.items;

const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartError = document.getElementById('cart-error');

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => {
    const part = PARTS.find(p => String(p.id) === String(item.id));
    return sum + (part ? Number(part.price) * item.qty : 0);
  }, 0);
  cartTotal.textContent = total.toFixed(2);
}

function saveCart() {
  if (!cart.length) {
    localStorage.removeItem(CART_KEY);
  } else {
    let createdAt = cartData.createdAt || Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify({ items: cart, createdAt }));
    cartData = { items: cart, createdAt };
  }
}

function renderCart() {
        cartItems.innerHTML = '';
  if (!cart.length) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('checkout-btn').disabled = true;
            return;
        }
  document.getElementById('checkout-btn').disabled = false;
        cart.forEach(item => {
    const part = PARTS.find(p => String(p.id) === String(item.id));
    if (!part) return;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${part.img}" alt="${part.name}" onerror="this.src='assets/images/vehicles/fallback.jpg'">
      <div class="cart-item__info">
        <div class="cart-item__name">${part.name}</div>
        <div class="cart-item__desc">${part.desc}</div>
        <div class="cart-item__price">$${Number(part.price).toFixed(2)}</div>
      </div>
      <button class="btn btn--secondary cart-item__qty-btn" data-id="${item.id}" data-action="dec">-</button>
      <span class="cart-item__qty">${item.qty}</span>
      <button class="btn btn--secondary cart-item__qty-btn" data-id="${item.id}" data-action="inc">+</button>
      <button class="btn btn--primary cart-item__remove" data-id="${item.id}"><i class="fa fa-trash"></i></button>
    `;
    cartItems.appendChild(div);
  });
}

function addToCart(id) {
  try {
    const idx = cart.findIndex(item => String(item.id) === String(id));
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    saveCart();
    updateCartCount();
    updateCartTotal();
    renderCart();
  } catch (e) {
    cartError.textContent = 'Error adding to cart.';
    cartError.hidden = false;
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => String(item.id) !== String(id));
  saveCart();
  updateCartCount();
  updateCartTotal();
                renderCart();
            }

function changeCartQty(id, action) {
  const idx = cart.findIndex(item => String(item.id) === String(id));
  if (idx > -1) {
    if (action === 'inc') cart[idx].qty += 1;
    if (action === 'dec') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    saveCart();
    updateCartCount();
    updateCartTotal();
    renderCart();
  }
}

// Catalog add-to-cart
catalogGrid.addEventListener('click', e => {
  if (e.target.closest('.part-card__add')) {
    const id = e.target.closest('.part-card__add').dataset.id;
    addToCart(id);
  }
});

// Cart item actions
cartItems.addEventListener('click', e => {
  if (e.target.closest('.cart-item__remove')) {
    const id = e.target.closest('.cart-item__remove').dataset.id;
    removeFromCart(id);
  }
  if (e.target.closest('.cart-item__qty-btn')) {
    const btn = e.target.closest('.cart-item__qty-btn');
    changeCartQty(btn.dataset.id, btn.dataset.action);
  }
});

// Initial cart render
updateCartCount();
updateCartTotal();
        renderCart();

// ========== Contact Form ========== //
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactError = document.getElementById('contact-error');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    contactSuccess.hidden = true;
    contactError.hidden = true;
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    if (!name || !email || !message) {
      contactError.textContent = 'Please fill in all fields.';
      contactError.hidden = false;
      return;
    }
    // Simple email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      contactError.textContent = 'Please enter a valid email address.';
      contactError.hidden = false;
      return;
    }
    // Simulate success (TODO: integrate with backend/email API)
    contactSuccess.hidden = false;
    contactForm.reset();
  });
}

// ========== Accessibility & Error Handling ========== //
// Trap focus in nav when open (for accessibility)
document.addEventListener('keydown', e => {
  if (nav.classList.contains('nav--open') && e.key === 'Tab') {
    const focusable = nav.querySelectorAll('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
});

// ========== TODOs for Future Features ========== //
// - Add reviews, wishlist, user login
// - Integrate payment gateway for checkout
// - Advanced search (exploded views, 3D models)
// - SEO enhancements

// ========== ADMIN SCRIPT: DELETE ALL USERS ========== //
if (require.main === module && process.argv.includes('--delete-all-users')) {
  (async () => {
    try {
      const db = require('./models');
      await db.sequelize.authenticate();
      const count = await db.User.destroy({ where: {}, truncate: true });
      console.log(`All users deleted. Rows affected: ${count}`);
      process.exit(0);
    } catch (err) {
      console.error('Error deleting users:', err);
      process.exit(1);
    }
  })();
}
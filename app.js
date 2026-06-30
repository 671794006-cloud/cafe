// App State
const state = {
  user: null, // Employee
  currentView: 'login', // login, pos, dashboard
  cart: [],
  customer: null, // { phone, points, id }
  products: [],
  categoryFilter: 'all', // all, coffee, bakery
};

// --- MOCK DATA ---
// To be replaced with Supabase calls once connected
const mockProducts = [
  { id: 1, name: 'Espresso', price: 60, category: 'coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80' },
  { id: 2, name: 'Latte Art', price: 85, category: 'coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80' },
  { id: 3, name: 'Cappuccino', price: 80, category: 'coffee', image: 'https://images.unsplash.com/photo-1534687941688-1a673b0632cd?w=500&q=80' },
  { id: 4, name: 'Cold Brew', price: 90, category: 'coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80' },
  { id: 5, name: 'Mocha', price: 95, category: 'coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80' },
  { id: 6, name: 'Butter Croissant', price: 65, category: 'bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80' },
  { id: 7, name: 'Chocolate Muffin', price: 55, category: 'bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80' },
  { id: 8, name: 'Cheesecake', price: 120, category: 'bakery', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' }
];

const mockCustomers = [
  { id: 1, phone: '0812345678', points: 45 },
  { id: 2, phone: '0899999999', points: 120 }
];

const mockOrders = [
  { id: 'ORD-1001', time: '10:30 AM', total: 145, items: 2, status: 'Completed' },
  { id: 'ORD-1002', time: '10:45 AM', total: 85, items: 1, status: 'Completed' },
  { id: 'ORD-1003', time: '11:10 AM', total: 260, items: 4, status: 'Completed' },
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lucide icons
  lucide.createIcons();
  
  // Load mock data
  state.products = mockProducts;
  
  // Render initial view
  renderApp();
});

// --- CORE RENDERING ---
function renderApp() {
  const appEl = document.getElementById('app');
  appEl.innerHTML = '';
  
  if (state.currentView === 'login') {
    appEl.innerHTML = getLoginTemplate();
    bindLoginEvents();
  } else {
    appEl.innerHTML = getMainLayoutTemplate();
    bindLayoutEvents();
    
    const contentEl = document.getElementById('main-content');
    if (state.currentView === 'pos') {
      contentEl.innerHTML = getPosTemplate();
      bindPosEvents();
      renderProducts();
      renderCart();
    } else if (state.currentView === 'dashboard') {
      contentEl.innerHTML = getDashboardTemplate();
    }
  }
  
  lucide.createIcons();
}

function showLoading(show) {
  const overlay = document.getElementById('loading-overlay');
  if (show) overlay.classList.remove('hidden');
  else overlay.classList.add('hidden');
}

// --- TEMPLATES ---

function getLoginTemplate() {
  return `
    <div class="login-view">
      <div class="login-card glass-panel">
        <h1>Lumina Coffee</h1>
        <p>Staff Point of Sale System</p>
        
        <form id="login-form" class="login-form">
          <input type="email" id="email" class="input-field" placeholder="Email (e.g. staff@lumina.com)" required>
          <input type="password" id="password" class="input-field" placeholder="Password (any)" required>
          <div id="login-error" class="login-error hidden">Invalid credentials</div>
          <button type="submit" class="btn-primary">
            <i data-lucide="log-in"></i> Sign In
          </button>
        </form>
      </div>
    </div>
  `;
}

function getMainLayoutTemplate() {
  return `
    <div class="main-layout">
      <aside class="sidebar">
        <div class="brand">
          <h2 class="serif">LUMINA</h2>
        </div>
        
        <nav class="nav-menu">
          <div class="nav-item ${state.currentView === 'pos' ? 'active' : ''}" data-view="pos">
            <i data-lucide="monitor"></i>
            <span>POS Terminal</span>
          </div>
          <div class="nav-item ${state.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
            <i data-lucide="layout-dashboard"></i>
            <span>Dashboard</span>
          </div>
        </nav>
        
        <div class="user-profile">
          <div class="user-info">
            <div class="user-avatar">${state.user ? state.user.email.charAt(0).toUpperCase() : 'U'}</div>
            <div class="user-details">
              <div style="font-size: 0.9rem; font-weight: 500;">${state.user ? state.user.email.split('@')[0] : 'Staff'}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary)">Cashier</div>
            </div>
          </div>
          <button id="logout-btn" class="logout-btn" title="Logout">
            <i data-lucide="log-out"></i>
          </button>
        </div>
      </aside>
      
      <main id="main-content" class="content-area">
        <!-- Content injected here -->
      </main>
    </div>
  `;
}

function getPosTemplate() {
  return `
    <div class="pos-view">
      <div class="products-area">
        <div class="pos-header">
          <h2 class="serif">Menu</h2>
          <div class="category-filters">
            <button class="cat-btn ${state.categoryFilter === 'all' ? 'active' : ''}" data-cat="all">All</button>
            <button class="cat-btn ${state.categoryFilter === 'coffee' ? 'active' : ''}" data-cat="coffee">Coffee</button>
            <button class="cat-btn ${state.categoryFilter === 'bakery' ? 'active' : ''}" data-cat="bakery">Bakery</button>
          </div>
        </div>
        <div id="products-grid" class="products-grid">
          <!-- Products injected here -->
        </div>
      </div>
      
      <div class="cart-area">
        <div class="cart-header">
          <h3>Current Order</h3>
        </div>
        
        <div class="cart-items" id="cart-items">
          <!-- Cart items injected here -->
        </div>
        
        <div class="cart-summary">
          <div class="customer-section">
            <div class="customer-input-group">
              <input type="text" id="customer-phone" placeholder="Customer Phone (for points)">
              <button id="check-customer-btn" class="btn-outline">Check</button>
            </div>
            <div id="customer-info-render"></div>
          </div>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span id="cart-subtotal">฿0.00</span>
          </div>
          <div class="summary-row">
            <span>Tax (7%)</span>
            <span id="cart-tax">฿0.00</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span id="cart-total">฿0.00</span>
          </div>
          
          <button id="checkout-btn" class="btn-primary checkout-btn" style="margin-top: 1rem;" disabled>
            Charge ฿0.00
          </button>
        </div>
      </div>
    </div>
  `;
}

function getDashboardTemplate() {
  const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
  
  return `
    <div class="dashboard-view">
      <div class="dash-header">
        <h2 class="serif">Today's Overview</h2>
        <p style="color: var(--text-secondary)">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div class="dash-stats">
        <div class="stat-card">
          <div class="stat-icon"><i data-lucide="trending-up"></i></div>
          <div class="stat-details">
            <h4>Total Sales</h4>
            <div class="value">฿${totalSales.toFixed(2)}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i data-lucide="shopping-bag"></i></div>
          <div class="stat-details">
            <h4>Orders</h4>
            <div class="value">${mockOrders.length}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i data-lucide="users"></i></div>
          <div class="stat-details">
            <h4>Points Awarded</h4>
            <div class="value">+${Math.floor(totalSales/50)}</div>
          </div>
        </div>
      </div>
      
      <div class="recent-orders">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Time</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${mockOrders.map(order => `
              <tr>
                <td>${order.id}</td>
                <td>${order.time}</td>
                <td>${order.items}</td>
                <td>฿${order.total.toFixed(2)}</td>
                <td><span class="status-badge">${order.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


// --- EVENT BINDERS ---

function bindLoginEvents() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    // Mock login
    showLoading(true);
    setTimeout(() => {
      showLoading(false);
      state.user = { email, id: 'user_123' };
      state.currentView = 'pos';
      renderApp();
    }, 800);
  });
}

function bindLayoutEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view && state.currentView !== view) {
        state.currentView = view;
        renderApp();
      }
    });
  });
  
  document.getElementById('logout-btn').addEventListener('click', () => {
    state.user = null;
    state.cart = [];
    state.customer = null;
    state.currentView = 'login';
    renderApp();
  });
}

function bindPosEvents() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.categoryFilter = e.target.dataset.cat;
      renderApp(); // Re-render to update active state and products
    });
  });
  
  const checkCustomerBtn = document.getElementById('check-customer-btn');
  if (checkCustomerBtn) {
    checkCustomerBtn.addEventListener('click', () => {
      const phone = document.getElementById('customer-phone').value;
      if (!phone) return;
      
      const found = mockCustomers.find(c => c.phone === phone);
      if (found) {
        state.customer = found;
      } else {
        // New customer mock
        state.customer = { phone, points: 0, id: Date.now() };
        mockCustomers.push(state.customer);
      }
      renderCustomerInfo();
    });
  }
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

// --- LOGIC & DOM UPDATES ---

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  let filtered = state.products;
  if (state.categoryFilter !== 'all') {
    filtered = state.products.filter(p => p.category === state.categoryFilter);
  }
  
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="addToCart(${p.id})">
      <div class="product-img-wrapper">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">฿${p.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

window.addToCart = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  
  renderCart();
};

window.updateQty = (productId, change) => {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  
  item.qty += change;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== productId);
  }
  
  renderCart();
};

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!cartItemsEl) return;
  
  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        <i data-lucide="shopping-cart" style="width: 48px; height: 48px; opacity: 0.5;"></i>
        <p>Cart is empty</p>
      </div>
    `;
    lucide.createIcons();
    updateSummary(0);
    return;
  }
  
  cartItemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">฿${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  updateSummary(subtotal);
}

function updateSummary(subtotal) {
  const tax = subtotal * 0.07;
  const total = subtotal + tax;
  
  document.getElementById('cart-subtotal').textContent = `฿${subtotal.toFixed(2)}`;
  document.getElementById('cart-tax').textContent = `฿${tax.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `฿${total.toFixed(2)}`;
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    if (total > 0) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = `Charge ฿${total.toFixed(2)}`;
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = `Charge ฿0.00`;
    }
  }
}

function renderCustomerInfo() {
  const container = document.getElementById('customer-info-render');
  if (!container || !state.customer) {
    if (container) container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="customer-info-box">
      <div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Linked Account</div>
        <div style="font-weight: 500;">${state.customer.phone}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Points</div>
        <div class="customer-points">${state.customer.points}</div>
      </div>
    </div>
  `;
}

function handleCheckout() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal * 1.07;
  const itemsCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  
  showLoading(true);
  
  // Simulate API Call to create order and add points
  setTimeout(() => {
    // 1 point per 50 baht
    const pointsEarned = Math.floor(total / 50);
    
    if (state.customer) {
      state.customer.points += pointsEarned;
    }
    
    // Add to mock orders
    mockOrders.unshift({
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total,
      items: itemsCount,
      status: 'Completed'
    });
    
    // Reset Cart
    state.cart = [];
    state.customer = null;
    document.getElementById('customer-phone').value = '';
    
    showLoading(false);
    renderApp(); // Re-render POS to clear state
    alert(`Payment Successful!\nTotal: ฿${total.toFixed(2)}\nPoints Earned: ${pointsEarned}`);
  }, 1000);
}

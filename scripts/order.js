let parts = [];

// Load data and render sections
fetch('./scripts/category.json')
  .then(res => res.json())
  .then(data => {
    parts = data;
    renderSections();
});

// Generates the product layout based on JSON data
function renderSections() {
  const container = document.getElementById('productSections');

  parts.forEach(category => {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${category.category}</h2>`;

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    category.items.forEach(item => {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image"/>
        <label>${item.name}: 
          <input type="number" min="0" value="0" data-price="${item.price}" name="${item.name}" />
        </label>
      `;

      // Auto-update summary on input change
      const input = gridItem.querySelector('input');
      input.addEventListener('input', updateSummary);

      gridContainer.appendChild(gridItem);
    });

    section.appendChild(gridContainer);
    container.appendChild(section);
  });
}

// Update summary table with selected items and total price
function updateSummary() {
  const inputs = document.querySelectorAll('input[type=number]');
  const tbody = document.querySelector('#summaryTable tbody');
  tbody.innerHTML = '';
  let total = 0;

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      const price = parseFloat(input.dataset.price);
      const row = document.createElement('tr');
      row.innerHTML = `<td>${input.name}</td><td>${qty}</td><td>$${(qty * price).toFixed(2)}</td>`;
      tbody.appendChild(row);
      total += qty * price;
    }
  });

  document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

// Get selected items for summary/order
function getOrderData() {
  const inputs = document.querySelectorAll('input[type=number]');
  let items = [];

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      items.push({
        name: input.name,
        quantity: qty,
        price: parseFloat(input.dataset.price)
      });
    }
  });

  return items;
}

// Save order and go to checkout
function buyNow() {
  updateSummary();
  const orderData = getOrderData();
  localStorage.setItem('currentOrder', JSON.stringify(orderData));
  window.location.href = 'checkout.html';
}

// Save as favorite
function saveFavourite() {
  const fav = getOrderData();
  localStorage.setItem('favouriteOrder', JSON.stringify(fav));
  alert('Order saved as favourite!');
}

// Load favorite into form
function applyFavourite() {
  const fav = JSON.parse(localStorage.getItem('favouriteOrder') || '[]');
  const inputs = document.querySelectorAll('input[type=number]');
  inputs.forEach(input => input.value = 0);
  fav.forEach(item => {
    const input = document.querySelector(`input[name="${item.name}"]`);
    if (input) input.value = item.quantity;
  });
  updateSummary();
}

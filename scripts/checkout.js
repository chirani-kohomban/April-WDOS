// Fetching order details from localStorage
const order = JSON.parse(localStorage.getItem('currentOrder') || '[]');
const summaryDiv = document.getElementById('orderSummary');
let total = 0;
let html = '<h3>Your Order:</h3><ul>';

console.log(order);  // Log the order to make sure it's being fetched

// Populate the order summary
order.forEach(item => {
  html += `<li>${item.quantity} x ${item.name} - $${(item.quantity * item.price).toFixed(2)}</li>`;
  total += item.quantity * item.price;
});

html += `</ul><strong>Total: $${total.toFixed(2)}</strong>`;
summaryDiv.innerHTML = html;

// prints the data to the console
function submitOrder() {
  const form = document.getElementById('checkoutForm');
  
  // Check if all fields are filled correctly
  if (!form.checkValidity()) {
    alert('Please fill in all fields correctly.');
    return;
  }

  // Calculate delivery date (a week from the ordered day)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  // success message
  alert(`Thank you for your purchase! Your items will arrive by ${deliveryDate.toDateString()}.`);
}

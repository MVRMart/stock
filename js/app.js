/* =========================
   SERVICEABLE PINCODES
========================= */
const serviceableAreas = {
  "500086": ["Manikonda", "Puppalguda"],
  "500089": ["Narsingi"],
  "500075": ["Gachibowli"],
  "500090": ["Kondapur"],
  "500072": ["Kukatpally"]
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   PINCODE CHECK
========================= */
function checkPincode() {
  const pincode = document.getElementById("pincode").value.trim();
  const result = document.getElementById("pincodeResult");

  if (serviceableAreas[pincode]) {
    result.innerHTML =
      `✅ We serve: ${serviceableAreas[pincode].join(", ")}`;
    result.style.color = "green";

    document.getElementById("cartSection").style.display = "block";
    calculateTotal();
  } else {
    result.innerHTML = "❌ Delivery not available for this pincode";
    result.style.color = "red";

    document.getElementById("cartSection").style.display = "none";
  }
}

/* Reset access if pincode changes */
function resetAccess() {
  document.getElementById("cartSection").style.display = "none";
  document.getElementById("pincodeResult").innerHTML = "";
}

/* =========================
   CART FUNCTIONS
========================= */
function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
      <div>
        ${item.name} - ₹${item.price}
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
  });

  calculateTotal();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* =========================
   TOTAL + DELIVERY LOGIC
========================= */
function calculateTotal() {
  let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let delivery = subtotal > 0 && subtotal < 1500 ? 50 : 0;

  document.getElementById("subtotal").innerText = subtotal;

  if (delivery > 0) {
    document.getElementById("deliveryRow").style.display = "block";
    document.getElementById("deliveryCharge").innerText = delivery;
  } else {
    document.getElementById("deliveryRow").style.display = "none";
  }

  document.getElementById("total").innerText = subtotal + delivery;
}

/* =========================
   PLACE ORDER
========================= */
function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let message = "Order from MVR Mart:\n\n";
  cart.forEach(item => {
    message += `${item.name} - ₹${item.price}\n`;
  });

  message += `\nTotal: ₹${document.getElementById("total").innerText}`;

  const whatsappUrl =
    "https://wa.me/91XXXXXXXXXX?text=" +
    encodeURIComponent(message);

  window.open(whatsappUrl, "_blank");
}

/* Load cart on refresh */
renderCart();

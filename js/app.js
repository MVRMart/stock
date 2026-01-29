// ===============================
// app.js for MVR Mart (FINAL FIXED)
// ===============================

// Cart array, load from localStorage if exists
let cart = JSON.parse(localStorage.getItem("mvrCart")) || [];
let accessGranted = false;

// Define serviceable areas by pincode
const serviceableAreas = {
  "500086": ["Kukatpally", "JNTU", "Pragathi Nagar", "KPHB Colony"],
  "502102": ["Jangapally", "Siddipet"]
};

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  lockAccess();
  renderCart();
});

// ===============================
// ACCESS CONTROL
// ===============================
function lockAccess() {
  accessGranted = false;
  document.getElementById("cartSection").style.display = "none";

  document.querySelectorAll(".addBtn").forEach(b => {
    b.disabled = true;
    b.classList.remove("enabled");
  });
                                               }
function unlockAccess() {
  accessGranted = true;
  document.getElementById("cartSection").style.display = "block";

  document.querySelectorAll(".addBtn").forEach(b => {
    b.disabled = false;
    b.classList.add("enabled");
  });
}
// ===============================
// CART FUNCTIONS
// ===============================
function addToCart(name, price) {
  if (!accessGranted) return;

  // ✅ IMPORTANT FIX
  const btn = event.target;
  const productKey = btn.dataset.product; // Sugar, ReusableDiapers, MenShirt

  const qtyInput = document.getElementById(productKey + "Qty");
  let qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;

  let item = cart.find(i => i.name === name);
  if (item) {
    item.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  renderCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function updateQty(index, val) {
  cart[index].qty = Math.max(1, parseInt(val) || 1);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  let html = "";
  let subtotal = 0;

  cart.forEach((item, i) => {
    let amt = item.price * item.qty;
    subtotal += amt;

    html += `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        ₹${item.price} ×
        <input type="number" min="1" value="${item.qty}"
          onchange="updateQty(${i},this.value)">
        = ₹${amt}<br>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">-</button>
        <button onclick="removeItem(${i})"
          style="background:#d32f2f;color:#fff">
          Remove
        </button>
      </div>
    `;
  });

  document.getElementById("cartItems").innerHTML = html || "No items added";
  document.getElementById("subtotal").innerText = subtotal;

  let deliveryCharge = 0;

if (subtotal > 0 && subtotal < 1500) {
  deliveryCharge = 50;
}

document.getElementById("deliveryRow").style.display =
  subtotal > 0 ? "block" : "none";

document.getElementById("deliveryCharge").innerText = deliveryCharge;
document.getElementById("total").innerText = subtotal + deliveryCharge;

  localStorage.setItem("mvrCart", JSON.stringify(cart));
}

// ===============================
// PINCODE CHECK
// ===============================
function checkPincode() {
  const pincode = document.getElementById("pincode").value.trim();
  const result = document.getElementById("pincodeResult");

  lockAccess();

  if (serviceableAreas[pincode]) {
    result.innerHTML =
      `✅ We serve: ${serviceableAreas[pincode].join(", ")}`;
    result.style.color = "green";
    unlockAccess();
  } else {
    result.innerHTML = "❌ Delivery not available for this pincode";
    result.style.color = "red";
  }
}

function resetAccess() {
  lockAccess();
  document.getElementById("pincodeResult").innerHTML = "";
}

// ===============================
// WHATSAPP ORDER
// ===============================
function placeOrder() {
  if (!accessGranted) {
    alert("Please enter a valid pincode");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const pincode = document.getElementById("pincode").value.trim();
  let text = `Order from MVR Mart\nPincode: ${pincode}\n\n`;
  let subtotal = 0;

  cart.forEach((i, n) => {
    let amt = i.price * i.qty;
    subtotal += amt;
    text += `${n + 1}. ${i.name} × ${i.qty} = ₹${amt}\n`;
  });

  let deliveryCharge = subtotal >= 1500 ? 0 : 50;
  text += `\nSubtotal: ₹${subtotal}\nDelivery: ₹${deliveryCharge}\nTotal: ₹${subtotal + deliveryCharge}\n\nCash on Delivery available`;

  window.open(
    "https://wa.me/919876543210?text=" + encodeURIComponent(text),
    "_blank"
  );
}

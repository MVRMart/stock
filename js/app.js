<script>
const DELIVERY_CHARGE = 40;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let serviceable = false; 

function addItem(name, price, qty) {
  if (!serviceable) return;
  qty = parseInt(qty);
  let item = cart.find(i => i.name === name);
  item ? item.qty += qty : cart.push({ name, price, qty });
  render();
} 

function changeQty(i, d) {
  if (!serviceable) return;
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  render();
} 

function render() {
  let html = "", sub = 0;
  cart.forEach((i, n) => {
    let amt = i.price * i.qty;
    sub += amt;
    html += `
      <div class="cart-item">
        <b>${i.name}</b><br>
        ₹${i.price} × ${i.qty} = ₹${amt}<br>
        <button onclick="changeQty(${n},1)" ${!serviceable?"disabled":""}>+</button>
        <button onclick="changeQty(${n},-1)" ${!serviceable?"disabled":""}>-</button>
      </div>`;
  }); 

  cartItems.innerHTML = html || "No items";
  subtotal.innerText = sub; 

  let delivery = 0;
  if (sub > 0 && sub < 1500) {
    delivery = DELIVERY_CHARGE;
    deliveryMsg.innerHTML = `<span class="warn">Add ₹${1500-sub} more for FREE delivery</span>`;
  } else if (sub >= 1500) {
    deliveryMsg.innerHTML = `<span class="free">🎉 Free Delivery</span>`;
  } else {
    deliveryMsg.innerHTML = "";
  } 

  deliveryCharge.innerText = delivery;
  total.innerText = sub + delivery; 

  localStorage.setItem("cart", JSON.stringify(cart));
} 

pincode.oninput = () => {
  serviceable = pincode.value === "500086";
  pinMsg.innerHTML = serviceable
    ? "<span class='free'>Service available</span>"
    : "<span class='warn'>We are yet to serve in this area</span>"; 

  document.querySelectorAll(".addBtn").forEach(b => b.disabled = !serviceable);
  waBtn.disabled = !serviceable;
  render();
}; 

function shareWA() {
  if (!serviceable || cart.length === 0) return;
  let msg = `Order from MVR Market%0APincode: ${pincode.value}%0A`;
  cart.forEach((i,n)=>msg+=`${n+1}. ${i.name} × ${i.qty} = ₹${i.price*i.qty}%0A`);
  window.open("https://wa.me/919876543210?text="+msg);
} 

function updateTruck(){
  let d=new Date(),day=d.getDay(),hr=d.getHours();
  stage1.classList.remove("active");stage2.classList.remove("active");stage3.classList.remove("active");
  if((day>=1&&day<=5)||(day==6&&hr<13)){stage1.classList.add("active");stageMsg.innerText="🚚 Collecting orders. Order by Saturday afternoon.";}
  else if((day==6&&hr>=13)||(day==0&&hr<22)){stage2.classList.add("active");stageMsg.innerText="🚛 Out for delivery. Orders still accepted.";}
  else{stage3.classList.add("active");stageMsg.innerText="🚚 All items delivered.";}
} 

updateTruck();
render();
function openImg(src){window.open(src);}
</script>

const container = document.getElementById("products-container");
const modal = document.getElementById("order-modal");
const closeBtn = document.querySelector(".close-btn");
const confirmBtn = document.getElementById("confirm-order-btn");

const nameInput = document.getElementById("cust-name");
const emailInput = document.getElementById("cust-email");
const phoneInput = document.getElementById("cust-phone");
const addressInput = document.getElementById("cust-address");

let selectedProduct = null;

/* LOAD PRODUCTS */
db.collection("products").orderBy("createdAt", "desc").get()
.then(snapshot => {
  snapshot.forEach(doc => {
    const p = doc.data();

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      ${p.isNew ? `<span class="new-badge">New</span>` : ""}
      <img src="${p.image}">
      <div class="product-details">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button class="order-btn">Place Order</button>
      </div>
    `;

    card.querySelector(".order-btn").addEventListener("click", () => {
      selectedProduct = { id: doc.id, ...p };
      modal.style.display = "flex";
    });

    container.appendChild(card);
  });
});

/* CLOSE MODAL */
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

/* CONFIRM ORDER — REDIRECT TO WHATSAPP */
confirmBtn.addEventListener("click", () => {
  if (!selectedProduct) {
    alert("No product selected");
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !email || !phone || !address) {
    alert("Please fill all details");
    return;
  }

  // YOUR WHATSAPP NUMBER
  const myWhatsAppNumber = "916238507436"; 

  // CONSTRUCT THE MESSAGE
  const message = `*New Order Details*%0A` +
                  `--------------------------%0A` +
                  `*Product:* ${selectedProduct.name}%0A` +
                  `*Price:* ₹${selectedProduct.price}%0A%0A` +
                  `*Customer Info:*%0A` +
                  `Name: ${name}%0A` +
                  `Email: ${email}%0A` +
                  `Phone: ${phone}%0A` +
                  `Address: ${address}`;

  // OPEN WHATSAPP
  const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");

  // RECORD TO FIREBASE (Status: WhatsApp Redirected)
  db.collection("orders").add({
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    price: selectedProduct.price,
    customerName: name,
    customerEmail: email,
    phone,
    address,
    status: "WhatsApp Redirected",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    modal.style.display = "none";
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
  })
  .catch(err => {
    console.error("Firebase log failed: ", err);
  });
});

/* SIDEBAR TOGGLE */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.onclick = () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
};

overlay.onclick = () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};

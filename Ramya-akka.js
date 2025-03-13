// Company Data
const companyData = [
    { id: 1, name: "Royal Enfield", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_kwl7xm.jpg" },
    { id: 2, name: "Hero", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_3_lruu8z.png" },
    { id: 3, name: "Honda", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_2_vxpbu7.png" },
    { id: 4, name: "TVS", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_xbrxez.png" },
    { id: 5, name: "Bajaj", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_1_cdtjhb.jpg" },
    { id: 6, name: "Suzuki", image: "https://res.cloudinary.com/df4awljmy/image/upload/v1741345079/download_1_xzkboi.png" },
];

// Bike Models by Company (abbreviated)
const bikeData = [
    { id: 1, companyId: 1, name: "Bullet 350", year: "1990–Present", image: "https://res.cloudinary.com/df4awljmy/image/upload/c_thumb,w_200,g_face/v1739858431/Classic_350_noif3c.jpg", components: [{ id: 1, name: "Engine" }, { id: 2, name: "Transmission" }, { id: 3, name: "Suspension" }, { id: 4, name: "Brakes" }, { id: 5, name: "Electrical System" }, { id: 6, name: "Frame and Body" }, { id: 7, name: "Wheels and Tires" }, { id: 8, name: "Exhaust System" }] },
    // ... (rest of your bikeData)
];

// Spare Parts Data (abbreviated)
const sparePartsData = [
    { id: 1, componentId: 1, name: "Piston", price: 50, image: "https://res.cloudinary.com/df4awljmy/image/upload/v1739870891/Piston_ks34ug.jpg" },
    // ... (rest of your sparePartsData)
];

// Beep Sound for Order Confirmation
const beepSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');

let cart = [];
let currentComponentId = null;
let currentCompanyId = null;

// Show Homepage (Companies)
function showHome() {
    document.getElementById("home").classList.add("active");
    document.getElementById("models").classList.remove("active");
    document.getElementById("components").classList.remove("active");
    document.getElementById("spare-parts").classList.remove("active");
    document.getElementById("cart").classList.remove("active");
    renderCompanies();
}

// Show Models Page
function showModels(companyId) {
    currentCompanyId = companyId;
    document.getElementById("home").classList.remove("active");
    document.getElementById("models").classList.add("active");
    document.getElementById("components").classList.remove("active");
    document.getElementById("spare-parts").classList.remove("active");
    document.getElementById("cart").classList.remove("active");
    renderBikeModels(companyId);
}

// Show Components Page
function showComponents(modelId) {
    document.getElementById("models").classList.remove("active");
    document.getElementById("components").classList.add("active");
    document.getElementById("spare-parts").classList.remove("active");
    document.getElementById("cart").classList.remove("active");
    renderComponents(modelId);
}

// Show Spare Parts Page
function showSpareParts(componentId) {
    currentComponentId = componentId;
    document.getElementById("components").classList.remove("active");
    document.getElementById("spare-parts").classList.add("active");
    document.getElementById("cart").classList.remove("active");
    renderSpareParts(componentId);
}

// Show Cart
function showCart() {
    document.getElementById("home").classList.remove("active");
    document.getElementById("models").classList.remove("active");
    document.getElementById("components").classList.remove("active");
    document.getElementById("spare-parts").classList.remove("active");
    document.getElementById("cart").classList.add("active");
    renderCart();
}

// Render Companies
function renderCompanies() {
    const companyList = document.getElementById("company-list");
    companyList.innerHTML = companyData
        .map(
            (company) => `
            <div class="card" onclick="showModels(${company.id})">
                <img src="${company.image}" alt="${company.name}">
                <h3>${company.name}</h3>
            </div>
        `
        )
        .join("");
}

// Render Bike Models
function renderBikeModels(companyId) {
    const models = bikeData.filter((model) => model.companyId === companyId);
    const modelList = document.getElementById("model-list");
    modelList.innerHTML = models
        .map(
            (model) => `
            <div class="card" onclick="showComponents(${model.id})">
                <img src="${model.image}" alt="${model.name}">
                <h3>${model.name} (${model.year})</h3>
            </div>
        `
        )
        .join("");
}

// Render Components
function renderComponents(modelId) {
    const model = bikeData.find((m) => m.id === modelId);
    const componentList = document.getElementById("component-list");
    componentList.innerHTML = model.components
        .map(
            (component) => `
            <div class="card" onclick="showSpareParts(${component.id})">
                <h3>${component.name}</h3>
            </div>
        `
        )
        .join("");
}

// Render Spare Parts
function renderSpareParts(componentId) {
    const spareParts = sparePartsData.filter((part) => part.componentId === componentId);
    const sparePartList = document.getElementById("spare-part-list");
    sparePartList.innerHTML = spareParts
        .map(
            (part) => {
                const isInCart = cart.some(item => item.id === part.id);
                return `
                <div class="card">
                    <img src="${part.image}" alt="${part.name}">
                    <h3>${part.name}</h3>
                    <p>$${part.price}</p>
                    <button id="cart-btn-${part.id}" class="${isInCart ? 'carted' : ''}" onclick="addToCart(${part.id})">
                        ${isInCart ? 'Item Carted' : 'Add to Cart'}
                    </button>
                </div>
            `;
            }
        )
        .join("");
}

// Add to Cart
function addToCart(partId) {
    const part = sparePartsData.find((p) => p.id === partId);
    const cartItem = cart.find((item) => item.id === partId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        part.quantity = 1;
        cart.push(part);
    }

    updateCartCount();
    renderSpareParts(currentComponentId);
}

// Update Cart Count
function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = cart
        .map(
            (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price} x ${item.quantity} = $${item.price * item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
        `
        )
        .join("");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cart-total").textContent = `Total: $${total}`;
}

// Increase Quantity
function increaseQuantity(partId) {
    const cartItem = cart.find((item) => item.id === partId);
    if (cartItem) {
        cartItem.quantity += 1;
        updateCartCount();
        renderCart();
        renderSpareParts(currentComponentId);
    }
}

// Decrease Quantity
function decreaseQuantity(partId) {
    const cartItem = cart.find((item) => item.id === partId);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity === 0) {
            cart = cart.filter((item) => item.id !== partId);
        }
        updateCartCount();
        renderCart();
        renderSpareParts(currentComponentId);
    }
}

// Place Order
function placeOrder() {
    if (cart.length === 0) {
        showError("Your cart is empty. Add some items first!");
        return;
    }
    document.getElementById("user-verification").style.display = "block";
}

// Submit Order with Firebase (Updated with Address and Mechanic Shop)
function submitOrder(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const mechanicShop = document.getElementById("mechanic-shop").value.trim();
    const spinner = document.getElementById("loading-spinner");

    // Validation
    if (!username || !phone || !address || !mechanicShop) {
        showError("Please fill in all fields.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError("Please enter a valid 10-digit phone number.");
        return;
    }

    spinner.style.display = "block";

    firebase.firestore().collection("orders").add({
        username: username,
        phone: phone,
        address: address,
        mechanicShop: mechanicShop,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        spinner.style.display = "none";
        document.getElementById("user-verification").style.display = "none";
        document.getElementById("order-confirmation").style.display = "block";

        // Play beep sound
        beepSound.play().catch(error => console.error("Error playing beep sound:", error));

        // Clear cart and form inputs
        cart = [];
        document.getElementById("username").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";
        document.getElementById("mechanic-shop").value = "";
        updateCartCount();
        renderCart();

        // Clear cart display
        document.getElementById("cart-items").innerHTML = "";
        document.getElementById("cart-total").textContent = "Total: $0";

        setTimeout(() => {
            document.getElementById("order-confirmation").style.display = "none";
            showHome();
        }, 3000);
    })
    .catch(error => {
        spinner.style.display = "none";
        showError("Failed to place order: " + error.message);
        console.error("Firebase error:", error);
    });
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = "color: red; text-align: center; margin-top: 1rem;";
    errorDiv.textContent = message;
    const form = document.getElementById("order-form");
    form.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Initialize
showHome();
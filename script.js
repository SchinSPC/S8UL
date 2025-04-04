// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart count and total in the header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cartTotalElements = document.querySelectorAll('#cart-total');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    cartTotalElements.forEach(element => {
        element.textContent = totalPrice;
    });
}

// Function to add item to cart
function addToCart(productId, productName, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = {
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        };
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item removed from cart');
    displayCartItems(); // Update the cart display
}

// Function to update quantity
function updateQuantity(index, change, newValue) {
    if (newValue !== undefined) {
        cart[index].quantity = parseInt(newValue);
    } else {
        cart[index].quantity += change;
    }
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems(); // Update the cart display
}

// Function to save item for later
function saveForLater(index) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.push(cart[index]);
    cart.splice(index, 1);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    
    updateCartCount();
    displayCartItems();
    showNotification('Item saved for later');
}

// Function to move item to cart
function moveToCart(index) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    cart.push(savedItems[index]);
    savedItems.splice(index, 1);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    
    updateCartCount();
    displayCartItems();
    showNotification('Item moved to cart');
}

// Function to remove from saved items
function removeFromSaved(index) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.splice(index, 1);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    displayCartItems();
    showNotification('Item removed from saved items');
}

// Function to calculate shipping cost
function calculateShipping(cart, method = 'standard') {
    const baseCost = cart.length * 50; // ₹50 per item base cost
    return method === 'express' ? baseCost * 2 : baseCost;
}

// Function to calculate discount
function calculateDiscount() {
    const coupon = localStorage.getItem('activeCoupon');
    if (!coupon) return 0;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (coupon === 'WELCOME10') {
        return Math.min(subtotal * 0.1, 1000); // 10% discount, max ₹1000
    }
    if (coupon === 'FREESHIP') {
        const shippingMethod = localStorage.getItem('shippingMethod') || 'standard';
        return calculateShipping(cart, shippingMethod);
    }
    return 0;
}

// Function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize cart count and total when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});

// Listen for storage events to sync cart across tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
        cart = JSON.parse(event.newValue) || [];
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
    }
}); 
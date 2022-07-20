let addbtocart = document.querySelectorAll(".add-to-cart");
let total_count = document.querySelector("#img-cart span");
let cartDom = document.querySelector("#cart-items");
let basket = document.querySelector(".basket");
let btn_remove = document.querySelectorAll(".btn-remove");
let proname = document.querySelectorAll(".product-name");
let cart_count = document.querySelector(".cart-count");
let total_cost = document.querySelector(".total-cost");
let check_out_btn = document.querySelector(".check-out-btn");
let modal = document.querySelector(".modal");
let cartItems = JSON.parse(localStorage.getItem("cart___items")) || [];

document.addEventListener("DOMContentLoaded", loadData);

check_out_btn.addEventListener("click", function () {
  clearcartItems();
});

cart_count.addEventListener("click", function () {
  cartDom.classList.toggle("active");
});

addbtocart.forEach((btn) => {
  let parentElement = btn.parentElement.parentElement;
  btn.addEventListener("click", () => {
    const product = {
      id: parentElement.getAttribute("data-id"),
      name: parentElement.querySelector(".card-text").getAttribute("id"),
      image: parentElement.querySelector("#imageforcard").getAttribute("src"),
      price: parentElement.querySelector(".card-title").innerText,
      quantity: 1,
    };

    let IsInCart =
      cartItems.filter((item) => item.id === product.id).length > 0;
    if (!IsInCart) {
      addItemtodom(product);
      swal({
        position: "top-end",
        title: "The product has been added to the cart",
        type: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      swal({
        title: "The product is in the shopping cart",
        text:'You can add to the number of products in the shopping cart',
        type: "warning",
        button: "oh yes!",
      });
      return;
    }

    const cartDOMItems = document.querySelectorAll(".cart-item");

    cartDOMItems.forEach((inItem) => {
      if (inItem.querySelector("#product-id").value === product.id) {
        increaseItem(inItem, product);
        decreaseItem(inItem, product);
        removeItem(inItem, product);
      }
    });

    cartItems.push(product);
    calculatetotal();
    saveToLocalStorage();
  });
});

function saveToLocalStorage() {
  localStorage.setItem("cart___items", JSON.stringify(cartItems));
}

function addItemtodom(product) {
  cartDom.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="cart-item">
      <input type="hidden" id="product-id" value="${product.id}">
       <img src="${product.image}" alt="" id="product">
       <h4 class="product-name">${product.name}</h4>
       <button  class="btn-small" action="decrease">&minus;</button>
       <h4 class="product-quantity" >${product.quantity}</h4>
       <button  class="btn-small" action="increase">&plus;</button>
       <h4 class="product-price">${product.price}</h4>
       <button class=" btn-small btn-remove" action="remove">&times;</button>
        </div>
    `
  );
}

function calculatetotal() {
  let total = 0;
  cartItems.forEach((item) => {
    total += Number(item.quantity * item.price);
  });
  total_cost.innerText = total;
  total_count.innerText = cartItems.length;
}

function increaseItem(inItem, product) {
  inItem
    .querySelector("[action='increase']")
    .addEventListener("click", function () {
      cartItems.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          inItem.querySelector(".product-quantity").innerText =
            ++cartItem.quantity;
          calculatetotal();
          saveToLocalStorage();
        }
      });
    });
}

function decreaseItem(inItem, product) {
  inItem
    .querySelector("[action='decrease']")
    .addEventListener("click", increase);

  function increase() {
    cartItems.forEach((cartItem) => {
      if (cartItem.id === product.id) {
        if (cartItem.quantity > 1) {
          inItem.querySelector(".product-quantity").innerText =
            --cartItem.quantity;
        } else {
          cartItems = cartItems.filter(
            (newElement) => newElement.id !== product.id
          );
          inItem.remove();
        }
        calculatetotal();
        saveToLocalStorage();
      }
    });
  }
}

function removeItem(InItem, product) {
  InItem.querySelector("[action='remove']").addEventListener(
    "click",
    removethis
  );
  function removethis() {
    cartItems.forEach((cartItem) => {
      if (cartItem.id === product.id) {
        cartItems = cartItems.filter(
          (newElement) => newElement.id !== product.id
        );
        InItem.remove();
        calculatetotal();
        saveToLocalStorage();
      }
    });
  }
}

function loadData() {
  if (cartItems.length > 0) {
    cartItems.forEach((product) => {
      addItemtodom(product);

      const cartDOMItems = document.querySelectorAll(".cart-item");

      cartDOMItems.forEach((inItem) => {
        if (inItem.querySelector("#product-id").value === product.id) {
          increaseItem(inItem, product);
          decreaseItem(inItem, product);
          removeItem(inItem, product);
        }
      });
    });
    calculatetotal();
    saveToLocalStorage();
  }
}

function clearcartItems() {
  const cartDOMItems = document
    .querySelectorAll(".cart-item")
    .forEach((item) => {
      item.remove();
    });

  localStorage.clear();
  cartItems = [];
  calculatetotal();
}

// https://www.themealdb.com/api/json/v1/1/categories.php
let data;
const optionsContainer = document.getElementById("options-container");
const totalOrder = document.querySelectorAll(".total-order");
const shoppingBag = document.getElementById("shopping-bag");
const cartNav = document.getElementById("cart-nav");
const sideDrawer = document.getElementById("side-drawer");
const itemQuantity = document.getElementById("item-quantity");
let orders = [];
// show selected menu option in button
document.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", function () {
    let selectedOption = this.innerText;
    document.getElementById("options-menu").innerHTML =
      " <span>" + selectedOption + "</span>";
    toggleMenuOption();
  });
});

// handle toggle menu options
const toggleMenuOption = () => {
  if (optionsContainer.classList.contains("hidden")) {
    optionsContainer.classList.remove("hidden");
  } else {
    optionsContainer.classList.add("hidden");
  }
};
document
  .getElementById("options-button")
  .addEventListener("click", toggleMenuOption);

// handle add to cart
const getOrdersString = localStorage.getItem("orders");
if (getOrdersString) {
  const getOrders = JSON.parse(getOrdersString);
  orders = getOrders;
}

totalOrder.forEach((x) => (x.innerText = orders.length));
const handleAddToCart = (id) => {
  if (!orders.includes(id)) {
    orders.push(id);
    sideDrawer.style.transform = `translate(0px, 0px)`;
    renderCartList();
  }
  localStorage.setItem("orders", JSON.stringify(orders));
  totalOrder.forEach((x) => (x.innerText = orders.length));
};

//fetch meal data
async function fetchData(params) {
  const res = await fetch("/meal.json");
  data = await res.json();
  data.forEach((meal) => {
    const card = document.createElement("div");
    card.innerHTML = `<div class="max-w-sm rounded overflow-hidden shadow-lg p-2 bg-orange-500/10">
    <div class="overflow-hidden rounded-md">
      <img class="hover:scale-110 transition-all duration-300 w-full object-cover h-40" src=${
        meal?.image
      } alt="">
     </div>
     
    <div class="pt-5">
      <h4 class="font-bold text-xl ">Mountain</h4>
      <h4 class="font-semibold text-1xl mb-2">${meal?.price}$/each</h4>
      <p class="text-gray-500/70 text-sm text-base">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Voluptatibus quia, Nonea! Maiores et perferendis eaque,
        exercitationem praesentium nihil.
      </p>
    </div>
    <div class="pt-4 pb-2">
     <button onclick="handleAddToCart(${
       meal?.id
     })" id="add-to-card-btn" class="block w-full my-2 py-2 rounded text-white font-semibold ${
      orders.includes(meal?.id) ? "bg-gray-400" : "bg-orange-500 "
    }">Add To Card</button>
     <button class="block w-full my-2 py-2 border-2  border-orange-500 rounded text-orange-500 font-semibold ">Customize</button>
    </div>
  </div>`;
    document.getElementById("card-container").appendChild(card);
  });

  renderCartList();
}
// render cart list in drawer
function renderCartList() {
  const cartItems = data.filter((item) => orders.find((id) => id == item?.id));
  document.getElementById("cart-container").innerHTML = "";
  cartItems.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="flex gap-2 items-center relative p-2 m-2 border-2 border-white rounded">
    <div class="overflow-hidden rounded-md">
      <img
        class="hover:scale-110 transition-all duration-300 w-20 object-cover rounded h-28"
        src="https://www.themealdb.com/images/category/beef.png"
        alt="" />
    </div>
    <div class="flex  flex-col justify-between">
      <div class="mb-2">
        <h3 class="font-semibold text-white my-0">${item?.name}</h3>
        <p class=" text-white text-sm my-0">$ ${item?.price}/each</p>
      </div>
      <div class="flex items-center">
        <button onclick="decreaseHandler('${item?.id}')" id="decrease" class="bg-gray-300 rounded p-2 w-8 font-semibold">-</button>
        <p  id="item-quantity-${item?.id}" class="bg-white w-10 py-1 px-2 text-center">1</p>
        <button onclick="increaseHandler('${item?.id}')" id="increase" class="bg-gray-300 rounded p-2 w-8 font-semibold">+</button>
      </div>
    </div>
    <button id="delete-item" class="absolute text-orange-500 bg-white rounded -top-2 -right-2"><span class="material-symbols-outlined">
    delete
    </span></button>
    <p id="total-price-${item?.id}" class="cart-total-price absolute text-white font-semibold bottom-2 right-2">${item?.price}</p>
  </div>`;
    document.getElementById("cart-container").appendChild(card);
  });
}

console.log(itemQuantity);

// handle toggle menu options
const toggleSideCartContainer = () => {
  if (sideDrawer.classList.contains("close")) {
    sideDrawer.classList.remove("close");
    sideDrawer.style.transform = `translate(0px, 0px)`;
  } else {
    sideDrawer.classList.add("close");
    sideDrawer.style.transform = `translate(333px, 0px)`;
  }
};
shoppingBag.addEventListener("click", toggleSideCartContainer);
//----------------------------------

const decreaseHandler = (id) => {
  if (parseInt(document.getElementById(`item-quantity-${id}`).innerText) > 1) {
    document.getElementById(`item-quantity-${id}`).innerText =
      parseInt(document.getElementById(`item-quantity-${id}`).innerText) - 1;
  }
  calculateTotal(id);
};
const increaseHandler = (id) => {
  document.getElementById(`item-quantity-${id}`).innerText =
    parseInt(document.getElementById(`item-quantity-${id}`).innerText) + 1;
  calculateTotal(id);
};

const calculateTotal = (id) => {
  const item = data.find((item) => item.id == parseInt(id));
  const quantity = getQuantity(id);
  const price = parseFloat(item?.price) * quantity;

  const getAllOrdersTotals = orders.map((id) => {
    const item = data.find((item) => item.id == parseInt(id));
    return getQuantity(id) * item?.price;
  });

  const grandTotal = getAllOrdersTotals.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  document.getElementById(`grand-total`).innerText = grandTotal
  displayTotal(id, price);
  return price;
};

const displayTotal = (id, price) => {
  document.getElementById(`total-price-${id}`).innerText = price;
};
console.log(document.querySelectorAll(".cart-total-price"));

function getQuantity(id) {
  const quantityString = document.getElementById(
    `item-quantity-${id}`
  ).innerText;
  const quantity = parseInt(quantityString);
  return quantity;
}

fetchData();

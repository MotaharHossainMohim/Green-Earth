let allPlants = [];
let cart = [];

// dom elements
const categoryList = document.getElementById("category-list");
const treeCardsContainer = document.getElementById("tree-cards-container");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const plantModal = document.getElementById("plant-modal");
const closeModalButton = document.querySelector(".close-button");
const modalDetails = document.getElementById("modal-details");
const loadingSpinner = document.getElementById("loading-spinner");

const truncateDescription = (text, wordLimit) => {
  if (!text) return "No description available.";
  const words = text.split(" ");
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "...";
};

// Load categories
const loadCategories = (categories) => {
  categoryList.innerHTML = "";

  const allLi = document.createElement("li");
  allLi.textContent = "All Trees";
  allLi.className =
    "category-item active cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-[#4B5563] bg-[#166534] bg-opacity-0";
  allLi.classList.add("bg-[#166534]", "text-white");
  allLi.addEventListener("click", () => {
    setActiveCategory(allLi);
    loadPlants(allPlants);
  });
  categoryList.appendChild(allLi);

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat.category_name;
    li.className =
      "category-item cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-[#4B5563] hover:bg-[#e6f5ea] hover:text-[#2F883B]";
    li.addEventListener("click", () => {
      setActiveCategory(li);
      filterPlants(cat.category_name);
    });
    categoryList.appendChild(li);
  });
};

// Load plants
const loadPlants = (plants) => {
  treeCardsContainer.innerHTML = "";
  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "tree-card bg-white border border-[#D1D5DB] rounded-lg shadow-sm p-3 flex flex-col h-[360px] transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg";
    card.setAttribute("data-plant-id", plant.id);

    card.innerHTML = `
      <img src="${plant.image}" alt="${
      plant.name
    }" class="w-full h-[150px] object-cover rounded-md bg-[#F3F4F6]" />
      <h4 class="tree-card-name text-[22px] font-bold text-[#1F2937] mt-3 mb-1 cursor-pointer">${
        plant.name
      }</h4>
      <p class="tree-card-description text-sm text-[#4B5563]">${truncateDescription(
        plant.description,
        10
      )}</p>
      <div class="card-details-wrapper flex flex-col gap-3 mt-auto">
        <div class="card-info-top flex justify-between items-center">
          <span class="card-category-tag inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-[#D1FAE5] text-[#15803D]">${
            plant.category || "Tree"
          }</span>
          <span class="card-price text-lg font-bold text-[#1F2937]">৳${
            plant.price
          }</span>
        </div>
        <div class="card-price-add flex flex-col gap-2">
          <button class="add-to-cart-button bg-[#15803D] text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#166534]" onclick="addToCart(${
            plant.id
          })">Add to Cart</button>
        </div>
      </div>
    `;

    card
      .querySelector(".tree-card-name")
      .addEventListener("click", () => showPlantDetails(plant.id));
    treeCardsContainer.appendChild(card);
  });
};

// Filter plants by category
const filterPlants = (categoryName) => {
  const filtered = allPlants.filter((p) => p.category === categoryName);
  loadPlants(filtered);
};

// Highlight active category
const setActiveCategory = (selected) => {
  const items = document.querySelectorAll(".category-item");
  items.forEach((item) => {
    item.classList.remove("active", "bg-[#166534]", "text-white");
    item.classList.add("text-[#4B5563]");
  });
  selected.classList.add("active", "bg-[#166534]", "text-white");
  selected.classList.remove("text-[#4B5563]");
};

// Cart functions
const addToCart = (id) => {
  const plant = allPlants.find((p) => p.id === id);
  if (plant) cart.push(plant);
  renderCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  renderCart();
};

const renderCart = () => {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className =
      "cart-item flex justify-between items-center p-3 rounded-lg mb-3 bg-[#DCFCE7] text-[#4B5563]";
    div.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name font-semibold text-[#1F2937]">${item.name}</span>
        <span class="cart-item-price-quantity text-sm text-[#6B7280]">৳${item.price} × 1</span>
      </div>
      <button onclick="removeFromCart(${i})" class="remove-button text-xl text-[#4B5563] hover:text-black bg-transparent border-none cursor-pointer">✕</button>
    `;
    cartItems.appendChild(div);
  });
  cartTotal.textContent = `Total: ৳${total}`;
};

// Modal
const showPlantDetails = (id) => {
  const plant = allPlants.find((p) => p.id === id);
  if (!plant) return;
  modalDetails.innerHTML = `
    <div class="modal-content-inner flex gap-5 items-start">
      <img src="${plant.image}" alt="${
    plant.name
  }" class="modal-image w-[200px] h-[200px] object-cover rounded-md flex-shrink-0" />
      <div class="modal-info flex flex-col gap-2">
        <h3 class="modal-name text-2xl font-bold text-[#1F2937] m-0">${
          plant.name
        }</h3>
        <p class="modal-category text-sm text-[#4B5563] m-0">Category: ${
          plant.category
        }</p>
        <p class="modal-description text-base text-[#1F2937] m-0">${
          plant.description
        }</p>
        <p class="modal-price text-base text-[#4B5563] m-0">Price: ৳${
          plant.price
        }</p>
        ${
          plant.details
            ? `<p class="modal-details-full text-sm text-[#6B7280] italic mt-3">${plant.details}</p>`
            : ""
        }
      </div>
    </div>
  `;
  plantModal.style.display = "block";
};

closeModalButton.onclick = () => (plantModal.style.display = "none");
window.onclick = (e) => {
  if (e.target === plantModal) plantModal.style.display = "none";
};

// Spinner
const showSpinner = () => {
  loadingSpinner.style.display = "flex";
  loadingSpinner.classList.remove("hidden");
};
const hideSpinner = () => {
  loadingSpinner.style.display = "none";
  loadingSpinner.classList.add("hidden");
};

// Initialize app
const init = () => {
  showSpinner();
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((catData) => loadCategories(catData.categories || []))
    .catch((err) => console.log("Category API failed:", err.message));

  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((plantData) => {
      allPlants = plantData.plants || [];
      loadPlants(allPlants);
    })
    .catch((err) => console.log("Plants API failed:", err.message))
    .finally(() => hideSpinner());
};

init();

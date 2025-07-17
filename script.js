document.addEventListener("DOMContentLoaded", () => {
  const cartItems = {}; // key: dessertTitle, value: count

  const cartBtn = document.querySelectorAll(".add-to-cart-btn");
  const cartCountTotal = document.querySelector(".cart-count-total");
  const billDiv = document.querySelector(".bill-div");
  const selectedDiv = billDiv.querySelector(".selected-foods");
  const totalPriceDiv = document.querySelector(".total-price");
  const placeholderImg = document.querySelector(".placeholder-img");
  const emptyP = document.querySelector(".empty-p");
  const totalAmtDiv = document.querySelector(".total-amt-div");
  const totalAmt = document.querySelector(".total-amt");
  const noteDiv = document.querySelector(".note-div");
  const totalAmtNoteDiv = document.querySelector(".total-amt-btn-div");
  const totalBtn = document.querySelector(".total-amt-btn");
  const removeIcon = document.querySelector(".clear-food");
  const confirmDiv = document.querySelector(".confirm-order-container");
  const confirmTotal = document.querySelector(".confirmed-total");
  const confirmItems = document.querySelector(".confirmed-items");
  const container = document.querySelector(".container");
  const startNewBtn = document.querySelector(".start-new-btn");
  const confirmText = document.querySelector(".total-amt-heading");

  let overallCount = 0;

  cartCountTotal.textContent = `Your Cart ()`;

  cartBtn.forEach((addCart) => {
    addCart.addEventListener("click", (e) => {
      e.preventDefault();

      const dessertCard = addCart.closest(".dessert-card");
      const dessertInfo = dessertCard.closest(
        ".waffle-div, .brulee-div, .macaron-div, .tiramisu-div, .baklava-div, .pie-div, .cake-div, .panna-div, .brownie-div"
      );
      const dessertTitle = dessertInfo
        .querySelector(".dessert-title")
        .textContent.trim();
      const cost = dessertInfo.querySelector(".cost");
      const priceValue = parseFloat(cost.textContent.replace(/[^0-9.]/g, ""));
      const incrementBtn = dessertCard.querySelector(
        ".icon-increment-quantity"
      );
      const decrementBtn = dessertCard.querySelector(
        ".icon-decrement-quantity"
      );
      const addText = dessertCard.querySelector(".add-text");
      const cart = dessertCard.querySelector(".cart");
      const foodImg = dessertCard.querySelector(".food-img");

      // Initialize count if not already
      if (!cartItems[dessertTitle]) {
        cartItems[dessertTitle] = 1;

        addCart.classList.add("clicked");
        addText.style.display = "flex";
        cart.style.display = "none";
        incrementBtn.style.display = "flex";
        decrementBtn.style.display = "flex";
        foodImg.style.border = "2px solid hsl(14, 86%, 42%)";
        totalAmtDiv.style.display = "flex";

        placeholderImg.style.display = "none";
        emptyP.style.display = "none";
        billDiv.style.display = "flex";
        noteDiv.style.display = "flex";
        totalAmtNoteDiv.style.display = "flex";

        const selectedFood = document.createElement("div");
        selectedFood.classList.add("selected-food");
        selectedFood.dataset.title = dessertTitle;

        selectedFood.innerHTML = `
      <div class="selected-title">${dessertTitle}</div>
      <div class="selected-summary">
        <p class="quantity">1x</p>
        <p class="price">@${cost.textContent}</p>
        <p class="total-price">$${priceValue.toFixed(2)}</p>
      </div>
    `;
        selectedDiv.appendChild(selectedFood);
      }

      // Update count display
      addText.textContent = cartItems[dessertTitle];
      updateSelectedItem(dessertTitle, cartItems[dessertTitle], priceValue);

      if (!incrementBtn.dataset.listenerAttached) {
        incrementBtn.dataset.listenerAttached = "true";
        incrementBtn.addEventListener("click", () => {
          cartItems[dessertTitle]++;
          addText.textContent = cartItems[dessertTitle];
          updateSelectedItem(dessertTitle, cartItems[dessertTitle], priceValue);
        });
      }

      if (!decrementBtn.dataset.listenerAttached) {
        decrementBtn.dataset.listenerAttached = "true";
        decrementBtn.addEventListener("click", () => {
          if (cartItems[dessertTitle] > 1) {
            cartItems[dessertTitle]--;
            addText.textContent = cartItems[dessertTitle];
            updateSelectedItem(
              dessertTitle,
              cartItems[dessertTitle],
              priceValue
            );
          }
        });
      }

      updateCartCount();
    });
  });

  function updateSelectedItem(title, count, price) {
    let item = Array.from(document.querySelectorAll(".selected-food")).find(
      (food) => {
        return (
          food.querySelector(".selected-title")?.textContent.trim() === title
        );
      }
    );

    if (item) {
      item.querySelector(".quantity").textContent = `${count}x`;
      item.querySelector(".total-price").textContent = `$${(
        count * price
      ).toFixed(2)}`;
    }

    calculateTotalAmount();
  }
  function updateCartCount() {
    let totalItems = Object.values(cartItems).reduce(
      (sum, val) => sum + val,
      0
    );
    cartCountTotal.textContent = `Your Cart (${totalItems})`;
  }

  function calculateTotalAmount() {
    let total = 0;

    //looping through all selected-food elements
    const selectedItems = document.querySelectorAll(".selected-food");
    selectedItems.forEach((item) => {
      const priceText = item.querySelector(".total-price").textContent;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      total += price;
    });
    totalAmt.textContent = `$${total.toFixed(2)}`;
  }
  function findImageSrcByTitle(title) {
    const map = {
      "Waffle with Berries": "./assets/images/image-waffle-desktop.jpg",
      "Vanilla Bean Crème Brûlée":
        "./assets/images/image-creme-brulee-desktop.jpg",
      "Macaron Mix of Five": "./assets/images/image-macaron-desktop.jpg",
      "Classic Tiramisu": "./assets/images/image-tiramisu-desktop.jpg",
      "Pistachio Baklava": "./assets/images/image-baklava-desktop.jpg",
      "Lemon Meringue Pie": "./assets/images/image-meringue-desktop.jpg",
      "Red Velvet Cake": "./assets/images/image-cake-desktop.jpg",
      "Salted Caramel Brownie": "./assets/images/image-brownie-desktop.jpg",
      "Vanilla Panna Cotta": "./assets/images/image-panna-cotta-desktop.jpg",
    };

    return map[title] || "./assets/images/image-default.jpg"; // fallback image
  }

  totalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    confirmDiv.style.display = "flex";
    confirmTotal.classList.remove("hidden");
    confirmTotal.innerHTML = `Order Total ${totalAmt.textContent}`;
    confirmItems.innerHTML = "";
    document.querySelectorAll(".selected-food").forEach((item) => {
      const title = item.querySelector(".selected-title").textContent.trim();
      const qtyText = item.querySelector(".quantity").textContent.trim(); // e.g., "4x"
      const unitPriceText = item.querySelector(".price").textContent.trim(); // e.g., "@$7.00"
      const totalPriceText = item
        .querySelector(".total-price")
        .textContent.trim(); // e.g., "$28.00"

      // Create container
      const confirmItem = document.createElement("div");
      confirmItem.classList.add("confirm-item");

      const imageSrc = findImageSrcByTitle(title);
      container.style.opacity = "50% ";

      confirmItem.innerHTML = `
  <div class="confirm-row">
    <div class="confirm-left">
      <img src="${imageSrc}" alt="${title}" class="confirm-img" />
      <div class="confirm-details">
        <p class="confirm-title">${title}</p>
        <p class="confirm-subtext">
          <span class="qty"><strong>${qtyText}</strong></span>
          <span class="unit-price">${unitPriceText}</span>
        </p>
      </div>
    </div>
    <div class="confirm-right">
      <p class="confirm-price">${totalPriceText}</p>
    </div>
  </div>
`;

      confirmItems.appendChild(confirmItem);
    });
    startNewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      confirmItems.innerHTML = "";
      selectedDiv.innerHTML = "";

      for (let key in cartItems) {
        delete cartItems[key];
      }

      confirmDiv.style.display = "none";
      container.style.opacity = "100%";
      cartCountTotal.textContent = "Your Cart (0)";
      billDiv.style.display = "none";
      totalAmt.style.display = "none";
      confirmText.style.display = "none";
      noteDiv.style.display = "none";
      totalBtn.style.display = "none";
      placeholderImg.style.display = "flex";
      emptyP.style.display = "flex";
      document
        .querySelectorAll(".icon-increment-quantity")
        .forEach((plusIcon) => {
          plusIcon.style.display = "none";
        });
      document
        .querySelectorAll(".icon-decrement-quantity")
        .forEach((minusIcon) => {
          minusIcon.style.display = "none";
        });
      cartBtn.forEach((displayEachCart) => {
        const dessertCard = displayEachCart.closest(".dessert-card");
        const addText = dessertCard.querySelector(".add-text");
        const cartIcon = dessertCard.querySelector(".cart");
        const foodImg = dessertCard.querySelector(".food-img");
        displayEachCart.classList.remove("clicked");
        addText.textContent = "";
        addText.style.display = "none";
        cartIcon.style.display = "flex";
        foodImg.style.border = "none";
        count;
      });
    });
  });
});

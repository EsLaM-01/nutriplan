const categoryStyles = {
  breakfast_cereals: "linear-gradient(to right, #f59e0b, #f97316)",
  beverages: "linear-gradient(to right, #3b82f6, #06b6d4)",
  snacks: "linear-gradient(to right, #a855f7, #ec4899)",
  dairy: "linear-gradient(to right, #38bdf8, #3b82f6)",
  fruits: "linear-gradient(to right, #ef4444, #f43f5e)",
  vegetables: "linear-gradient(to right, #22c55e, #10b981)",
  breads: "linear-gradient(to right, #d97706, #eab308)",
  meats: "linear-gradient(to right, #dc2626, #e11d48)",
  frozen_foods: "linear-gradient(to right, #06b6d4, #2563eb)",
  sauces: "linear-gradient(to right, #f97316, #ef4444)",
};
const randomStyles = [
  "linear-gradient(to right, #6366f1, #a855f7)",
  "linear-gradient(to right, #d946ef, #ec4899)",
  "linear-gradient(to right, #8b5cf6, #6366f1)",
  "linear-gradient(to right, #14b8a6, #10b981)",
  "linear-gradient(to right, #06b6d4, #3b82f6)",
  "linear-gradient(to right, #eab308, #f59e0b)",
  "linear-gradient(to right, #f43f5e, #ef4444)",
  "linear-gradient(to right, #84cc16, #22c55e)",
  "linear-gradient(to right, #ec4899, #f43f5e)",
  "linear-gradient(to right, #3b82f6, #6366f1)",
];
const categoryColors = {};
const getCategoryColor = (id) => {
  if (categoryStyles[id]) {
    return categoryStyles[id];
  }
  if (!categoryColors[id]) {
    categoryColors[id] =
      randomStyles[Math.floor(Math.random() * randomStyles.length)];
  }
  return categoryColors[id];
};
const getCategoryIcon = (name) => {
  const categoryName = name.toLowerCase();
  if (categoryName.includes("beverage") || categoryName.includes("drink")) {
    return "fa-bottle-water";
  }
  if (categoryName.includes("fruit") || categoryName.includes("apple")) {
    return "fa-apple-whole";
  }
  if (categoryName.includes("vegetable") || categoryName.includes("veggie")) {
    return "fa-carrot";
  }
  if (categoryName.includes("bread") || categoryName.includes("bakery")) {
    return "fa-bread-slice";
  }
  if (
    categoryName.includes("dairy") ||
    categoryName.includes("milk") ||
    categoryName.includes("cheese") ||
    categoryName.includes("yogurt")
  ) {
    return "fa-cheese";
  }
  if (
    categoryName.includes("meat") ||
    categoryName.includes("beef") ||
    categoryName.includes("pork") ||
    categoryName.includes("chicken")
  ) {
    return "fa-drumstick-bite";
  }
  if (categoryName.includes("frozen")) {
    return "fa-snowflake";
  }
  if (
    categoryName.includes("snack") ||
    categoryName.includes("cookie") ||
    categoryName.includes("chips")
  ) {
    return "fa-cookie-bite";
  }
  if (categoryName.includes("sauce") || categoryName.includes("condiment")) {
    return "fa-bottle-droplet";
  }
  if (categoryName.includes("cereal") || categoryName.includes("breakfast")) {
    return "fa-bowl-food";
  }
  return "fa-utensils";
};
export class ProductScannerUI {
  constructor(api) {
    this.api = api;
    this.searchInput = document.getElementById("product-search-input");
    this.searchButton = document.getElementById("search-product-btn");
    this.productsGrid = document.getElementById("products-grid");
    this.productDetailModal = document.getElementById("product-detail-modal");
    this.productsCount = document.getElementById("products-count");
    this.productsEmpty = document.getElementById("products-empty");
    this.productsLoading = document.getElementById("products-loading");
    this.searchButton.addEventListener("click", () => {
      this.searchProducts();
    });
    this.barcodeInput = document.getElementById("barcode-input");
    this.lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
    this.lookupBarcodeBtn.addEventListener("click", () => {
      this.lookupBarcode();
    });
    this.products = [];
    this.currentGrade = "";
    this.nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");

    this.nutriScoreFilters.forEach((button) => {
      button.addEventListener("click", () => {
        const grade = button.dataset.grade;

        this.filterByNutriScore(grade);
      });
    });
    this.productCategories = document.getElementById("product-categories");
    this.productModalImage = document.getElementById("product-modal-image");
    this.productModalBrand = document.getElementById("product-modal-brand");
    this.productModalName = document.getElementById("product-modal-name");
    this.productModalNutriScore = document.getElementById(
      "product-modal-nutri-score",
    );
    this.productModalNutriLabel = document.getElementById(
      "product-modal-nutri-label",
    );
    this.productModalNova = document.getElementById("product-modal-nova");
    this.productModalNovaLabel = document.getElementById(
      "product-modal-nova-label",
    );
    this.productModalCalories = document.getElementById(
      "product-modal-calories",
    );
    this.productModalProtein = document.getElementById("product-modal-protein");
    this.productModalProteinBar = document.getElementById(
      "product-modal-protein-bar",
    );
    this.productModalCarbs = document.getElementById("product-modal-carbs");
    this.productModalCarbsBar = document.getElementById(
      "product-modal-carbs-bar",
    );
    this.productModalFat = document.getElementById("product-modal-fat");
    this.productModalFatBar = document.getElementById("product-modal-fat-bar");
    this.productModalSugar = document.getElementById("product-modal-sugar");
    this.productModalSugarBar = document.getElementById(
      "product-modal-sugar-bar",
    );
    this.productModalSaturatedFat = document.getElementById(
      "product-modal-saturated-fat",
    );
    this.productModalFiber = document.getElementById("product-modal-fiber");
    this.productModalSodium = document.getElementById("product-modal-sodium");
    this.productDetailModal
      .querySelectorAll(".close-product-modal")
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.closeProductModal();
        });
      });
    this.productDetailModal
      .querySelector(".add-product-to-log")
      .addEventListener("click", () => {
        this.logProduct();
      });
  }
  async searchProducts() {
    const query = this.searchInput.value.trim();
    if (!query) {
      return;
    }
    try {
      this.productsEmpty.classList.add("hidden");
      this.productsLoading.classList.remove("hidden");
      this.productsGrid.innerHTML = "";
      this.productsCount.textContent = "Searching...";
      const data = await this.api.searchProducts(query);
      this.products = data.results;
      console.log("Products:", data);
      this.renderProducts(data.results);
      this.productsCount.textContent = `${data.results.length} products found`;
    } catch (error) {
      console.error("Failed to search products:", error);
      this.productsCount.textContent = "Failed to load products";
    }
  }
  async lookupBarcode() {
    const barcode = this.barcodeInput.value.trim();
    if (!barcode) {
      return;
    }
    try {
      this.productsEmpty.classList.add("hidden");
      this.productsLoading.classList.remove("hidden");
      this.productsGrid.innerHTML = "";

      this.productsCount.textContent = "Looking up product...";

      const product = await this.api.getProductByBarcode(barcode);

      console.log("Barcode Product:", product);
      console.log("Barcode Nutrients:", product.nutrients);
      console.log("Barcode Result Keys:", Object.keys(product));

      this.products = [product];

      this.productsLoading.classList.add("hidden");

      this.renderProducts(this.products);

      this.productsCount.textContent = "1 product found";
    } catch (error) {
      console.error("Failed to lookup product:", error);
      this.productsLoading.classList.add("hidden");
      this.productsGrid.innerHTML = "";
      this.productsEmpty.classList.remove("hidden");
      this.productsCount.textContent = "Product not found";
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Product not found in database",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  }

  formatNutrient(value) {
    if (value === null || value === undefined) {
      return 0;
    }

    return Number(value.toFixed(1));
  }
  renderProducts(products) {
    this.productsLoading.classList.add("hidden");
    if (!products.length) {
      this.productsEmpty.classList.remove("hidden");
      this.productsGrid.classList.remove("hidden");
      this.productsGrid.innerHTML = "";
      return;
    }
    this.productsEmpty.classList.add("hidden");
    this.productsGrid.classList.remove("hidden");
    this.productsGrid.innerHTML = products
      .map((product) => {
        const nutrients = product.nutrients || {};
        return `
        <div
          class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          data-barcode="${product.barcode}"
        >
          <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
  class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
  src="${product.image || "./src/images/unknown-product.jpg"}"
  alt="${product.name}"
  loading="lazy"
  onerror="this.onerror=null; this.src='./src/images/unknown-product.jpg';"
/>
            <!-- Nutri-Score -->
            <div
              class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
            >
              Nutri-Score ${product.nutritionGrade?.toUpperCase() || "N/A"}
            </div>
            <!-- NOVA -->
            ${
              product.novaGroup
                ? `
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${product.novaGroup}"
                  >
                    ${product.novaGroup}
                  </div>
                `
                : ""
            }
          </div>
          <div class="p-4">
            <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
              ${product.brand || "Unknown Brand"}
            </p>
            <h3
              class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
            >
              ${product.name}
            </h3>
            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span>
                <i class="fa-solid fa-barcode mr-1"></i>
                ${product.barcode}
              </span>
              <span>
                <i class="fa-solid fa-fire mr-1"></i>
               ${this.formatNutrient(nutrients.calories)} kcal
              </span>
            </div>
            <!-- Mini Nutrition -->
            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">
                 ${this.formatNutrient(product.nutrition?.protein ?? 0)}g
                </p>
                <p class="text-[10px] text-gray-500">
                  Protein
                </p>
              </div>
              <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">
                 ${this.formatNutrient(product.nutrients?.carbs ?? 0)}g
                </p>
                <p class="text-[10px] text-gray-500">
                  Carbs
                </p>
              </div>
              <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">
                  ${this.formatNutrient(product.nutrients?.fat ?? 0)}g
                </p>
                <p class="text-[10px] text-gray-500">
                  Fat
                </p>
              </div>
              <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">
                  ${this.formatNutrient(product.nutrients?.sugar ?? 0)}g
                </p>
                <p class="text-[10px] text-gray-500">
                  Sugar
                </p>
              </div>
            </div>
          </div>
        </div>
       `;
      })
      .join("");
    this.productsGrid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const barcode = card.dataset.barcode;

        const product = this.products.find((item) => item.barcode === barcode);

        if (product) {
          this.openProductModal(product);
        }
      });
    });
  }
  filterByNutriScore(grade) {
    this.currentGrade = grade;

    const filteredProducts = grade
      ? this.products.filter(
          (product) => product.nutritionGrade?.toLowerCase() === grade,
        )
      : this.products;

    this.renderProducts(filteredProducts);

    this.productsCount.textContent = `${filteredProducts.length} products found`;
  }
  async loadCategories() {
    try {
      const data = await this.api.getProductCategories();

      console.log("Product Categories:", data);

      this.renderCategories(data.results);
    } catch (error) {
      console.error("Failed to load product categories:", error);
    }
  }

  renderCategories(categories) {
    this.productCategories.innerHTML = categories
      .map(
        (category) => `
        <button
          class="product-category-btn flex-shrink-0 px-5 py-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          style="background: ${getCategoryColor(category.id)};"
          data-category="${category.id}"
        >
          <i class="fa-solid ${getCategoryIcon(category.name)} mr-2"></i>
          ${category.name}
        </button>
      `,
      )
      .join("");

    this.productCategories

      .querySelectorAll(".product-category-btn")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const category = button.dataset.category;

          this.loadProductsByCategory(category);
        });
      });
    this.setupCategoryScroll();
  }

  async loadProductsByCategory(category) {
    try {
      this.productsEmpty.classList.add("hidden");
      this.productsLoading.classList.remove("hidden");
      this.productsGrid.innerHTML = "";

      this.productsCount.textContent = "Loading products...";

      const data = await this.api.getProductsByCategory(category);

      console.log("Category Products:", data);

      this.products = data.results;

      this.renderProducts(this.products);

      this.productsCount.textContent = `${data.results.length} products found`;
    } catch (error) {
      console.error("Failed to load products by category:", error);

      this.productsLoading.classList.add("hidden");
      this.productsGrid.innerHTML = "";

      this.productsEmpty.classList.remove("hidden");

      this.productsCount.textContent = "Failed to load products";
    }
  }
  setupCategoryScroll() {
    const container = this.productCategories;

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startScrollLeft = 0;

    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      hasMoved = false;
      startX = e.pageX;
      startScrollLeft = container.scrollLeft;
      container.classList.remove("cursor-grab");
      container.classList.add("cursor-grabbing");
    });
    container.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const distance = e.pageX - startX;
      if (Math.abs(distance) > 5) {
        hasMoved = true;
      }
      if (hasMoved) {
        e.preventDefault();
        container.scrollLeft = startScrollLeft - distance;
      }
    });
    container.addEventListener("mouseup", () => {
      isDragging = false;
      container.classList.remove("cursor-grabbing");
      container.classList.add("cursor-grab");
    });

    container.addEventListener("mouseleave", () => {
      isDragging = false;

      container.classList.remove("cursor-grabbing");
      container.classList.add("cursor-grab");
    });

    // منع click الناتج عن عملية السحب
    container.addEventListener(
      "click",
      (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          hasMoved = false;
        }
      },
      true,
    );
  }

  openProductModal(product) {
    // console.log("Selected product:", product);
    this.selectedProduct = product;
    const nutrients = product.nutrients || {};

    // Basic information
    this.productModalImage.src =
      product.image || "./src/images/unknown-product.jpg";

    this.productModalImage.alt = product.name || "Unknown Product";

    this.productModalBrand.textContent = product.brand || "Unknown Brand";

    this.productModalName.textContent = product.name || "Unknown Product";

    // Nutri-Score
    const grade = product.nutritionGrade?.toUpperCase() || "N/A";

    this.productModalNutriScore.textContent = grade;

    this.productModalNutriLabel.textContent = this.getNutriScoreLabel(
      product.nutritionGrade,
    );

    // NOVA
    this.productModalNova.textContent = product.novaGroup || "N/A";

    this.productModalNovaLabel.textContent = this.getNovaLabel(
      product.novaGroup,
    );

    // Calories
    this.productModalCalories.textContent = this.formatNutrient(
      nutrients.calories,
    );

    // Main nutrients
    this.productModalProtein.textContent = `${this.formatNutrient(nutrients.protein)}g`;

    this.productModalCarbs.textContent = `${this.formatNutrient(nutrients.carbs)}g`;

    this.productModalFat.textContent = `${this.formatNutrient(nutrients.fat)}g`;

    this.productModalSugar.textContent = `${this.formatNutrient(nutrients.sugar)}g`;

    // Progress bars
    this.productModalProteinBar.style.width = `${this.getNutritionPercentage(nutrients.protein, 50)}%`;

    this.productModalCarbsBar.style.width = `${this.getNutritionPercentage(nutrients.carbs, 100)}%`;

    this.productModalFatBar.style.width = `${this.getNutritionPercentage(nutrients.fat, 50)}%`;

    this.productModalSugarBar.style.width = `${this.getNutritionPercentage(nutrients.sugar, 50)}%`;

    // Additional nutrients
    // this.productModalSaturatedFat.textContent = "N/A";

    this.productModalFiber.textContent = `${this.formatNutrient(nutrients.fiber)}g`;

    this.productModalSodium.textContent = `${this.formatNutrient(nutrients.sodium)}g`;

    // Show modal
    this.productDetailModal.classList.remove("hidden");
    this.productDetailModal.classList.add("flex");
  }
  getNutritionPercentage(value, max) {
    if (!value || value <= 0) {
      return 0;
    }
    return Math.min((value / max) * 100, 100);
  }
  getNutriScoreLabel(grade) {
    const labels = {
      a: "Excellent",
      b: "Good",
      c: "Average",
      d: "Poor",
      e: "Very Poor",
    };
    return labels[grade?.toLowerCase()] || "Unknown";
  }
  getNovaLabel(novaGroup) {
    const labels = {
      1: "Unprocessed",
      2: "Processed Ingredients",
      3: "Processed",
      4: "Ultra-processed",
    };

    return labels[novaGroup] || "Unknown";
  }
  closeProductModal() {
    this.productDetailModal.classList.add("hidden");
    this.productDetailModal.classList.remove("flex");
  }
  logProduct() {
    const product = this.selectedProduct;
    const nutrients = product.nutrients;

    const loggedProduct = {
      id: product.barcode,
      name: product.name,
      image: product.image,
      type: "product",
      servings: 1,
      calories: Math.round(nutrients.calories),
      protein: Math.round(nutrients.protein),
      carbs: Math.round(nutrients.carbs),
      fat: Math.round(nutrients.fat),
      loggedAt: Date.now(),
    };

    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]");

    loggedMeals.push(loggedProduct);

    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));

    console.log("Saved Food:", loggedMeals);

    this.closeProductModal();

    Swal.fire({
      icon: "success",
      title: "Food Logged!",
      html: `
      <p>
        ${loggedProduct.name} has been added to your daily log.
      </p>
      <p class="font-bold text-emerald-600 mt-2">
        +${loggedProduct.calories} calories
      </p>
    `,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = `
    fixed bottom-5 right-5 z-[9999]
    bg-red-500 text-white
    px-6 py-4
    rounded-xl
    shadow-lg
    font-semibold
    animate-[fadeIn_0.3s_ease-out]
  `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1000);
  }
}

/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
import Router from "./router.js";
import { ApiService } from "./api.js";
import {
  createMealCard,
  createCategoryCard,
  createAreaButton,
  createEmptyState,
  createLoadingSpinner,
  MealDetailsUI,
} from "./ui/components.js";
import { FoodLogUI } from "./ui/foodLog.js";
import { ProductScannerUI } from "./ui/productScanner.js";

const BASE_URL = "https://nutriplan-api.vercel.app/api";
const api = new ApiService(BASE_URL);

let allCategories = [];
let showAllCategories = false;
let selectedArea = "all";
const mealDetailsUI = new MealDetailsUI();
const foodLogUI = new FoodLogUI();
const productScannerUI = new ProductScannerUI(api);
productScannerUI.loadCategories();
foodLogUI.loadMeals();
function showLoading() {
  const recipesGrid = document.getElementById("recipes-grid");
  recipesGrid.innerHTML = createLoadingSpinner();
}

// document.querySelectorAll(".page-btn").forEach((button) => {
//   button.addEventListener("click", (event) => {
//     event.preventDefault();
//     const page = button.dataset.page;
//     if (page === "meals") {
//       showMeals();
//     }
//     if (page === "foodlog") {
//       showFoodLog();
//     }
//     if (page === "scanner") {
//       showScanner();
//     }
//   });
// });

async function getMeals() {
  try {
    showLoading();
    const meals = await api.getMeals();
    renderMeals(meals);
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}
async function getCategories() {
  try {
    showLoading();
    const categories = await api.getCategories();
    allCategories = categories;
    renderCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}
function renderMeals(meals) {
  const recipesGrid = document.getElementById("recipes-grid");

  if (!meals || meals.length === 0) {
    recipesGrid.innerHTML = createEmptyState("No meals found");
    return;
  }

  recipesGrid.innerHTML = meals.map(createMealCard).join("");
}
function renderCategories() {
  const categoriesGrid = document.getElementById("categories-grid");

  const categoriesToShow = showAllCategories
    ? allCategories
    : allCategories.slice(0, 12);

  categoriesGrid.innerHTML = categoriesToShow.map(createCategoryCard).join("");
}
function setupCategoryViewAll() {
  const viewAllButton = document.getElementById("view-all-categories");

  viewAllButton.addEventListener("click", () => {
    showAllCategories = !showAllCategories;

    renderCategories();

    viewAllButton.firstChild.textContent = showAllCategories
      ? " View Less "
      : " View All ";

    viewAllButton.querySelector("i").className = showAllCategories
      ? "fa-solid fa-chevron-up text-xs"
      : "fa-solid fa-chevron-right text-xs";
  });
}
function setupCategoryFilter() {
  const categoriesGrid = document.getElementById("categories-grid");

  categoriesGrid.addEventListener("click", (event) => {
    const categoryCard = event.target.closest(".category-card");

    if (!categoryCard) return;

    const category = categoryCard.dataset.category;

    filterMealsByCategory(category);
  });
}
async function filterMealsByCategory(category) {
  try {
    showLoading();
    const meals = await api.getMealsByCategory(category);
    renderMeals(meals);
  } catch (error) {
    console.error("Failed to filter meals by category:", error);
  }
}
async function getAreas() {
  try {
    showLoading();
    const areas = await api.getAreas();
    const areasFilter = document.getElementById("areas-filter");
    // const areasToShow = areas.slice(0, 15);
    const areasToShow = [...areas].sort(() => Math.random() - 0.5).slice(0, 20);
    areasFilter.innerHTML =
      `
        <button
          class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
          data-area="all"
        >
          All Recipes
        </button>
      ` + areasToShow.map(createAreaButton).join("");

    setActiveArea(selectedArea);
  } catch (error) {
    console.error("Failed to load areas:", error);
  }
}
function setActiveArea(area) {
  const areasFilter = document.getElementById("areas-filter");

  const buttons = areasFilter.querySelectorAll("[data-area]");

  buttons.forEach((button) => {
    if (button.dataset.area === area) {
      button.classList.remove("bg-gray-100", "text-gray-700");

      button.classList.add("bg-emerald-600", "text-white");
    } else {
      button.classList.remove("bg-emerald-600", "text-white");

      button.classList.add("bg-gray-100", "text-gray-700");
    }
  });
}
function setupAreaDrag() {
  const areasFilter = document.getElementById("areas-filter");

  let isDragging = false;
  let startX;
  let scrollLeft;
  areasFilter.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.pageX - areasFilter.offsetLeft;
    scrollLeft = areasFilter.scrollLeft;
  });
  areasFilter.addEventListener("mouseleave", () => {
    isDragging = false;
  });
  areasFilter.addEventListener("mouseup", () => {
    isDragging = false;
  });
  areasFilter.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - areasFilter.offsetLeft;
    const walk = (x - startX) * 2;
    areasFilter.scrollLeft = scrollLeft - walk;
  });
}
async function filterMealsByArea(area) {
  try {
    showLoading();

    const meals = await api.getMealsByArea(area);

    renderMeals(meals);
  } catch (error) {
    console.error("Failed to filter meals by area:", error);
  }
}
function setupAreaFilter() {
  const areasFilter = document.getElementById("areas-filter");

  areasFilter.addEventListener("click", (event) => {
    const areaButton = event.target.closest("[data-area]");

    if (!areaButton) return;

    const area = areaButton.dataset.area;

    selectedArea = area;

    setActiveArea(area);

    if (area === "all") {
      getMeals();
      return;
    }

    filterMealsByArea(area);
  });
}
async function searchMeals(query) {
  try {
    showLoading();

    const normalizedQuery = query.toLowerCase();

    if (selectedArea === "all") {
      const meals = await api.searchMeals(normalizedQuery);

      renderMeals(meals);
      return;
    }

    const meals = await api.getMealsByArea(selectedArea);

    const filteredMeals = meals.filter((meal) =>
      meal.name.toLowerCase().includes(normalizedQuery),
    );

    renderMeals(filteredMeals);
  } catch (error) {
    console.error("Failed to search meals:", error);
  }
}
function setupSearch() {
  const searchInput = document.getElementById("search-input");

  let searchTimeout;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    clearTimeout(searchTimeout);

    if (!query) {
      getMeals();
      return;
    }

    searchTimeout = setTimeout(() => {
      searchMeals(query);
    }, 200);
  });
}
function setupMealCards() {
  const recipesGrid = document.getElementById("recipes-grid");
  recipesGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-meal-id]");
    if (!card) return;
    const mealId = card.dataset.mealId;
    const mealSlug = card.dataset.mealSlug;
    router.navigateToMeal(mealSlug);
    loadMealDetails(mealId);
  });
}
async function loadMealDetails(mealId) {
  try {
    const meal = await api.getMealById(mealId);
    // console.log("Meal Details:", meal);
    // Show meal details immediately
    mealDetailsUI.render(meal);
    mealDetailsUI.renderNutritionLoading();
    const mealDetails = document.getElementById("meal-details");
    mealDetails.classList.remove("hidden");
    // Hide meals sections
    document.getElementById("search-filters-section").classList.add("hidden");
    document.getElementById("meal-categories-section").classList.add("hidden");
    document.getElementById("all-recipes-section").classList.add("hidden");
    // Prepare nutrition ingredients
    const nutritionIngredients = meal.ingredients.map(
      (item) => `${item.measure} ${item.ingredient}`,
    );
    // Get nutrition in the background
    const nutrition = await api.analyzeNutrition(
      meal.name,
      nutritionIngredients,
      "Vl92oiVf6dzLhkDBqmrPd3Fj5YKgNXhPdJAiDZDP",
    );
    console.log("Meal Nutrition:", nutrition);
    console.log("Per Serving:", nutrition.perServing);
    mealDetailsUI.currentMeal = meal;
    mealDetailsUI.currentNutrition = nutrition;
    mealDetailsUI.currentServings = 1;
    // Update nutrition only
    mealDetailsUI.renderNutrition(nutrition);
  } catch (error) {
    console.error("Failed to load meal details:", error);
  }
}
async function loadMealBySlug(slug) {
  try {
    showMealDetails();

    const meals = await api.getMeals();

    const meal = meals.find((item) => {
      const mealSlug = item.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      return mealSlug === slug;
    });

    if (!meal) {
      console.error("Meal not found:", slug);
      showMeals();
      return;
    }

    await loadMealDetails(meal.id);
  } catch (error) {
    console.error("Failed to load meal by slug:", error);
  }
}
function showMealDetails() {
  document.getElementById("search-filters-section").classList.add("hidden");
  document.getElementById("meal-categories-section").classList.add("hidden");
  document.getElementById("all-recipes-section").classList.add("hidden");
  document.getElementById("meal-details").classList.remove("hidden");
  document.getElementById("page-title").textContent = "Recipe Details";
  document.getElementById("page-subtitle").textContent =
    "View full recipe information and nutrition facts";
}
function mealDetailsBackButton() {
  const backButton = document.getElementById("back-to-meals-btn");
  backButton.addEventListener("click", () => {
    document.getElementById("meal-details").classList.add("hidden");
    document
      .getElementById("search-filters-section")
      .classList.remove("hidden");
    document
      .getElementById("meal-categories-section")
      .classList.remove("hidden");
    document.getElementById("all-recipes-section").classList.remove("hidden");
    document.getElementById("page-title").textContent = "Meals & Recipes";
    document.getElementById("page-subtitle").textContent =
      "Discover delicious and nutritious recipes tailored for you";
  });
}
function showFoodLog() {
  document.getElementById("search-filters-section").classList.add("hidden");
  document.getElementById("meal-categories-section").classList.add("hidden");
  document.getElementById("all-recipes-section").classList.add("hidden");
  document.getElementById("meal-details").classList.add("hidden");

  document.getElementById("foodlog-section").classList.remove("hidden");
  document.getElementById("products-section").classList.add("hidden");

  foodLogUI.loadMeals();
}
// function showMeals() {
//   document.getElementById("foodlog-section").classList.add("hidden");

//   document.getElementById("search-filters-section").classList.remove("hidden");
//   document.getElementById("meal-categories-section").classList.remove("hidden");
//   document.getElementById("all-recipes-section").classList.remove("hidden");
//   document.getElementById("products-section").classList.add("hidden");
// }
function showMeals() {
  document.getElementById("foodlog-section").classList.add("hidden");
  document.getElementById("meal-details").classList.add("hidden");

  document.getElementById("search-filters-section").classList.remove("hidden");

  document.getElementById("meal-categories-section").classList.remove("hidden");

  document.getElementById("all-recipes-section").classList.remove("hidden");

  document.getElementById("products-section").classList.add("hidden");

  document.getElementById("page-title").textContent = "Meals & Recipes";
  document.getElementById("page-subtitle").textContent =
    "Discover delicious and nutritious recipes tailored for you";
}
function showScanner() {
  document.getElementById("foodlog-section").classList.add("hidden");
  document.getElementById("meal-details").classList.add("hidden");
  document.getElementById("search-filters-section").classList.add("hidden");
  document.getElementById("meal-categories-section").classList.add("hidden");
  document.getElementById("all-recipes-section").classList.add("hidden");
  document.getElementById("products-section").classList.remove("hidden");
}
const router = new Router({
  meals: showMeals,
  foodlog: showFoodLog,
  scanner: showScanner,
  meal: loadMealBySlug,
});
function setupMobileMenu() {
  const menuButton = document.getElementById("header-menu-btn");
  const closeButton = document.getElementById("sidebar-close-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!menuButton || !closeButton || !sidebar || !overlay) return;
  const openMenu = () => {
    sidebar.classList.add("open");
    overlay.classList.add("open");
  };
  const closeMenu = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  };
  menuButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
}
function setupViewToggle() {
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");
  const recipesGrid = document.getElementById("recipes-grid");

  if (!gridViewBtn || !listViewBtn || !recipesGrid) return;

  gridViewBtn.addEventListener("click", () => {
    recipesGrid.classList.remove("flex", "flex-col");
    recipesGrid.classList.add("grid", "grid-cols-4");

    gridViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
    listViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");

    gridViewBtn.querySelector("i").classList.remove("text-gray-500");
    gridViewBtn.querySelector("i").classList.add("text-gray-700");

    listViewBtn.querySelector("i").classList.remove("text-gray-700");
    listViewBtn.querySelector("i").classList.add("text-gray-500");

    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.classList.add("list-card");

      const imageContainer = card.querySelector(".relative");
      const image = card.querySelector("img");

      if (imageContainer) {
        imageContainer.classList.remove("h-48");
        imageContainer.classList.add("w-40", "h-32", "shrink-0");
      }

      if (image) {
        image.classList.remove("w-full", "h-full");
        image.classList.add("w-full", "h-full", "object-cover");
      }
    });
  });

  listViewBtn.addEventListener("click", () => {
    recipesGrid.classList.remove("grid", "grid-cols-4");
    recipesGrid.classList.add("flex", "flex-col");

    listViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
    gridViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");

    listViewBtn.querySelector("i").classList.remove("text-gray-500");
    listViewBtn.querySelector("i").classList.add("text-gray-700");

    gridViewBtn.querySelector("i").classList.remove("text-gray-700");
    gridViewBtn.querySelector("i").classList.add("text-gray-500");

    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.classList.remove("list-card");

      const imageContainer = card.querySelector(".relative");
      const image = card.querySelector("img");

      if (imageContainer) {
        imageContainer.classList.remove("w-40", "h-32", "shrink-0");
        imageContainer.classList.add("h-48");
      }

      if (image) {
        image.classList.add("w-full", "h-full", "object-cover");
      }
    });
  });
}
setupMobileMenu();
getAreas();
getMeals();
getCategories();
setupCategoryFilter();
setupAreaFilter();
setupCategoryViewAll();
setupAreaDrag();
setupSearch();
setupMealCards();
setupViewToggle();
mealDetailsBackButton();
window.addEventListener("load", () => {
  const loadingOverlay = document.getElementById("app-loading-overlay");
  if (!loadingOverlay) return;
  loadingOverlay.classList.add("opacity-0");
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
  }, 500);
});
router.init();

// =========== Loading Spinner Design ============
/*
<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>
*/

// =========== Empty State Design ============
/*
<div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
*/
export class MealDetailsUI {
  constructor() {
    this.image = document.getElementById("meal-detail-image");
    this.name = document.getElementById("meal-detail-name");
    this.category = document.getElementById("meal-detail-category");
    this.area = document.getElementById("meal-detail-area");
    this.type = document.getElementById("meal-detail-type");
    this.time = document.getElementById("hero-time");
    this.servings = document.getElementById("hero-servings");
    this.calories = document.getElementById("hero-calories");

    this.ingredientsContainer = document.getElementById(
      "ingredients-container",
    );
    this.ingredientsCount = document.getElementById("ingredients-count");
    this.instructionsContainer = document.getElementById(
      "instructions-container",
    );
    this.video = document.getElementById("meal-detail-video");
    this.nutritionContainer = document.getElementById(
      "nutrition-facts-container",
    );
    this.logMealBtn = document.getElementById("log-meal-btn");
    this.logMealModal = document.getElementById("log-meal-modal");
    this.logMealBtn.addEventListener("click", () => {
      this.openLogMealModal();
    });
    this.currentMeal = null;
    this.currentNutrition = null;
    this.currentServings = 1;

    this.increaseServingsBtn = document.getElementById("increase-servings");
    this.decreaseServingsBtn = document.getElementById("decrease-servings");
    this.increaseServingsBtn.addEventListener("click", () => {
      this.currentServings += 0.5;
      this.updateLogMealNutrition();
    });
    this.decreaseServingsBtn.addEventListener("click", () => {
      if (this.currentServings > 1) {
        this.currentServings -= 0.5;
        this.updateLogMealNutrition();
      }
    });
    this.cancelLogMealBtn = document.getElementById("cancel-log-meal");
    this.cancelLogMealBtn.addEventListener("click", () => {
      this.closeLogMealModal();
    });
    this.confirmLogMealBtn = document.getElementById("confirm-log-meal");
    this.confirmLogMealBtn.addEventListener("click", () => {
      this.logMeal();
    });
  }

  renderIngredients(ingredients) {
    console.log("Ingredients:", ingredients);
    console.log("First ingredient:", ingredients[0]);

    this.ingredientsCount.textContent = `${ingredients.length} items`;

    this.ingredientsContainer.innerHTML = ingredients
      .map(
        (ingredient) => `
        
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900"> ${ingredient.measure}</span> ${ingredient.ingredient}
                  </span>
                </div>
      `,
      )
      .join("");
  }
  renderInstructions(instructions) {
    this.instructionsContainer.innerHTML = instructions
      .map(
        (step, index) => `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div
            class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
          >
            ${index + 1}
          </div>
          <p class="text-gray-700 leading-relaxed pt-2">
            ${step}
          </p>
        </div>
      `,
      )
      .join("");
  }
  renderNutrition(nutrition) {
    const perServing = nutrition.perServing;
    // Calculate progress bar percentages
    const proteinPercent = Math.min((perServing.protein / 50) * 100, 100);
    const carbsPercent = Math.min((perServing.carbs / 275) * 100, 100);
    const fatPercent = Math.min((perServing.fat / 78) * 100, 100);
    const fiberPercent = Math.min((perServing.fiber / 28) * 100, 100);
    const sugarPercent = Math.min((perServing.sugar / 50) * 100, 100);
    const saturatedFatPercent = Math.min(
      (perServing.saturatedFat / 20) * 100,
      100,
    );
    const cholesterolPercent = Math.min(
      (perServing.cholesterol / 300) * 100,
      100,
    );
    const sodiumPercent = Math.min((perServing.sodium / 2300) * 100, 100);
    this.nutritionContainer.innerHTML = `
    <p class="text-sm text-gray-500 mb-4">Per serving</p>

    <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
      <p class="text-sm text-gray-600">Calories per serving</p>

      <p class="text-4xl font-bold text-emerald-600">
        ${perServing.calories}
      </p>

      <p class="text-xs text-gray-500 mt-1">
        Total: ${nutrition.totals.calories} cal
      </p>
    </div>

    <div class="space-y-4">

      <!-- Protein -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-gray-700">Protein</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.protein}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-emerald-500 h-2 rounded-full transition-all duration-500"
          style="width: ${proteinPercent}%"
        ></div>
      </div>


      <!-- Carbs -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-gray-700">Carbs</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.carbs}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style="width: ${carbsPercent}%"
        ></div>
      </div>


      <!-- Fat -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <span class="text-gray-700">Fat</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.fat}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-purple-500 h-2 rounded-full transition-all duration-500"
          style="width: ${fatPercent}%"
        ></div>
      </div>


      <!-- Fiber -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-orange-500"></div>
          <span class="text-gray-700">Fiber</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.fiber}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-orange-500 h-2 rounded-full transition-all duration-500"
          style="width: ${fiberPercent}%"
        ></div>
      </div>


      <!-- Sugar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-pink-500"></div>
          <span class="text-gray-700">Sugar</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.sugar}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-pink-500 h-2 rounded-full transition-all duration-500"
          style="width: ${sugarPercent}%"
        ></div>
      </div>


      <!-- Saturated Fat -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="text-gray-700">Saturated Fat</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.saturatedFat}g
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-red-500 h-2 rounded-full transition-all duration-500"
          style="width: ${saturatedFatPercent}%"
        ></div>
      </div>


      <!-- Cholesterol -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span class="text-gray-700">Cholesterol</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.cholesterol}mg
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
          style="width: ${cholesterolPercent}%"
        ></div>
      </div>


      <!-- Sodium -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span class="text-gray-700">Sodium</span>
        </div>

        <span class="font-bold text-gray-900">
          ${perServing.sodium}mg
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-2">
        <div
          class="bg-cyan-500 h-2 rounded-full transition-all duration-500"
          style="width: ${sodiumPercent}%"
        ></div>
      </div>

    </div>
  `;
    this.servings.textContent = `${nutrition.servings} servings`;
    this.calories.textContent = `${nutrition.perServing.calories} cal/serving`;
    this.logMealBtn.disabled = false;

    this.logMealBtn.innerHTML = `
  <i class="fa-solid fa-clipboard-list"></i>
  <span>Log This Meal</span>
`;

    this.logMealBtn.classList.remove(
      "bg-gray-400",
      "opacity-60",
      "cursor-not-allowed",
    );
    // this.logMealBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
    this.logMealBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
  }
  renderNutritionLoading() {
    this.nutritionContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center py-10">
      <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-calculator text-emerald-600 text-xl animate-pulse"></i>
      </div>

      <p class="text-gray-700 text-lg font-medium">
        Calculating Nutrition
      </p>

      <p class="text-gray-400 text-sm mt-1">
        Analyzing ingredients...
      </p>

      <div class="flex gap-1 mt-4">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>
    </div>
  `;
    this.logMealBtn.disabled = true;
    this.logMealBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    <span>Calculating...</span>
  `;

    this.logMealBtn.classList.add(
      "opacity-60",
      "cursor-not-allowed",
      "bg-gray-400",
    );
    // this.logMealBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    // this.logMealBtn.classList.remove("hover:bg-blue-700");
    this.logMealBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
  }
  updateLogMealNutrition() {
    const servings = this.currentServings;
    const perServing = this.currentNutrition.perServing;

    document.getElementById("log-meal-servings").value = servings;

    document.getElementById("log-meal-calories").textContent = Math.round(
      perServing.calories * servings,
    );

    document.getElementById("log-meal-protein").textContent =
      `${Math.round(perServing.protein * servings)}g`;

    document.getElementById("log-meal-carbs").textContent =
      `${Math.round(perServing.carbs * servings)}g`;

    document.getElementById("log-meal-fat").textContent =
      `${Math.round(perServing.fat * servings)}g`;
  }

  render(meal) {
    this.image.src = meal.thumbnail;
    this.image.alt = meal.name;
    this.name.textContent = meal.name;
    this.category.textContent = meal.category;
    this.area.textContent = meal.area || "International";
    this.renderIngredients(meal.ingredients);
    this.renderInstructions(meal.instructions);
    this.video.src = meal.youtube.replace(
      "https://www.youtube.com/watch?v=",
      "https://www.youtube.com/embed/",
    );
    // this.currentMeal = meal;
    // this.currentNutrition = nutrition;
    // this.currentServings = 1;
    // this.renderNutrition(nutrition);
  }
  openLogMealModal() {
    const perServing = this.currentNutrition.perServing;
    document.getElementById("log-meal-image").src = this.currentMeal.thumbnail;
    document.getElementById("log-meal-name").textContent =
      this.currentMeal.name;

    document.getElementById("log-meal-servings").value = this.currentServings;

    document.getElementById("log-meal-calories").textContent =
      perServing.calories;

    document.getElementById("log-meal-protein").textContent =
      `${perServing.protein}g`;

    document.getElementById("log-meal-carbs").textContent =
      `${perServing.carbs}g`;

    document.getElementById("log-meal-fat").textContent = `${perServing.fat}g`;

    this.currentServings = 1;

    this.updateLogMealNutrition();

    this.logMealModal.classList.remove("hidden");
  }
  closeLogMealModal() {
    this.logMealModal.classList.add("hidden");
  }
  logMeal() {
    const perServing = this.currentNutrition.perServing;
    const servings = this.currentServings;
    const loggedMeal = {
      id: this.currentMeal.id,
      name: this.currentMeal.name,
      image: this.currentMeal.thumbnail,
      type: "meal",
      servings: servings,
      calories: Math.round(perServing.calories * servings),
      protein: Math.round(perServing.protein * servings),
      carbs: Math.round(perServing.carbs * servings),
      fat: Math.round(perServing.fat * servings),
      loggedAt: Date.now(),
    };
    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]");
    loggedMeals.push(loggedMeal);
    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
    console.log("Saved Meals:", loggedMeals);
    this.closeLogMealModal();
    Swal.fire({
      icon: "success",
      title: "Meal Logged!",
      html: `
    <p>
      ${loggedMeal.name} (${loggedMeal.servings} serving${loggedMeal.servings !== 1 ? "s" : ""})
      has been added to your daily log.
    </p>
    <p class="font-bold text-emerald-600 mt-2">
      +${loggedMeal.calories} calories
    </p>
  `,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
}
const categoryIcons = {
  Beef: "fa-drumstick-bite",
  Chicken: "fa-drumstick-bite",
  Dessert: "fa-cake-candles",
  Lamb: "fa-drumstick-bite",
  Pasta: "fa-bowl-food",
  Pork: "fa-bacon",
  Seafood: "fa-fish",
  Side: "fa-plate-wheat",
  Starter: "fa-utensils",
  Vegan: "fa-leaf",
  Vegetarian: "fa-seedling",
  Breakfast: "fa-mug-hot",
  Miscellaneous: "fa-bowl-rice",
  Goat: "fa-drumstick-bite",
};

const categoryStyles = {
  Beef: {
    bg: "from-red-50 to-rose-50",
    border: "border-red-200 hover:border-red-400",
    iconFrom: "from-red-400",
    iconTo: "to-rose-500",
    text: "text-red-600",
  },

  Chicken: {
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200 hover:border-amber-400",
    iconFrom: "from-amber-400",
    iconTo: "to-orange-500",
    text: "text-amber-600",
  },

  Dessert: {
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200 hover:border-pink-400",
    iconFrom: "from-pink-400",
    iconTo: "to-rose-500",
    text: "text-pink-600",
  },

  Lamb: {
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200 hover:border-amber-400",
    iconFrom: "from-orange-400",
    iconTo: "to-amber-500",
    text: "text-orange-600",
  },

  Miscellaneous: {
    bg: "from-slate-50 to-gray-50",
    border: "border-slate-200 hover:border-slate-400",
    iconFrom: "from-slate-400",
    iconTo: "to-gray-500",
    text: "text-slate-600",
  },

  Pasta: {
    bg: "from-yellow-50 to-amber-50",
    border: "border-yellow-200 hover:border-yellow-400",
    iconFrom: "from-yellow-400",
    iconTo: "to-amber-500",
    text: "text-yellow-600",
  },

  Pork: {
    bg: "from-rose-50 to-red-50",
    border: "border-rose-200 hover:border-red-400",
    iconFrom: "from-rose-400",
    iconTo: "to-red-500",
    text: "text-rose-600",
  },

  Seafood: {
    bg: "from-cyan-50 to-blue-50",
    border: "border-cyan-200 hover:border-blue-400",
    iconFrom: "from-cyan-400",
    iconTo: "to-blue-500",
    text: "text-cyan-600",
  },

  Side: {
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200 hover:border-emerald-400",
    iconFrom: "from-green-400",
    iconTo: "to-emerald-500",
    text: "text-green-600",
  },

  Starter: {
    bg: "from-teal-50 to-cyan-50",
    border: "border-teal-200 hover:border-cyan-400",
    iconFrom: "from-teal-400",
    iconTo: "to-cyan-500",
    text: "text-teal-600",
  },

  Vegan: {
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-200 hover:border-green-400",
    iconFrom: "from-emerald-400",
    iconTo: "to-green-500",
    text: "text-emerald-600",
  },

  Vegetarian: {
    bg: "from-lime-50 to-green-50",
    border: "border-lime-200 hover:border-green-400",
    iconFrom: "from-lime-400",
    iconTo: "to-green-500",
    text: "text-lime-600",
  },

  Breakfast: {
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200 hover:border-orange-400",
    iconFrom: "from-amber-400",
    iconTo: "to-orange-500",
    text: "text-amber-600",
  },

  Goat: {
    bg: "from-stone-50 to-amber-50",
    border: "border-stone-200 hover:border-amber-400",
    iconFrom: "from-stone-400",
    iconTo: "to-amber-500",
    text: "text-stone-600",
  },
};
export function createMealCard(meal) {
  return `
        
        <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${meal.id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${meal.thumbnail}"
                  alt="${meal.name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${meal.category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${meal.area || "International"} 
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${meal.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${meal.instructions || "No instructions available"}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                   ${meal.category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${meal.area || "International"} 
                  </span>
                </div>
              </div>
            </div>
    `;
}
export function createLoadingSpinner() {
  return `
    <div class="col-span-full flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  `;
}
export function createCategoryCard(category) {
  const icon = categoryIcons[category.name] || "fa-utensils";

  const style = categoryStyles[category.name] || {
    bg: "from-gray-50 to-slate-50",
    border: "border-gray-200 hover:border-gray-400",
    iconFrom: "from-gray-400",
    iconTo: "to-slate-500",
    text: "text-gray-600",
  };

  return `
    
    <div class="category-card bg-gradient-to-br ${style.bg} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group" data-category="${category.name}">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-gradient-to-br ${style.iconFrom} ${style.iconTo} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <i class="fa-solid ${icon} text-white text-sm"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
                </div>
            </div>
        </div>
  `;
}
export function createAreaButton(area) {
  return `
    <button
      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
      data-area="${area.name}"
    >
      ${area.name}
    </button>
  `;
}
export function createEmptyState(message = "No recipes found") {
  return `
    <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
      </div>

      <p class="text-gray-500 text-lg font-medium">
        ${message}
      </p>

      <p class="text-gray-400 text-sm mt-2">
        Try searching for something else
      </p>
    </div>
  `;
}

export class FoodLogUI {
  constructor() {
    this.loggedItemsList = document.getElementById("logged-items-list");
    this.loggedItemsCount = document.querySelector("#foodlog-today-section h4");
    this.caloriesValue = document.getElementById("foodlog-calories-value");
    this.caloriesProgress = document.getElementById(
      "foodlog-calories-progress",
    );
    this.proteinValue = document.getElementById("foodlog-protein-value");
    this.proteinProgress = document.getElementById("foodlog-protein-progress");
    this.carbsValue = document.getElementById("foodlog-carbs-value");
    this.carbsProgress = document.getElementById("foodlog-carbs-progress");
    this.fatValue = document.getElementById("foodlog-fat-value");
    this.fatProgress = document.getElementById("foodlog-fat-progress");
    this.caloriesPercent = document.getElementById("calories-percent");
    this.loggedItemsList.addEventListener("click", (event) => {
      const removeBtn = event.target.closest(".remove-entry-btn");
      if (!removeBtn) return;
      const mealId = removeBtn.dataset.entryId;
      this.removeMeal(mealId);
    });
    this.clearFoodLogBtn = document.getElementById("clear-foodlog");
    this.clearFoodLogBtn.addEventListener("click", () => {
      this.clearAllMeals();
    });
    this.weeklyChart = document.getElementById("weekly-chart");
    this.foodLogDate = document.getElementById("foodlog-date");
    this.customEntryBtn = document.querySelector('[data-page="custom"]');
    this.customEntryModal = document.getElementById("custom-entry-modal");
    this.closeCustomEntryBtn = document.getElementById("close-custom-entry");
    this.cancelCustomEntryBtn = document.getElementById("cancel-custom-entry");
    this.customEntryBtn.addEventListener("click", () => {
      this.openCustomEntryModal();
    });
    this.closeCustomEntryBtn.addEventListener("click", () => {
      this.closeCustomEntryModal();
    });

    this.cancelCustomEntryBtn.addEventListener("click", () => {
      this.closeCustomEntryModal();
    });
    this.customEntryForm = document.getElementById("custom-entry-form");

    this.customEntryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      this.addCustomMeal();
    });
  }
  updateDate() {
    const today = new Date();

    this.foodLogDate.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
  loadMeals() {
    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]");
    console.log("Logged Meals:", loggedMeals);
    this.renderMeals(loggedMeals);
    this.updateNutritionSummary(loggedMeals);
    const weeklyData = this.getWeeklyCalories(loggedMeals);
    this.renderWeeklyOverview(weeklyData);
    this.updateDate();
  }
  renderMeals(meals) {
    this.loggedItemsCount.textContent = `Logged Items (${meals.length})`;

    this.clearFoodLogBtn.style.display = meals.length > 0 ? "block" : "none";

    if (meals.length === 0) {
      this.loggedItemsList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">
          Add meals from the Meals page or scan products
        </p>
      </div>
    `;

      return;
    }
    if (meals.length === 0) {
      this.loggedItemsList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">
          Add meals from the Meals page or scan products
        </p>
      </div>
    `;
      return;
    }
    this.loggedItemsList.innerHTML = meals
      .map(
        (meal) => `
    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all" data-entry-id="1786839391712-iott1">
      <div class="flex items-center gap-4 min-w-0">
        <img
          src="${meal.image}"
          alt="${meal.name}"
          class="w-14 h-14 rounded-xl object-cover shrink-0"
        >

        <div class="min-w-0">
          <p class="font-semibold text-gray-900 truncate">
            ${meal.name}
          </p>

          <p class="text-sm text-gray-500">
            ${meal.servings}
            serving
            <span class="mx-1">•</span>
            <span class="text-emerald-600">
              ${meal.type === "product" ? "Product" : "Recipe"}
            </span>
          </p>

          <p class="text-xs text-gray-400 mt-1">
            ${new Date(meal.loggedAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="text-right">
          <p class="text-lg font-bold text-emerald-600">
            ${meal.calories}
          </p>
          <p class="text-xs text-gray-500">
            kcal
          </p>
        </div>

        <div class="hidden md:flex gap-2 text-xs text-gray-500">
          <span class="px-2 py-1 bg-blue-50 rounded">
            ${meal.protein}g P
          </span>

          <span class="px-2 py-1 bg-amber-50 rounded">
            ${meal.carbs}g C
          </span>

          <span class="px-2 py-1 bg-purple-50 rounded">
            ${meal.fat}g F
          </span>
        </div>

        <button
          class="remove-entry-btn text-gray-400 hover:text-red-500 transition-all p-2"
          data-entry-id="${meal.id}"
          aria-label="Remove entry"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `,
      )
      .join("");
  }
  updateNutritionSummary(meals) {
    const totals = meals.reduce(
      (total, meal) => {
        total.calories += meal.calories;
        total.protein += meal.protein;
        total.carbs += meal.carbs;
        total.fat += meal.fat;
        return total;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    );
    const goals = {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 65,
    };
    const caloriesPercent = Math.min(
      Math.round((totals.calories / goals.calories) * 100),
      100,
    );
    this.caloriesValue.textContent = `${totals.calories} `;

    this.proteinValue.textContent = `${totals.protein} / ${goals.protein} g`;
    this.carbsValue.textContent = `${totals.carbs} / ${goals.carbs} g`;
    this.fatValue.textContent = `${totals.fat} / ${goals.fat} g`;
    this.caloriesProgress.style.width = `${Math.min((totals.calories / goals.calories) * 100, 100)}%`;
    this.proteinProgress.style.width = `${Math.min((totals.protein / goals.protein) * 100, 100)}%`;
    this.carbsProgress.style.width = `${Math.min((totals.carbs / goals.carbs) * 100, 100)}%`;
    this.fatProgress.style.width = `${Math.min((totals.fat / goals.fat) * 100, 100)}%`;

    this.caloriesPercent.textContent = `${caloriesPercent}%`;
    // this.proteinPercent.textContent = `${proteinPercent}%`;
    // this.carbsPercent.textContent = `${carbsPercent}%`;
    // this.fatPercent.textContent = `${fatPercent}%`;
  }
  removeMeal(mealId) {
    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]");
    const updatedMeals = loggedMeals.filter(
      (meal) => String(meal.id) !== String(mealId),
    );
    localStorage.setItem("loggedMeals", JSON.stringify(updatedMeals));
    this.loadMeals();
  }
  clearAllMeals() {
    Swal.fire({
      title: "Clear Today's Log?",
      text: "This will remove all logged food items for today.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("loggedMeals");

        this.loadMeals();

        Swal.fire({
          icon: "success",
          title: "Log Cleared!",
          text: "All logged food items have been removed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  }
  getWeeklyCalories(meals) {
    const today = new Date();
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const dayCalories = meals
        .filter((meal) => {
          const loggedDate = new Date(meal.loggedAt);
          return loggedDate >= date && loggedDate < nextDate;
        })
        .reduce((total, meal) => total + meal.calories, 0);
      weeklyData.push({
        date: date,
        calories: dayCalories,
      });
    }
    return weeklyData;
  }
  renderWeeklyOverview(weeklyData) {
    const today = new Date();

    this.weeklyChart.innerHTML = weeklyData
      .map((day) => {
        const isToday = day.date.toDateString() === today.toDateString();
        const dayName = day.date.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const dayNumber = day.date.getDate();
        return `
        <div
            class="text-center rounded-xl p-2 ${isToday ? "bg-indigo-100" : ""}"
          >
            <p class="text-xs text-gray-500 mb-1">
              ${dayName}
            </p>

            <p class="text-sm font-medium text-gray-900">
              ${dayNumber}
            </p>

            <div
              class="mt-2 ${
                day.calories > 0 ? "text-emerald-600" : "text-gray-300"
              }"
            >
              <p class="text-lg font-bold">
                ${Math.round(day.calories)}
              </p>

              <p class="text-xs">
                kcal
              </p>
            </div>
          </div>
      `;
      })
      .join("");
  }
  openCustomEntryModal() {
    this.customEntryModal.classList.remove("hidden");
  }
  closeCustomEntryModal() {
    this.customEntryModal.classList.add("hidden");
  }
  addCustomMeal() {
    const meal = {
      id: `custom-${Date.now()}`,
      name: document.getElementById("custom-food-name").value.trim(),
      image: "./src/images/custom-food.svg",
      servings: Number(document.getElementById("custom-food-servings").value),
      calories: Number(document.getElementById("custom-food-calories").value),
      protein: Number(document.getElementById("custom-food-protein").value),
      carbs: Number(document.getElementById("custom-food-carbs").value),
      fat: Number(document.getElementById("custom-food-fat").value),
      loggedAt: Date.now(),
    };

    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals") || "[]");

    loggedMeals.push(meal);

    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));

    this.loadMeals();

    this.customEntryForm.reset();

    this.closeCustomEntryModal();
    Swal.fire({
      icon: "success",
      title: "Meal Added!",
      text: `${meal.name} (${meal.servings} serving) has been added to your daily log.`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
}

export default class Router {
  constructor(routes) {
    this.routes = routes;
  }

  init() {
    document.querySelectorAll(".page-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        const page = button.dataset.page;
        this.navigate(page);
      });
    });

    window.addEventListener("hashchange", () => {
      this.handleCurrentRoute();
    });

    this.handleCurrentRoute();
  }

  navigate(page) {
    const route = this.routes[page];

    if (!route) return;

    const path = page === "foodlog" ? "food-log" : page;

    window.location.hash = `/${path}`;
  }

  navigateToMeal(slug) {
    window.location.hash = `/meal/${slug}`;
  }

  handleCurrentRoute() {
    const hash = window.location.hash.replace("#/", "");

    const mealMatch = hash.match(/^meal\/(.+)$/);

    if (mealMatch) {
      const mealSlug = mealMatch[1];

      if (this.routes.meal) {
        this.routes.meal(mealSlug);
      }

      this.updateActiveLink("meal");

      return;
    }

    const pageMap = {
      meals: "meals",
      scanner: "scanner",
      "food-log": "foodlog",
    };

    const page = pageMap[hash] || "meals";
    const route = this.routes[page];

    if (route) {
      route();
      this.updateActiveLink(page);
    }
  }
  updateActiveLink(page) {
    const links = document.querySelectorAll(".page-btn");

    links.forEach((link) => {
      const isActive =
        link.dataset.page === page ||
        (page === "meal" && link.dataset.page === "meals");

      link.classList.toggle("bg-emerald-50", isActive);
      link.classList.toggle("text-emerald-700", isActive);

      link.classList.toggle("text-gray-600", !isActive);

      const text = link.querySelector("span");

      if (text) {
        text.classList.toggle("font-semibold", isActive);
        text.classList.toggle("font-medium", !isActive);
      }
    });
  }
}

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

  handleCurrentRoute() {
    const hash = window.location.hash.replace("#/", "");

    const pageMap = {
      meals: "meals",
      scanner: "scanner",
      "food-log": "foodlog",
    };

    const page = pageMap[hash] || "meals";
    const route = this.routes[page];

    if (route) {
      route();
    }
  }
}

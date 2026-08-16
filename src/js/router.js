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

    window.location.hash = page;
  }

  handleCurrentRoute() {
    const hash = window.location.hash.replace("#/", "").replace("#", "");

    const page = hash || "meals";
    const route = this.routes[page];

    if (route) {
      route();
    } else {
      window.location.hash = "meals";
    }
  }
}

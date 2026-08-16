export class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async getMeals() {
    try {
      const response = await fetch(
        `${this.baseUrl}/meals/search?q=chicken&page=1&limit=25`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      throw error;
    }
  }
  async searchMeals(query) {
    try {
      const response = await fetch(
        `${this.baseUrl}/meals/search?q=${encodeURIComponent(query)}&page=1&limit=25`,
      );

      if (!response.ok) {
        throw new Error("Failed to search meals");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to search meals:", error);
      throw error;
    }
  }
  async getMealsByArea(area) {
    try {
      const response = await fetch(
        `${this.baseUrl}/meals/filter?area=${encodeURIComponent(area)}&limit=25`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals by area");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to fetch meals by area:", error);
      throw error;
    }
  }
  async getMealsByCategory(category) {
    try {
      const response = await fetch(
        `${this.baseUrl}/meals/filter?category=${encodeURIComponent(category)}&limit=25`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals by category");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to fetch meals by category:", error);
      throw error;
    }
  }
  async getCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/meals/categories`);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }
  async getAreas() {
    try {
      const response = await fetch(`${this.baseUrl}/meals/areas`);

      if (!response.ok) {
        throw new Error("Failed to fetch areas");
      }

      const data = await response.json();

      return data.results;
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      throw error;
    }
  }
  async getMealById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/meals/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch meal details");
      }

      const data = await response.json();

      return data.result;
    } catch (error) {
      console.error("Failed to fetch meal details:", error);
      throw error;
    }
  }
  async analyzeNutrition(recipeName, ingredients, apiKey) {
    const response = await fetch(`${this.baseUrl}/nutrition/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        recipeName,
        ingredients,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to analyze nutrition");
    }

    return data.data;
  }
  async searchProducts(query) {
    const response = await fetch(
      `${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    const data = await response.json();

    return data;
  }
  async getProductByBarcode(barcode) {
    const url = `${this.baseUrl}/products/barcode/${barcode}`;
    console.log("Looking up product:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to lookup product. Status: ${response.status} - ${errorText}`,
      );
    }
    const data = await response.json();
    console.log("Product data:", data);
    return data.result;
  }
  async getProductCategories(page = 1, limit = 50) {
    const response = await fetch(
      `${this.baseUrl}/products/categories?page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load product categories");
    }

    const data = await response.json();

    return data;
  }
  async getProductsByCategory(category, page = 1, limit = 24) {
    const response = await fetch(
      `${this.baseUrl}/products/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load products by category");
    }

    const data = await response.json();

    return data;
  }
}

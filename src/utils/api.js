const API_BASE_URL = "http://localhost:8081/api/v1";

export const api = {
  // Categories API
  async getAllCategories() {
    const res = await fetch(`${API_BASE_URL}/category/getAll`,{
       next:{
        revalidate:60
      }
    });
    const data = await res.json();
    return data.data || [];
  },

  async getCategoryByName(name) {
    const res = await fetch(`${API_BASE_URL}/category/getOne/${encodeURIComponent(name)}`);
    if (res.status === 404) return null;
    const data = await res.json();
    return data.data;
  },

  async saveCategory(category) {
    const res = await fetch(`${API_BASE_URL}/category/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    return res.json();
  },

  async updateCategory(category) {
    const res = await fetch(`${API_BASE_URL}/category/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/category/delete/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // News API
  async getAllNews() {
    const res = await fetch(`${API_BASE_URL}/news/getAll`,{
      next:{
        revalidate:60
      }
    });
    const data = await res.json();
    return data.data || [];
  },

  async getNewsById(id) {
    const res = await fetch(`${API_BASE_URL}/news/getOne/${id}`);
    if (res.status === 404) return null;
    const data = await res.json();
    return data.data;
  },

  async saveNews(news) {
    const res = await fetch(`${API_BASE_URL}/news/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(news),
    });
    return res.json();
  },

  async updateNews(news) {
    const res = await fetch(`${API_BASE_URL}/news/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(news),
    });
    return res.json();
  },

  async deleteNews(id) {
    const res = await fetch(`${API_BASE_URL}/news/delete/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

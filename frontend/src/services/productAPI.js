// API Base URL - Adjust theo environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Product API Service
 */
export const productAPI = {
  /**
   * Search products realtime
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} Array of search results
   */
  search: async (keyword) => {
    if (!keyword || !keyword.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  },

  /**
   * Get product by slug
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Product details
   */
  getBySlug: async (slug) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${slug}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  /**
   * Get all products with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of products
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },
};

export default productAPI;

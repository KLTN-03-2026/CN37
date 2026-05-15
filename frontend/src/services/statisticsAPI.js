import axios from "axios";

const API_BASE_URL = "http://localhost:5235/api/statistics";

const statisticsAPI = {
  // Dashboard
  getDashboardSummary: () =>
    axios.get(`${API_BASE_URL}/dashboard`),

  // Revenue Statistics
  getRevenueStatistics: (type = "daily", fromDate = null, toDate = null) => {
    const params = new URLSearchParams();
    params.append("type", type);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    return axios.get(`${API_BASE_URL}/revenue?${params.toString()}`);
  },

  // Profit Statistics
  getProfitStatistics: (type = "daily", fromDate = null, toDate = null) => {
    const params = new URLSearchParams();
    params.append("type", type);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    return axios.get(`${API_BASE_URL}/profit?${params.toString()}`);
  },

  // Import Cost Statistics
  getImportCostStatistics: (type = "daily", fromDate = null, toDate = null) => {
    const params = new URLSearchParams();
    params.append("type", type);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    return axios.get(`${API_BASE_URL}/import-cost?${params.toString()}`);
  },

  // Product Analytics
  getProductAnalytics: (pageNumber = 1, pageSize = 50) =>
    axios.get(`${API_BASE_URL}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getProductAnalyticsById: (productId) =>
    axios.get(`${API_BASE_URL}/products/${productId}`),

  // Top Products
  getTopSellingProducts: (topCount = 10) =>
    axios.get(`${API_BASE_URL}/top-selling?topCount=${topCount}`),

  getTopProfitProducts: (topCount = 10) =>
    axios.get(`${API_BASE_URL}/top-profit-products?topCount=${topCount}`),

  // Category Revenue
  getRevenuByCategory: (fromDate = null, toDate = null) => {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    return axios.get(`${API_BASE_URL}/category-revenue?${params.toString()}`);
  },

  // Comparisons
  compareCurrentVsPreviousMonth: () =>
    axios.get(`${API_BASE_URL}/comparison/month`),

  compareCurrentVsPreviousYear: () =>
    axios.get(`${API_BASE_URL}/comparison/year`),

  // KPI Cards
  getKpiCards: () =>
    axios.get(`${API_BASE_URL}/kpi-cards`),

  // Export
  exportToExcel: (data) =>
    axios.post(`${API_BASE_URL}/export/excel`, data, {
      responseType: "blob",
    }),

  exportToPdf: (data) =>
    axios.post(`${API_BASE_URL}/export/pdf`, data, {
      responseType: "blob",
    }),
};

export default statisticsAPI;

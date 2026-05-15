import api from "./AxiosClient";

// Dashboard
export const getDashboardSummary = async () => {
    const res = await api.get(`/statistics/dashboard`);
    return res.data;
};

// Revenue Statistics
export const getRevenueStatistics = async (
    type = "daily",
    fromDate = null,
    toDate = null
) => {
    const params = new URLSearchParams();

    params.append("type", type);

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await api.get(
        `/statistics/revenue?${params.toString()}`
    );

    return res.data;
};

// Profit Statistics
export const getProfitStatistics = async (
    type = "daily",
    fromDate = null,
    toDate = null
) => {
    const params = new URLSearchParams();

    params.append("type", type);

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await api.get(
        `/statistics/profit?${params.toString()}`
    );

    return res.data;
};

// Import Cost Statistics
export const getImportCostStatistics = async (
    type = "daily",
    fromDate = null,
    toDate = null
) => {
    const params = new URLSearchParams();

    params.append("type", type);

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await api.get(
        `/statistics/import-cost?${params.toString()}`
    );

    return res.data;
};

// Product Analytics
export const getProductAnalytics = async (
    pageNumber = 1,
    pageSize = 50
) => {
    const res = await api.get(
        `/statistics/products?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    return res.data;
};

export const getProductAnalyticsById = async (productId) => {
    const res = await api.get(`/statistics/products/${productId}`);
    return res.data;
};

// Top Products
export const getTopSellingProducts = async (topCount = 10) => {
    const res = await api.get(
        `/statistics/top-selling?topCount=${topCount}`
    );

    return res.data;
};

export const getTopProfitProducts = async (topCount = 10) => {
    const res = await api.get(
        `/statistics/top-profit-products?topCount=${topCount}`
    );

    return res.data;
};

// Category Revenue
export const getRevenuByCategory = async (
    fromDate = null,
    toDate = null
) => {
    const params = new URLSearchParams();

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await api.get(
        `/statistics/category-revenue?${params.toString()}`
    );

    return res.data;
};

// Comparisons
export const compareCurrentVsPreviousMonth = async () => {
    const res = await api.get(`/statistics/comparison/month`);
    return res.data;
};

export const compareCurrentVsPreviousYear = async () => {
    const res = await api.get(`/statistics/comparison/year`);
    return res.data;
};

// KPI Cards
export const getKpiCards = async () => {
    const res = await api.get(`/statistics/kpi-cards`);
    return res.data;
};

// Export Excel
export const exportToExcel = async (data) => {
    const res = await api.post(
        `/statistics/export/excel`,
        data,
        {
            responseType: "blob",
        }
    );

    return res.data;
};

// Export PDF
export const exportToPdf = async (data) => {
    const res = await api.post(
        `/statistics/export/pdf`,
        data,
        {
            responseType: "blob",
        }
    );

    return res.data;
};
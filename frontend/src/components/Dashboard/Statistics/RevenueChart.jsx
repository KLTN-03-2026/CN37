import React, { useState, useEffect } from "react";
import styles from "./RevenueChart.module.scss";
import {
  compareCurrentVsPreviousMonth,
  getBusinessStatistics,
} from "../../../api/StatisticsApi";
import RevenueSummaryCards from "./RevenueSummaryCards";
import RevenueLineChart from "./RevenueLineChart";
import RevenueFilterBar from "./RevenueFilterBar";

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalOrders: 0,
    revenueChange: 0,
    costChange: 0,
    profitChange: 0,
    ordersChange: 0,
  });

  const [dateRange, setDateRange] = useState([null, null]);
  const [chartData, setChartData] = useState([]);
  const [branch, setBranch] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("daily");

  useEffect(() => {
    const [fromDate, toDate] = dateRange;

    if ((fromDate && toDate) || (!fromDate && !toDate)) {
      fetchStatisticsData();
      fetchChartData();
    }
  }, [type, dateRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStatisticsData();
    setIsRefreshing(false);
  };

  const formatDateForApi = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getChartDefaultRange = (type) => {
    const now = new Date();

    if (type === "daily") {
      return {
        fromDate: formatDateForApi(
          new Date(now.getFullYear(), now.getMonth(), 1),
        ),
        toDate: formatDateForApi(now),
      };
    }

    return {
      fromDate: formatDateForApi(dateRange[0]),
      toDate: formatDateForApi(dateRange[1]),
    };
  };

  const fetchChartData = async () => {
    const range = getChartDefaultRange(type);

    const response = await getBusinessStatistics(
      type,
      range.fromDate,
      range.toDate,
    );

    if (response.success) {
      setChartData(response.data?.data || []);
    }
  };

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);

      const fromDate = formatDateForApi(dateRange[0]);
      const toDate = formatDateForApi(dateRange[1]);

      const [businessResponse, compareResponse] = await Promise.all([
        getBusinessStatistics(type, fromDate, toDate),
        compareCurrentVsPreviousMonth(),
      ]);

      if (businessResponse.success) {
        const result = businessResponse.data;
        const compare = compareResponse.data;

        setData(result?.data || []);

        setSummary({
          totalRevenue: result?.totalRevenue || 0,
          totalCost: result?.totalCost || 0,
          totalProfit: result?.totalProfit || 0,
          totalOrders: result?.data?.reduce(
            (sum, item) => sum + (item.exportCount || 0),
            0,
          ),

          revenueChange: compare?.revenueChangePercentage || 0,
          profitChange: compare?.profitChangePercentage || 0,
          ordersChange:
            compare?.previousPeriodOrders > 0
              ? ((compare.currentPeriodOrders - compare.previousPeriodOrders) /
                  compare.previousPeriodOrders) *
                100
              : 0,

          costChange: 0,
        });

        setError(null);
      } else {
        setError(
          businessResponse.message || "Failed to load business statistics",
        );
      }
    } catch (err) {
      setError("Failed to load statistics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const formatChartCurrency = (value) => {
    return `${((value || 0) / 1000000).toFixed(1)}M`;
  };

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.chartContainer}>
      <RevenueFilterBar
        type={type}
        setType={setType}
        branch={branch}
        setBranch={setBranch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {loading && (
        <div className={styles.loadingOverlay}>Đang tải dữ liệu...</div>
      )}

      <RevenueSummaryCards summary={summary} formatCurrency={formatCurrency} filterType={type}/>

      <RevenueLineChart
        data={chartData}
        type={type}
        formatCurrency={formatCurrency}
        formatChartCurrency={formatChartCurrency}
      />
    </div>
  );
};

export default RevenueChart;

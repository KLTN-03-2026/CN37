import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Info,
} from "lucide-react";
import styles from "./BusinessAlerts.module.scss";
import { getBusinessAlerts } from "../../../api/StatisticsApi";

const cx = classNames.bind(styles);

const BusinessAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getBusinessAlerts();

      if (response.success) {
        setAlerts(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load business alerts", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={22} />;
      case "danger":
        return <TrendingDown size={22} />;
      case "success":
        return <CheckCircle2 size={22} />;
      case "info":
      default:
        return <Info size={22} />;
    }
  };

  if (loading) {
    return (
      <div className={cx("card")}>
        <div className={cx("skeletonTitle")}></div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={cx("skeletonItem")}></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <h2>Cảnh báo kinh doanh</h2>
      </div>

      <div className={cx("list")}>
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={cx("alertItem", alert.type)}
            >
              <div className={cx("icon")}>
                {getAlertIcon(alert.type)}
              </div>

              <div className={cx("content")}>
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
                <span>{alert.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={cx("empty")}>
            Không có cảnh báo kinh doanh nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAlerts;
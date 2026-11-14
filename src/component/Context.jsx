import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { api, apiErrorMessage } from "../services/apiService";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [stats, setStats] = useState(null); // { users, products, courses, services }
  const [siteStats, setSiteStats] = useState([]); // [{ date, value }]
  const [range, setRangeState] = useState(30); // تعداد روز نمودار
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");

  // جلوگیری از اینکه پاسخ قدیمیِ یک درخواست روی جدیدتر بنشیند
  const chartReq = useRef(0);

  const loadSiteStats = useCallback(async (days) => {
    const id = ++chartReq.current;
    setChartLoading(true);
    try {
      const data = await api.getSiteStats(days);
      if (id === chartReq.current) setSiteStats(data);
    } catch (err) {
      if (id === chartReq.current) setError(apiErrorMessage(err));
    } finally {
      if (id === chartReq.current) setChartLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s] = await Promise.all([
        api.getDashboardStats(),
        loadSiteStats(range),
      ]);
      setStats(s);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loadSiteStats, range]);

  const setRange = useCallback(
    (days) => {
      setRangeState(days);
      loadSiteStats(days);
    },
    [loadSiteStats],
  );

  // پاک کردن داده‌ها هنگام خروج از داشبورد
  const resetData = useCallback(() => {
    chartReq.current++;
    setStats(null);
    setSiteStats([]);
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      stats,
      siteStats,
      range,
      loading,
      chartLoading,
      error,
      setRange,
      refreshAll,
      resetData,
    }),
    [stats, siteStats, range, loading, chartLoading, error, setRange, refreshAll, resetData],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};

import { createContext, useCallback, useEffect, useState } from "react";
import { getDashboard } from "../api/api";
import { useAuth } from "../hooks/useAuth";

// Use This Context to Get the dashboard data. statsData is every data needed for the sidebar. distData is other distribution data such as Job Distribution, etc.

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const { token } = useAuth();

  const [statsData, setStatsData] = useState([]);
  // set initial distData to null so consumers can detect 'not loaded yet'
  const [distData, setDistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const [lastFilters, setLastFilters] = useState(null);

  const fetchDashboard = useCallback(async (filters = null) => {
    setIsLoading(true);
    try {
      if (!token) return;
      const data = await getDashboard(token, filters || {});

      setStatsData(data.statsData);
      setDistData(data.distData);
      setLastFetched(new Date());
      setLastFilters(filters || null);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Polling: refresh dashboard periodically to avoid stale charts
  useEffect(() => {
    if (!token) return;
    const POLL_MS = 300000; // 5m polling interval
    const id = setInterval(() => {
      fetchDashboard(lastFilters);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchDashboard, token, lastFilters]);

  // Refresh when tab becomes visible again
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchDashboard(lastFilters);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [fetchDashboard, lastFilters]);

  const refreshDashboard = (filters) => fetchDashboard(filters || lastFilters);

  return (
    <DashboardContext.Provider value={{ statsData, distData, isLoading, refreshDashboard, lastFetched }}>
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContext;

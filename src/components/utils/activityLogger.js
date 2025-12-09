const STORAGE_KEY = 'leadsight_activity_log_v1';

const safeParse = (v) => {
  try {
    return JSON.parse(v);
  } catch {
    return [];
  }
};

export const logActivity = (type, payload = {}) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = safeParse(raw) || [];
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    list.unshift(entry);

    // keep last 1000 events
    const trimmed = list.slice(0, 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return entry;
  } catch (err) {
    // swallow errors in logging so app continues
    console.warn('Activity logger failed', err);
    return null;
  }
};

export const getActivityLog = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeParse(raw) || [];
  } catch {
    return [];
  }
};

export const clearActivityLog = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};

export default {
  logActivity,
  getActivityLog,
  clearActivityLog,
};

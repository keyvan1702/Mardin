import { useSyncExternalStore } from "react";
import { makeSeed } from "./seed";

/**
 * حافظه‌ی مرکزی پنل: همه‌ی صفحه‌ها از اینجا می‌خوانند و می‌نویسند.
 * فعلاً در localStorage مرورگر نگه داشته می‌شود؛ با وصل شدن API،
 * فقط توابع db و services/actions.js عوض می‌شوند و صفحه‌ها دست نمی‌خورند.
 */
const KEY = "mardin_store_v2";
const VERSION = 2;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === VERSION && parsed.data) return parsed.data;
    }
  } catch {
    /* خراب بود؛ دوباره از اول ساخته می‌شود */
  }
  return makeSeed();
}

let state = load();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, data: state }));
  } catch {
    /* حافظه پر بود؛ فقط در حافظه‌ی صفحه می‌ماند */
  }
  listeners.forEach((l) => l());
}

export const getState = () => state;
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// انتخاب بخشی از حافظه؛ selector باید مرجع پایدار برگرداند (مثلاً s => s.customers)
export function useStore(selector) {
  return useSyncExternalStore(subscribe, () => selector(state));
}

export const useCollection = (name) => useStore((s) => s[name]);

const nextId = (rows) => rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;

export const db = {
  all: (name) => state[name],
  get: (name, id) => state[name].find((r) => r.id === Number(id)),

  insert(name, item) {
    const row = { ...item, id: item.id ?? nextId(state[name]) };
    commit({ ...state, [name]: [row, ...state[name]] });
    return row;
  },

  update(name, id, patch) {
    let updated = null;
    commit({
      ...state,
      [name]: state[name].map((r) => {
        if (r.id !== Number(id)) return r;
        updated = { ...r, ...patch };
        return updated;
      }),
    });
    return updated;
  },

  remove(name, id) {
    commit({ ...state, [name]: state[name].filter((r) => r.id !== Number(id)) });
  },

  // مقدار تکی (تنظیمات، ماتریس دسترسی، قوانین اعلان)
  set(key, value) {
    commit({ ...state, [key]: value });
  },

  reset() {
    commit(makeSeed());
  },
};

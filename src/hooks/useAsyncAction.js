import { useCallback, useRef, useState } from "react";

/**
 * مدیریت یک عملیات async با لودینگ مستقل
 * - busy: آیا عملیات در جریان است؟
 * - run(fn): اجرای fn با ست کردن busy (و قفل برای جلوگیری از ارسال تکراری)
 */
export default function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  const run = useCallback(async (fn) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      return await fn();
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }, []);

  return { busy, run };
}

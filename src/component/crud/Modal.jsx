import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

// پنجره‌ی پایه: بستن با Esc یا کلیک روی پس‌زمینه
const Modal = ({ title, onClose, children, size = "md" }) => {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="modalback" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modalhead">
          <h2>{title}</h2>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="بستن">
            <LuX />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Modal;

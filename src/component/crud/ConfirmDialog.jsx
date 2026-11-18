import React, { useState } from "react";
import Modal from "./Modal";
import { apiErrorMessage } from "../../services/apiService";

// تأیید عملیات خطرناک؛ onConfirm می‌تواند Error بیندازد (پیام آن نمایش داده می‌شود)
const ConfirmDialog = ({ title, message, confirmLabel = "حذف", tone = "danger", onConfirm, onClose }) => {
  const [error, setError] = useState("");

  const run = () => {
    try {
      onConfirm();
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <Modal title={title} onClose={onClose} size="sm">
      <div className="modalform">
        <p className="confirmtext">{message}</p>
        {error && (
          <p className="formerror" role="alert">
            {error}
          </p>
        )}
        <footer className="modalfoot">
          <button type="button" className="btnsecondary" onClick={onClose}>
            انصراف
          </button>
          <button type="button" className={tone === "danger" ? "btndanger" : "btnprimary"} onClick={run}>
            {confirmLabel}
          </button>
        </footer>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

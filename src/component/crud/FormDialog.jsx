import React, { useState } from "react";
import Modal from "./Modal";
import { FormFields, castValues, initialValues, validateFields } from "./FormFields";
import { apiErrorMessage } from "../../services/apiService";

/**
 * فرم افزودن/ویرایش در پنجره.
 * onSubmit(values) می‌تواند Error بیندازد؛ پیام آن بالای فرم نمایش داده می‌شود.
 */
const FormDialog = ({ title, fields, row, onSubmit, onClose, submitLabel = "ذخیره", size = "lg" }) => {
  const [values, setValues] = useState(() => initialValues(fields, row));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const change = (key, v) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateFields(fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      onSubmit(castValues(fields, values));
    } catch (err) {
      setFormError(apiErrorMessage(err, "ذخیره انجام نشد."));
    }
  };

  return (
    <Modal title={title} onClose={onClose} size={size}>
      <form className="modalform" onSubmit={submit} noValidate>
        {formError && (
          <p className="formerror" role="alert">
            {formError}
          </p>
        )}
        <FormFields fields={fields} values={values} errors={errors} onChange={change} />
        <footer className="modalfoot">
          <button type="button" className="btnsecondary" onClick={onClose}>
            انصراف
          </button>
          <button type="submit" className="btnprimary">
            {submitLabel}
          </button>
        </footer>
      </form>
    </Modal>
  );
};

export default FormDialog;

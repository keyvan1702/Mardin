import React from "react";

// بخشی از فرم: عنوان و توضیح سمت راست، فیلدها سمت چپ
const FormSection = ({ title, hint, children }) => (
  <section className="formsection">
    <div className="formsectionhead">
      <h2>{title}</h2>
      {hint && <p>{hint}</p>}
    </div>
    <div className="formsectionbody">{children}</div>
  </section>
);

export default FormSection;

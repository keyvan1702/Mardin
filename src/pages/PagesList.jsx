import React from "react";
import ContentList from "./ContentList";

const PagesList = () => (
  <ContentList
    type="pages"
    label="صفحه"
    title="صفحات وبسایت"
    subtitle="صفحه‌ی اصلی، روند کاری، درباره‌ی کسب‌وکار، درباره‌ی ما، فرصت‌های شغلی و ارتباط با ما"
    addLabel="صفحه‌ی جدید"
    extra={{ key: "slug", header: "آدرس", render: (r) => <span dir="ltr" className="muted">{r.slug}</span> }}
  />
);

export default PagesList;

import React from "react";
import ContentList from "./ContentList";
import { MOCK_PAGES } from "../services/mockData";

const PagesList = () => (
  <ContentList
    type="pages"
    title="صفحات وبسایت"
    subtitle="صفحه‌ی اصلی، روند کاری، درباره‌ی کسب‌وکار، درباره‌ی ما، فرصت‌های شغلی و ارتباط با ما"
    addLabel="صفحه‌ی جدید"
    rows={MOCK_PAGES}
    extra={{ key: "slug", header: "آدرس", render: (r) => <span dir="ltr" className="muted">{r.slug}</span> }}
  />
);

export default PagesList;

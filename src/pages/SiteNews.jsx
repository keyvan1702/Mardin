import React from "react";
import ContentList from "./ContentList";
import { MOCK_NEWS } from "../services/mockData";

const SiteNews = () => (
  <ContentList
    type="news"
    title="اخبار"
    subtitle="اخبار و اطلاعیه‌های ماردین"
    addLabel="خبر جدید"
    rows={MOCK_NEWS}
  />
);

export default SiteNews;

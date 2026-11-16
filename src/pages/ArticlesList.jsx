import React from "react";
import ContentList from "./ContentList";
import { MOCK_ARTICLES } from "../services/mockData";

const ArticlesList = () => (
  <ContentList
    type="articles"
    title="مقالات"
    subtitle="مقالات آموزشی و راهنمای نگهداری که در وبسایت نمایش داده می‌شوند"
    addLabel="مقاله‌ی جدید"
    rows={MOCK_ARTICLES}
    extra={{ key: "author", header: "نویسنده", render: (r) => r.author }}
  />
);

export default ArticlesList;

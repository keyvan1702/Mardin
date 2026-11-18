import React from "react";
import ContentList from "./ContentList";

const ArticlesList = () => (
  <ContentList
    type="articles"
    label="مقاله"
    title="مقالات"
    subtitle="مقالات آموزشی و راهنمای نگهداری که در وبسایت نمایش داده می‌شوند"
    addLabel="مقاله‌ی جدید"
    extra={{ key: "author", header: "نویسنده", render: (r) => r.author || "—" }}
  />
);

export default ArticlesList;

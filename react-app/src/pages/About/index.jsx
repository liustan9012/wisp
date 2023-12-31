import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MDEditor from "@uiw/react-md-editor";

import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../api/authSlice";
import { useGetPostQuery } from "../../api/post";

export default function About() {
  const { t, i18n } = useTranslation();

  const auth = useSelector(selectCurrentAuth);
  const { data, error, isLoading, isFetching } = useGetPostQuery("about");
  if (isFetching) return <Typography sx={{ mb: 4, mt: 4 }}>{t("Loading...")}</Typography>;
  const { post, msg } = data;
  if (msg === "error") return <Typography sx={{ mb: 4, mt: 4 }}>{t("about")}</Typography>;
  return (
    <Box sx={{ mt: 4 }}>
      <MDEditor.Markdown source={post.content} />
    </Box>
  );
}

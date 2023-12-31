import React from "react";
import { Typography, Box, Divider, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useGetTagsPostsQuery } from "../../api/tag";
import { useTranslation } from "react-i18next";

export default function TagsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetTagsPostsQuery();
  if (isLoading) return <Typography>{t("Loading...")}</Typography>;
  if (!data || data?.msg === "error") return <Typography>{t("Missing tags!")}</Typography>;
  const { tags } = data;
  if (!tags.length) return <Typography>{t("no tag yet")}</Typography>;
  return (
    <Box direction={"row"} spacing={1} sx={{ mt: 4 }} divider={<Divider orientation="vertical" flexItem  />}>
      {tags.map((t) => (
        <Chip
          key={t.id}
          to={`/tag/${t.id}`}
          component={RouterLink}
          underline="none"
          label={
            <Typography noWrap>
              {t.name}
              <Typography component={"span"} sx={{ color: "primary.main", pl: 1 }} noWrap>
                {t.post_count}
              </Typography>
            </Typography>
          }
          clickable
          sx={{ ml: 2, mb: 2 }}
        ></Chip>
      ))}
    </Box>
  );
}

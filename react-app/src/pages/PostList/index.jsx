import React from "react";
import {
  Typography,
  Stack,
  Paper,
  Link,
  CardContent,
  CardActions,
  CardHeader,
  Card,
  Divider,
  Chip,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useGetPostListQuery } from "../../api/post";
import { timeConverter } from "../../utils/datetime";
import { paramsToObject } from "../../utils/converter";
import { useTranslation } from "react-i18next";

export default function PostList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = paramsToObject(searchParams.entries());
  const { t } = useTranslation();
  const { data, isLoading } = useGetPostListQuery({ params });

  if (isLoading) return <Typography>{t("Loading...")}</Typography>;
  if (!data || data?.msg === "error") return <Typography>{t("Missing post!")}</Typography>;
  if (data.pages == 0) return <Typography>{t("no posts yet")}</Typography>;
  const { posts } = data;
  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      {posts.map((post) => (
        <Card key={post.id} elevation={1} sx={{ mt: 2 }}>
          <CardHeader
            title={
              <Link to={`/post/${post.id}`} component={RouterLink} underline="none">
                {post.title}
              </Link>
            }
            subheader={
              <Stack direction={"row"} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                <Typography>{timeConverter(post.created_at)}</Typography>
                {post.tags.length ? (
                  <>
                    {post.tags.map((t) => (
                      <Chip
                        key={t.id}
                        to={`/tag/${t.id}`}
                        component={RouterLink}
                        underline="none"
                        label={t.name}
                        clickable
                        size="small"
                      ></Chip>
                    ))}
                  </>
                ) : null}
              </Stack>
            }
          />
          <CardContent>
            <Typography>{post?.summary || post.title}</Typography>
          </CardContent>
          <CardActions>
            <Link sx={{ pl: 1 }} to={`/post/${post.id}`} component={RouterLink} underline="none">
              {t("more")}{" "}
            </Link>
          </CardActions>
        </Card>
      ))}
      {data.pages > 1 ? (
        <Pagination
          count={data.pages}
          page={data.page}
          sx={{ pt: 2 }}
          renderItem={(item) => (
            <PaginationItem
              component={RouterLink}
              to={`/posts${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      ) : (
        ""
      )}
    </Paper>
  );
}

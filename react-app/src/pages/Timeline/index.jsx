import React from "react"
import { Divider, Link, Paper, Stack, Typography } from "@mui/material"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useSearchParams } from "react-router-dom"

import { usePostList } from "../../api/post"
import { timeConverter } from "../../utils/datetime"

export default function TimeLine() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams({ per_page: 20 })
  const { data, isLoading } = usePostList(searchParams)
  if (isLoading) return <Typography>{t("Loading...")}</Typography>
  if (!data || data?.msg === "error")
    return <Typography>{t("Missing post!")}</Typography>
  if (data.pages == 0) return <Typography>{t("no posts yet")}</Typography>
  const { posts } = data
  return (
    <Paper elevation={0} sx={{ mt: 4 }}>
      {posts.map((post) => (
        <Stack
          key={post.id}
          direction={"row"}
          spacing={1}
          useFlexGap
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ minHeight: "3rem", justifyContent: "flex-start" }}
        >
          <Typography sx={{ width: 100 }}>
            {timeConverter(post.created_at).slice(0, 10)}
          </Typography>
          <Link to={`/post/${post.id}`} component={RouterLink} underline="none">
            {post.title}
          </Link>
        </Stack>
      ))}
      {data.pages > 1 ? (
        <Pagination
          count={data.pages}
          page={data.page}
          sx={{ pt: 2 }}
          renderItem={(item) => (
            <PaginationItem
              component={RouterLink}
              to={`/timeline${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      ) : (
        ""
      )}
    </Paper>
  )
}

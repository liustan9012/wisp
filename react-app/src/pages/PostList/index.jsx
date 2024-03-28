import React from "react"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { grey } from "@mui/material/colors"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import { useTranslation } from "react-i18next"
import {
  Link as RouterLink,
  useLocation,
  useSearchParams,
} from "react-router-dom"

import { usePostList } from "../../api/post"
import { timeConverter } from "../../utils/datetime"

const PostCard = ({ post }) => {
  const { t } = useTranslation()
  const initElevation = 0
  const [elevation, setElevation] = React.useState(initElevation)

  return (
    <Card
      elevation={elevation}
      onMouseEnter={(e) => setElevation(2)}
      onMouseLeave={(e) => setElevation(initElevation)}
      sx={{
        ":hover": (theme) =>
          theme.palette.mode === "light"
            ? {
                backgroundColor: grey[50],
              }
            : {},
      }}
    >
      <CardHeader
        title={
          <Link to={`/post/${post.id}`} component={RouterLink} underline="none">
            {post.title}
          </Link>
        }
        subheader={
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: 1,
            }}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Stack direction={"row"} spacing={1}>
              <CalendarMonthOutlinedIcon />
              <Typography>
                {timeConverter(post.created_at).slice(0, -3)}
              </Typography>
            </Stack>
            {post.tags.length ? (
              <Stack direction={"row"} spacing={1}>
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
              </Stack>
            ) : null}
          </Stack>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography>{post?.summary || post.title}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Link
          sx={{ pl: 1 }}
          to={`/post/${post.id}`}
          component={RouterLink}
          underline="none"
        >
          {t("more")}{" "}
        </Link>
      </CardActions>
    </Card>
  )
}

export default function PostList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const { data, isLoading } = usePostList(searchParams)

  if (isLoading) return <Typography>{t("Loading...")}</Typography>
  if (!data || data?.msg === "error")
    return <Typography>{t("Missing post!")}</Typography>
  if (data.pages == 0) return <Typography>{t("no posts yet")}</Typography>
  const { posts } = data
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: "80vh",
      }}
    >
      <Stack sx={{ gap: 2, flexGrow: 1 }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>
      {data.pages > 1 ? (
        <Pagination
          count={data.pages}
          page={data.page}
          sx={{ pt: 2, flexGrow: 0 }}
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
  )
}

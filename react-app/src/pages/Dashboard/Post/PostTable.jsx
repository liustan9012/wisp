import * as React from "react"
import { Add, Delete, Edit } from "@mui/icons-material"
import { Button, Chip, Link } from "@mui/material"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import {
  Link as RouteLink,
  useLocation,
  useSearchParams,
} from "react-router-dom"

import { useDeletePost, usePostList } from "../../../api/post"
import { timeConverter } from "../../../utils/datetime"
import {
  AdminTableHead,
  AdminTablePagination,
} from "../../Componets/AsminTable"

const headCells = [
  {
    id: "id",
    numeric: true,
    label: "id",
  },
  {
    id: "title",
    numeric: false,
    label: "title",
  },
  {
    id: "tags",
    numeric: false,
    label: "tag",
  },
  {
    id: "created_at",
    numeric: true,
    label: "creation date",
  },
  {
    id: "status",
    numeric: false,
    label: "status",
  },
  {
    id: "action",
    numeric: false,
    label: "action",
  },
]

export function PostTableComponet({
  order,
  total,
  orderBy,
  page,
  rowsPerPage,
  tabledata,
  handleDeletePost,
}) {
  const location = useLocation()
  const [selected, setSelected] = React.useState(null)
  const { t } = useTranslation()

  const emptyRows =
    page > 0 ? Math.max(0, 1 * rowsPerPage - tabledata.length) : 0

  return (
    <Box
      sx={{
        mt: 2,
        minWidth: "80vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper variant="outlined" sx={{ minWidth: "70vw", mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 8 } }}>
          <Typography sx={{ pl: 4, flexGrow: 1, textTransform: "capitalize" }}>
            {t("post")}
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{ flexGrow: 0 }}
            component={RouteLink}
            to="/admin/post/create"
          >
            {t("add")}
          </Button>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="Post Table"
            size={"small"}
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {tabledata.map((post) => {
                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(post.id)}
                    aria-checked={selected == post.id}
                    tabIndex={-1}
                    key={post.id}
                    selected={selected == post.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={`post-${post.id}`}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {post.id}
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        underline="none"
                        to={`/admin/post/${post.id}`}
                        component={RouteLink}
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {post.tags.map((t) => (
                        <Chip
                          key={t.id}
                          underline="none"
                          label={t.name}
                          clickable
                          size="small"
                          sx={{ ml: 1 }}
                        ></Chip>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {timeConverter(post.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      {t(`${post.status}`.toLowerCase())}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        sx={{ mr: 1, width: 100 }}
                        to={`/admin/post/${post.id}/edit`}
                        state={{ from: location }}
                        component={RouteLink}
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        startIcon={<Delete />}
                        sx={{ mr: 1, width: 100 }}
                        onClick={() => handleDeletePost(post.id)}
                      >
                        {t("delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 50 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AdminTablePagination
          total={total}
          rowsPerPage={rowsPerPage}
          page={page}
        />
      </Paper>
    </Box>
  )
}

export default function PostTable() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, mutate } = usePostList(searchParams)
  const { trigger: deletePost } = useDeletePost()

  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === "error")
    return <Typography>Loading Missing! {`${data?.error}`} </Typography>
  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    mutate()
  }
  const data_params = {
    page: data.page,
    rowsPerPage: data.per_page,
    total: data.total,
    order: data.order,
    orderBy: data.order_by,
    handleDeletePost,
  }
  return <PostTableComponet tabledata={data.posts} {...data_params} />
}

import * as React from "react"
import { Delete } from "@mui/icons-material"
import { Button, Link, Tooltip } from "@mui/material"
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

import { useComments, useDeleteComment } from "../../../api/comment"
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
    id: "content",
    numeric: false,
    label: "content",
  },

  {
    id: "created_at",
    numeric: true,
    label: "creation date",
  },
  {
    id: "username",
    numeric: false,
    label: "user",
  },
  {
    id: "post_title",
    numeric: false,
    label: "post",
  },
  {
    id: "action",
    numeric: false,
    label: "action",
  },
]

export function CommentTableComponet({
  order,
  total,
  orderBy,
  page,
  rowsPerPage,
  tabledata,
  handleDeleteComment,
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = React.useState(null)
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
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography sx={{ pl: 4, textTransform: "capitalize" }}>
            {t("comment")}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="Tag Table"
            size="small"
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {tabledata.map(
                ({
                  id,
                  content,
                  created_at,
                  username,
                  post_id,
                  post_title,
                }) => {
                  return (
                    <TableRow
                      hover
                      onClick={() => setSelected(id)}
                      aria-checked={selected == id}
                      tabIndex={-1}
                      key={id}
                      selected={selected == id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        component="th"
                        id={`tag-${id}`}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {id}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={content}>
                          <Typography sx={{ maxWidth: 360 }} noWrap>
                            {content}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {timeConverter(created_at)}
                      </TableCell>
                      <TableCell align="center">{username}</TableCell>
                      <TableCell align="center">
                        <Link
                          to={`/admin/post/${post_id}`}
                          component={RouteLink}
                          underline="none"
                        >
                          {post_title}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          startIcon={<Delete />}
                          sx={{ mr: 1, width: 100 }}
                          onClick={() => handleDeleteComment(id)}
                        >
                          {t("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              )}
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

export default function CommentTable() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, mutate } = useComments(searchParams)
  const { trigger: deleteComment } = useDeleteComment()

  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === "error")
    return <Typography>Loading Missing! {`${data?.error}`} </Typography>
  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId)
    mutate()
  }
  const data_params = {
    page: data.page,
    rowsPerPage: data.per_page,
    total: data.total,
    order: data.order,
    orderBy: data.order_by,
    handleDeleteComment,
  }

  return <CommentTableComponet tabledata={data.comments} {...data_params} />
}

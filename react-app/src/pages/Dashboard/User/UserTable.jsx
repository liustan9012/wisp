import * as React from "react"
import { Add } from "@mui/icons-material"
import { Button } from "@mui/material"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import {
  Link as RouteLink,
  useLocation,
  useSearchParams,
} from "react-router-dom"

import { useUsers } from "../../../api/auth"
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
    id: "username",
    numeric: false,
    label: "user name",
  },
  {
    id: "email",
    numeric: false,
    label: "email",
  },
  {
    id: "created_at",
    numeric: true,
    label: "creation date",
  },
  {
    id: "is_admin",
    numeric: true,
    label: "role",
  },
]

export default function UserTable() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const { data, isLoading } = useUsers(searchParams)

  const [selected, setSelected] = React.useState(null)

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  const users = data.users || []
  const { page, per_page: rowsPerPage, order, order_by: orderBy, total } = data
  const emptyRows = page > 0 ? Math.max(0, 1 * rowsPerPage - users.length) : 0
  return (
    <Box
      sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Paper variant="outlined" sx={{ width: "80%", mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 8 } }}>
          <Typography sx={{ pl: 4, flexGrow: 1, textTransform: "capitalize" }}>
            {t("user")}
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{ flexGrow: 0 }}
            component={RouteLink}
            to="/admin/user/create"
          >
            {t("add")}
          </Button>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="User Table"
            size="small"
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(user.id)}
                    aria-checked={selected == user.id}
                    tabIndex={-1}
                    key={user.id}
                    selected={selected == user.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={`user-${user.username.id}`}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {user.id}
                    </TableCell>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">
                      {timeConverter(user.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      {user.is_admin ? "admin" : "user"}
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

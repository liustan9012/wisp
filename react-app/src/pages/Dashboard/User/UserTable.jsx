import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useGetUsersQuery } from '../../../api/auth';
import { timeConverter } from '../../../utils/datetime';

import AdminTableHead from '../../../componets/AdminTableHead';
import { getComparator, stableSort } from '../../../utils/stableSort';

const headCells = [
  {
    id: 'id',
    numeric: true,
    label: 'ID',
  },
  {
    id: 'username',
    numeric: false,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: false,
    label: 'Email',
  },
  {
    id: 'created_at',
    numeric: true,
    label: 'Creation Date',
  },
  {
    id: 'is_admin',
    numeric: true,
    label: 'Role',
  },
];




export default function UserTable() {


  const { data, isLoading, } = useGetUsersQuery()

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const users = data?.users || []

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleUsers = React.useMemo(
    () =>
      stableSort(users, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [users, order, orderBy, page, rowsPerPage],
  );
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing!</Typography>
  return (
    <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ width: '80%', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, }}
        >
          <Typography sx={{ pl: 4 }}>Users</Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="User Table"
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleUsers.map((user) => {
                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(user.id)}
                    aria-checked={selected == user.id}
                    tabIndex={-1}
                    key={user.id}
                    selected={selected == user.id}
                    sx={{ cursor: 'pointer' }}
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
                    <TableCell align="center">{timeConverter(user.created_at)}</TableCell>
                    <TableCell align="center">
                      {user.is_admin ? 'admin' : 'user'}
                    </TableCell>
                  </TableRow>
                );
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
  );
}
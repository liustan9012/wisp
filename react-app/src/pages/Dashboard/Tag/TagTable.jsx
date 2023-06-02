import { Delete, Edit } from '@mui/icons-material';
import { Button, Link } from '@mui/material';
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
import { Link as RouteLink, useLocation } from 'react-router-dom';
import { useDeleteTagMutation, useGetTagsQuery, } from '../../../api/tag';
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
    id: 'name',
    numeric: false,
    label: 'Name',
  },

  {
    id: 'created_at',
    numeric: true,
    label: 'Creation Date',
  },
  {
    id: 'username',
    numeric: false,
    label: 'User',
  },
  {
    id: 'post_count',
    numeric: true,
    label: 'Post Count',
  },
  {
    id: 'action',
    numeric: false,
    label: 'Action',
  },
];



export default function TagTable() {


  const { data, isLoading, } = useGetTagsQuery()

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const location = useLocation()

  const [deleteTag,] = useDeleteTagMutation()

  const tags = data?.tags || []

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tags.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(tags, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [tags, order, orderBy, page, rowsPerPage],
  );
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing!</Typography>
  return (
    <Box sx={{ mt: 2, minWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ minWidth: '70vw', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, }}
        >
          <Typography sx={{ pl: 4 }}>Tags</Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="Tag Table"
          // size={dense ? 'small' : 'medium'}
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map(({ id, name, created_at, username, post_count }) => {
                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(id)}
                    aria-checked={selected == id}
                    tabIndex={-1}
                    key={id}
                    selected={selected == id}
                    sx={{ cursor: 'pointer' }}
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
                      <Link
                        underline='none'
                        to={`/admin/tag/${id}`}
                        component={RouteLink}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{timeConverter(created_at)}</TableCell>
                    <TableCell align="center">{username}</TableCell>
                    <TableCell align="center">{post_count}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Edit />}
                        sx={{ mr: 1, width: 100 }}
                        to={`/admin/tag/${id}/edit`}
                        state={{ from: location }}
                        component={RouteLink}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='outlined'
                        size='small'
                        color='warning'
                        startIcon={<Delete />}
                        sx={{ mr: 1, width: 100 }}
                        onClick={() => deleteTag(id)}
                      >
                        Delete
                      </Button>
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
          count={tags.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
  );
}
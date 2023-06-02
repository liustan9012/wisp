import * as React from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { Button, Chip, Link } from '@mui/material';
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
import { Link as RouteLink, useLocation } from 'react-router-dom';
import { useDeletePostMutation, useGetPostListQuery } from '../../../api/post';
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
    id: 'title',
    numeric: false,
    label: 'Title',
  },
  {
    id: 'tags',
    numeric: false,
    label: 'Tag',
  },
  {
    id: 'created_at',
    numeric: true,
    label: 'Creation Date',
  },
  {
    id: 'status',
    numeric: false,
    label: 'Status',
  },
  {
    id: 'action',
    numeric: false,
    label: 'Action',
  },
];



export default function PostTable() {


  const { data, isLoading, } = useGetPostListQuery()

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const location = useLocation()

  const [deletePost,] = useDeletePostMutation()

  const posts = data?.posts || []

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(posts, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [posts, order, orderBy, page, rowsPerPage],
  );
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing !</Typography>
  return (
    <Box sx={{ mt: 2, minWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ minWidth: '70vw', mb: 2 }}>
        <Toolbar
          sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, }}
        >
          <Typography sx={{ pl: 4 }}>Posts</Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="Post Table"
          // size={dense ? 'small' : 'medium'}
          >
            <AdminTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((post) => {
                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(post.id)}
                    aria-checked={selected == post.id}
                    tabIndex={-1}
                    key={post.id}
                    selected={selected == post.id}
                    sx={{ cursor: 'pointer' }}
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
                        underline='none'
                        to={`/admin/post/${post.id}`}
                        component={RouteLink}>
                        {post.title}
                      </Link>
                    </TableCell>
                    {/* <TableCell align="center">{post.author}</TableCell> */}
                    <TableCell align="center">{
                      post.tags.map((t) => <Chip
                        key={t.id}
                        underline='none'
                        label={t.name}
                        clickable
                        size='small'
                        sx={{ ml: 1 }}
                      >
                      </Chip>
                      )}
                    </TableCell>
                    <TableCell align="center">{timeConverter(post.created_at)}</TableCell>
                    <TableCell align="center">
                      {`${post.status}`.toLowerCase()}

                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Edit />}
                        sx={{ mr: 1, width: 100 }}
                        to={`/admin/post/${post.id}/edit`}
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
                        onClick={() => deletePost(post.id)}
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
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
  );
}
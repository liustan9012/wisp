import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouteLink, useLocation, useSearchParams } from "react-router-dom";
import { useDeleteTagMutation, useGetTagsQuery, useTagListQuery } from "../../../api/tag";
import { timeConverter } from "../../../utils/datetime";
import { AdminTablePagination, AdminTableHead } from "../../Componets/AsminTable";
import { paramsToObject } from "../../../utils/converter";
import { useTranslation } from "react-i18next";

const headCells = [
  {
    id: "id",
    numeric: true,
    label: "id",
  },
  {
    id: "name",
    numeric: false,
    label: "name",
  },
  {
    id: "created_at",
    numeric: true,
    label: "creation date",
  },
  {
    id: "post_count",
    numeric: true,
    label: "post count",
  },
  {
    id: "navlink_count",
    numeric: true,
    label: "navlink count",
  },
  {
    id: "action",
    numeric: false,
    label: "action",
  },
];

export function TagTableComponet({ order, total, orderBy, page, rowsPerPage, tabledata }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [selected, setSelected] = React.useState(null);

  const [deleteTag] = useDeleteTagMutation();
  const emptyRows = page > 0 ? Math.max(0, 1 * rowsPerPage - tabledata.length) : 0;

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
        <Toolbar sx={{ pl: { sm: 2 },  pr: { xs: 8 } }}>
          <Typography sx={{ pl: 4, flexGrow: 1, textTransform: "capitalize" }}>{t("tag")}</Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{ flexGrow: 0 }}
            component={RouteLink}
            to="/admin/tag/create"
          >
            {t("add")}
          </Button>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="Tag Table" size={"small"}>
            <AdminTableHead headCells={headCells} order={order} orderBy={orderBy} />
            <TableBody>
              {tabledata.map(({ id, name, created_at, content_type, post_count, navlink_count }) => {
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
                    <TableCell component="th" id={`tag-${id}`} scope="row" padding="none" align="center">
                      {id}
                    </TableCell>
                    <TableCell align="center">
                      <Link underline="none" to={`/admin/tag/${id}`} component={RouteLink}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{timeConverter(created_at)}</TableCell>
                    <TableCell align="center">{post_count}</TableCell>
                    <TableCell align="center">{navlink_count}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        sx={{ mr: 1, width: 100 }}
                        to={`/admin/tag/${id}/edit`}
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
                        onClick={() => deleteTag(id)}
                      >
                        {t("delete")}
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
        <AdminTablePagination total={total} rowsPerPage={rowsPerPage} page={page} />
      </Paper>
    </Box>
  );
}

export default function TagTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = paramsToObject(searchParams.entries());
  const { data, isLoading } = useTagListQuery({ params });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data || data?.msg === "error") return <Typography>Loading Missing! {`${data?.error}`} </Typography>;
  const data_params = {
    page: data.page,
    rowsPerPage: data.per_page,
    total: data.total,
    order: data.order,
    orderBy: data.order_by,
  };

  return <TagTableComponet tabledata={data.tags} {...data_params} />;
}

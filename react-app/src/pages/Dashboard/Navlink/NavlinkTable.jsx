import { Add, Delete, Edit, Web } from "@mui/icons-material";
import { Button, ImageListItem, Link, Stack, Tooltip, Chip } from "@mui/material";
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
import { timeConverter } from "../../../utils/datetime";

import { useGetNavlinksQuery, useDeleteNavlinkMutation } from "../../../api/navlink";
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
    id: "linkname",
    numeric: true,
    label: "name",
  },

  {
    id: "url",
    numeric: false,
    label: "url",
  },

  {
    id: "shortstr",
    numeric: false,
    label: "shortstr",
  },
  {
    id: "order",
    numeric: false,
    label: "order",
  },

  {
    id: "status",
    numeric: false,
    label: "status",
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
    id: "action",
    numeric: false,
    label: "action",
  },
];

export const NavlinkTableComponet = ({ order, total, orderBy, page, rowsPerPage, tabledata }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState(null);

  const [deleteNavlink] = useDeleteNavlinkMutation();

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
      <Paper variant="outlined">
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 8 } }}>
          <Typography sx={{ pl: 4, flexGrow: 1, textTransform: "capitalize" }}>{t("navlink")}</Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            sx={{ flexGrow: 0 }}
            component={RouteLink}
            to="/admin/navlink/create"
          >
            {t("add")}
          </Button>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="Navlink Table" size="small">
            <AdminTableHead headCells={headCells} order={order} orderBy={orderBy} />
            <TableBody>
              {tabledata.map(
                ({ id, linkname, url, description, favicon, shortstr, order, status, created_at, tags }) => {
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
                        <Tooltip title={description ? description : linkname}>
                          <Typography sx={{ maxWidth: 360 }}>{linkname}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left" sx={{ maxWidth: 280 }}>
                        <Tooltip title={url} placement="bottom-start">
                          <Link href={`${url}`} underline="none" target="_blank">
                            <Stack direction={"row"} spacing={1}>
                              <ImageListItem sx={{ width: 16, height: 16 }}>
                                {favicon ? <img src={favicon}></img> : <Web fontSize="small" color="primary" />}
                              </ImageListItem>
                              <Typography variant="body2" noWrap>
                                {url}
                              </Typography>
                            </Stack>
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">{shortstr}</TableCell>
                      <TableCell align="center">{order}</TableCell>
                      <TableCell align="center">{`${status}`.toLowerCase()}</TableCell>
                      <TableCell align="center">
                        {tags.map((t) => (
                          <Chip key={t.id} underline="none" label={t.name} clickable size="small" sx={{ ml: 1 }}></Chip>
                        ))}
                      </TableCell>

                      <TableCell align="center">{timeConverter(created_at)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          startIcon={<Edit />}
                          sx={{ mr: 1, width: 100, mb: 1 }}
                          component={RouteLink}
                          to={`/admin/navlink/${id}/edit`}
                          state={{ from: location }}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          startIcon={<Delete />}
                          sx={{ mr: 1, width: 100, mb: 1 }}
                          onClick={() => deleteNavlink(id)}
                        >
                          {t("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 50 * emptyRows,
                  }}
                >
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AdminTablePagination total={total} rowsPerPage={rowsPerPage} page={page} />
      </Paper>
    </Box>
  );
};

export default function NavlinkTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = paramsToObject(searchParams.entries());
  const { data, isLoading } = useGetNavlinksQuery({ params });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data || data?.msg === "error") return <Typography>Loading Missing! {`${data?.error}`} </Typography>;
  const data_params = {
    page: data.page,
    rowsPerPage: data.per_page,
    total: data.total,
    order: data.order,
    orderBy: data.order_by,
  };

  return <NavlinkTableComponet tabledata={data.navlinks} {...data_params} />;
}
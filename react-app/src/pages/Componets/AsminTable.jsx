import * as React from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import {
  Link as RouteLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import { paramsToObject } from "../../utils/converter";
import { useTranslation } from "react-i18next";

export function AdminTableHead({ headCells, order, orderBy }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    const params = paramsToObject(searchParams.entries());
    params.order_by = property;
    params.order = isAsc ? "desc" : "asc";
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams(params)}`,
    });
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              hideSortIcon
              onClick={headCell.numeric ? createSortHandler(headCell.id) : null}
              sx={{ minWidth: 40 }}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

AdminTableHead.propTypes = {
  headCells: PropTypes.array.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export const AdminTablePagination = ({ page, rowsPerPage, total }) => {
  const rowsPerPageOptions = [10, 20, 50];
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    const params = paramsToObject(searchParams.entries());
    params.page = newPage + 1 > 0 ? newPage + 1 : 1;

    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams(params)}`,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    const perPage = parseInt(event.target.value, rowsPerPageOptions[0]);
    const params = paramsToObject(searchParams.entries());
    params.per_page = perPage;
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams(params)}`,
    });
  };

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={page - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

AdminTablePagination.propTypes = {
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  total: PropTypes.number,
};

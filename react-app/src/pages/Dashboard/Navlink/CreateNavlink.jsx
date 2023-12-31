import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  Snackbar,
} from "@mui/material";

import { AddLink } from "@mui/icons-material";
import { useCreateNavlinkMutation, useReqNavlinkQuery, useUpdateNavlinkMutation } from "../../../api/navlink";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import TagsSelect from "../../Componets/TagsSelect";
import { setSelectTags } from "../../Componets/tagSlice";
import { useTranslation } from "react-i18next";

const PUBLISHED = "PUBLISHED";
const PRIVATE = "PRIVATE";
const DELETE = "DELETE";

export const Navlink = ({ navlink, handleSucess }) => {
  const initNavlink = { status: PUBLISHED, ...navlink };
  const { t } = useTranslation();

  const [newNavlink, setNewNavlink] = useState(initNavlink);
  const [snackBarOption, setSnackBarOption] = useState({
    open: false,
    message: "",
  });
  const [error, setError] = useState({});
  const [createNavlink, createNavlinkResult] = useCreateNavlinkMutation();
  const [updateNavlink, updateNavlinkResult] = useUpdateNavlinkMutation();
  const navlinkId = newNavlink?.id;

  const tag = useSelector((state) => state.tag);

  const handleNavlink = (nav) => {
    setNewNavlink({ ...newNavlink, ...nav });
  };

  const handleCreateNavlink = async () => {
    let data;
    const newNav = { ...newNavlink };
    newNav.tags = tag.selectTags;
    if (navlinkId) {
      data = await updateNavlink({
        navlinkId,
        navlink: { ...newNav },
      }).unwrap();
    } else {
      data = await createNavlink({ ...newNav }).unwrap();
    }
    if (data?.msg === "OK") {
      setError(null);
      if (!!handleSucess) {
        handleSucess(data);
      }
    } else if (data?.msg === "error") {
      setError(data.error);
    }
  };
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {" "}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AddLink />
        </Avatar>
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
          {t("create navlink")}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="linkname"
                label={t("linkname")}
                required
                fullWidth
                autoFocus
                variant="filled"
                value={newNavlink?.linkname || ""}
                onChange={(e) => handleNavlink({ linkname: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="url"
                label={t("url")}
                required
                fullWidth
                variant="filled"
                value={newNavlink?.url || ""}
                onChange={(e) => handleNavlink({ url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="favicon"
                label={t("favicon")}
                fullWidth
                value={newNavlink?.favicon || ""}
                onChange={(e) => handleNavlink({ favicon: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction={"row"} spacing={4} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <TextField
                  name="shortstr"
                  label={t("shortstr")}
                  sx={{ width: 120 }}
                  value={newNavlink?.shortstr || ""}
                  onChange={(e) => handleNavlink({ shortstr: e.target.value })}
                />
                <TextField
                  name="order"
                  label={t("order")}
                  type="number"
                  sx={{ width: 80 }}
                  value={newNavlink?.order || 0}
                  onChange={(e) => handleNavlink({ order: e.target.value })}
                />
                <FormControl>
                  <InputLabel id="select-status-label">{t("status")}</InputLabel>
                  <Select
                    labelId="select-status-label"
                    id="select-status"
                    value={newNavlink.status || PUBLISHED}
                    label={t("status")}
                    sx={{ width: 120 }}
                    onChange={(e) => handleNavlink({ status: e.target.value })}
                  >
                    <MenuItem value={PUBLISHED}>{t("published")}</MenuItem>
                    <MenuItem value={PRIVATE}>{t("private")}</MenuItem>
                    <MenuItem value={DELETE}>{t("delete")}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TagsSelect />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label={t("description")}
                multiline
                rows={5}
                // minRows={4}
                // maxRows={8}
                fullWidth
                value={newNavlink?.description || ""}
                onChange={(e) => handleNavlink({ description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleCreateNavlink}>
                {navlinkId !== undefined ? t("update") : t("create")}
              </Button>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={snackBarOption.open}
          message={snackBarOption.message}
        />
      </Box>
    </Container>
  );
};

const CreateNavlink = () => {
  const { navlinkId } = useParams();
  const { data, isFetching } = useReqNavlinkQuery(navlinkId, {
    skip: !!!navlinkId,
    refetchOnMountOrArgChange: true,
  });
  const navlink = data?.navlink || {};
  const tags = navlink?.tags || [];
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setSelectTags({ selectTags: tags }));
  }, [data]);
  const handleSucess = (data) => {
    const from = location.state?.from?.pathname;
    const search = location.state?.from?.search;
    navigate(!!from ? `${from}${search}` : `/admin/navlink/list`);
  };
  if (isFetching) return <Typography>Loading...</Typography>;
  return <Navlink {...{ navlink, handleSucess }} />;
};

export default CreateNavlink;

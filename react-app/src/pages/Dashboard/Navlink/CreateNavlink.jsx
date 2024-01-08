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
import { useForm, Controller } from "react-hook-form";

import TagsSelect from "../../Componets/TagsSelect";
import { setSelectTags } from "../../Componets/tagSlice";
import { useTranslation } from "react-i18next";

const PUBLISHED = "PUBLISHED";
const PRIVATE = "PRIVATE";
const DELETE = "DELETE";

export const Navlink = ({ navlink, handleSucess }) => {
  const { t } = useTranslation();
  const defaultValues = {
    linkname: "",
    url: "",
    favicon: "",
    shortstr: "",
    order: 0,
    status: PUBLISHED,
    description: "",
    ...navlink,
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  useEffect(() => {
    reset({ ...defaultValues });
  }, [navlink]);
  const [snackBarOption, setSnackBarOption] = useState({
    open: false,
    message: "",
  });
  const [error, setError] = useState("");
  const [createNavlink, createNavlinkResult] = useCreateNavlinkMutation();
  const [updateNavlink, updateNavlinkResult] = useUpdateNavlinkMutation();
  const navlinkId = navlink?.id;

  const tag = useSelector((state) => state.tag);

  const onSubmit = async (data) => {
    const newNav = { ...data };
    newNav.tags = tag.selectTags;
    let response;
    if (navlinkId) {
      response = await updateNavlink({
        navlinkId,
        navlink: { ...newNav },
      }).unwrap();
    } else {
      response = await createNavlink({ ...newNav }).unwrap();
    }
    if (response?.msg === "OK") {
      setError(null);
      if (!!handleSucess) {
        handleSucess(response);
      }
    } else if (response?.msg === "error") {
      setError(response.error);
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
                error={!!errors.linkname}
                {...register("linkname", {
                  required: true,
                  minLength: { value: 1, message: t("minLength error", { name: t("linkname"), length: 1 }) },
                  maxLength: { value: 50, message: t("maxLength error", { name: t("linkname"), length: 50 }) },
                })}
                helperText={!!errors.linkname && errors.linkname.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="url"
                label={t("url")}
                required
                fullWidth
                variant="filled"
                error={!!errors.url}
                {...register("url", {
                  required: true,
                  minLength: { value: 1, message: t("minLength error", { name: t("url"), length: 1 }) },
                  maxLength: { value: 500, message: t("maxLength error", { name: t("url"), length: 500 }) },
                })}
                helperText={!!errors.url && errors.url.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="favicon"
                label={t("favicon")}
                fullWidth
                error={!!errors.favicon}
                {...register("favicon", {
                  maxLength: { value: 500, message: t("maxLength error", { name: t("favicon"), length: 500 }) },
                })}
                helperText={!!errors.favicon && errors.favicon.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction={"row"} spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <TextField
                  name="shortstr"
                  label={t("shortstr")}
                  error={!!errors.shortstr}
                  {...register("shortstr", {
                    maxLength: { value: 50, message: t("maxLength error", { name: t("shortstr"), length: 50 }) },
                  })}
                  helperText={!!errors.shortstr && errors.shortstr.message}
                />
                <TextField
                  name="order"
                  label={t("order")}
                  type="number"
                  sx={{ width: 80 }}
                  error={!!errors.order}
                  {...register("order", {
                    maxLength: { max: 10000, message: t("max value error", { name: t("order"), value: 10000 }) },
                  })}
                  helperText={!!errors.order && errors.order.message}
                />
                <FormControl sx={{ width: 120 }}>
                  <InputLabel id="select-status-label">{t("status")}</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="select-status-label" id="select-status" label={t("status")}>
                        <MenuItem value={PUBLISHED}>{t("published")}</MenuItem>
                        <MenuItem value={PRIVATE}>{t("private")}</MenuItem>
                        <MenuItem value={DELETE}>{t("delete")}</MenuItem>
                      </Select>
                    )}
                  />
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
                fullWidth
                error={!!errors.description}
                {...register("description", {
                  maxLength: { value: 500, message: t("maxLength error", { name: t("description"), length: 500 }) },
                })}
                helperText={!!errors.description && errors.description.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
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
  const { t } = useTranslation();
  const { data, isFetching } = useReqNavlinkQuery(navlinkId, {
    skip: !!!navlinkId,
    refetchOnMountOrArgChange: true,
  });
  const navlink = !!navlinkId ? data?.navlink : {};
  const tags = navlink?.tags || [];
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setSelectTags({ selectTags: tags }));
  }, [navlink]);
  const handleSucess = (data) => {
    const from = location.state?.from?.pathname;
    const search = location.state?.from?.search;
    navigate(!!from ? `${from}${search}` : `/admin/navlink/list`);
  };
  if (isFetching) return <Typography>{t("Loading...")}</Typography>;
  return <Navlink {...{ navlink, handleSucess }} />;
};

export default CreateNavlink;

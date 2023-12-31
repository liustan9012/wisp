import React, { useState } from "react";
import LabelIcon from "@mui/icons-material/Label";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetTagQuery, useNewTagMutation, useUpdateTagMutation } from "../../../api/tag";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function TagComponet({ tag }) {
  const { t } = useTranslation();
  const [name, setName] = useState(tag?.name || "");
  const [error, setError] = useState("");
  const [updateTag] = useUpdateTagMutation();
  const [newTag] = useNewTagMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdated = !!tag?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (isUpdated) {
        data = await updateTag({ tagId: tag?.id, name }).unwrap();
      } else {
        data = await newTag({ name }).unwrap();
      }
      if (data?.msg === "OK") {
        setError("");
        const from = location.state?.from?.pathname;
        const search = location.state?.from?.search;
        navigate(!!from ? `${from}${search}` : `/admin/tag/list`);
      } else if (data?.msg === "error") {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LabelIcon />
      </Avatar>
      <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
        {isUpdated ? t(`update tag`) : t(`create tag`)}
      </Typography>
      <Box component="form" noValidate sx={{ mt: 5, minWidth: 360 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              label={t("name")}
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" color="error.main" gutterBottom>
          {error ? error : ""}
        </Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 5, mb: 2 }} onClick={handleSubmit}>
          {isUpdated ? t(`update`) : t(`create`)}
        </Button>
      </Box>
    </Box>
  );
}

export default function CreateTag() {
  const { tagId } = useParams();
  const { data, isFetching } = useGetTagQuery(tagId, {
    skip: !!!tagId,
    refetchOnMountOrArgChange: true,
  });
  if (isFetching) return <Typography>Loading...</Typography>;
  const tag = data?.tag || {};
  return <TagComponet tag={tag} />;
}

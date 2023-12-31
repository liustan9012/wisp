import { Web } from "@mui/icons-material";
import { Button, Grid, ImageListItem, Stack, Typography, Tooltip, Paper, Box, Link } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navlink = ({ tag }) => {
  const { id, linkname, favicon, url, description } = tag;
  const initElevation = 2;
  const [elevation, setElevation] = useState(initElevation);

  return (
    <Grid
      component={Paper}
      item
      // xs={5}
      // md={3}
      // lg={2}
      sx={{ mb: 2, mr: 2, maxWidth: 200 }}
      // sx={{ mb: 2, mr: 2, width: { xs: 160, sm: 200 }, flex: { xs: 1, md: 0 } }}
      elevation={elevation}
      onMouseEnter={(e) => setElevation(8)}
      onMouseLeave={(e) => setElevation(initElevation)}
    >
      <Link
        key={id}
        href={url}
        underline="none"
        target="_blank"
        color="inherit"
        sx={{
          padding: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <ImageListItem sx={{ display: "flex", alignItems: "center" }}>
            {favicon ? (
              <img src={favicon} art="" style={{ width: 32, height: 32 }} />
            ) : (
              <Web fontSize="small" color="primary" />
            )}
          </ImageListItem>
          <Typography
            align="left"
            noWrap
            color={"primary"}
            sx={{
              pl: 1,
              width: { xs: 150 },
              overflow: "hidden",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {linkname}
          </Typography>
        </Stack>
        <Tooltip title={description} enterDelay={1000} enterNextDelay={1000} leaveDelay={200}>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              height: 40,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "none",
            }}
          >
            {description || ""}
          </Typography>
        </Tooltip>
      </Link>
    </Grid>
  );
};

const NavlinkTable = ({ tagNavlinks }) => {
  const {t} = useTranslation()
  return (
    <Box sx={{ mt: 4 }}>
      {tagNavlinks.map(([tag, navlinks]) => (
        <Stack key={tag.id}>
          <Typography id={tag.name} variant="h5" sx={{ p: 1, fontWeight: "bold", textTransform: "capitalize" }}>
            {tag.name === "default" ? t("default tag") : tag.name}
          </Typography>
          <Grid container>
            {navlinks.map((tag) => (
              <Navlink key={tag.id} tag={tag} />
            ))}
          </Grid>
        </Stack>
      ))}
    </Box>
  );
};

export default NavlinkTable;

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
      lg={2}
      sm={3}
      xs={5}
      sx={{
        m: 2,
        // width: {  lg: 180 }, flex: {  lg: 0 }
      }}
      draggable
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
              <img
                src={favicon}
                art={<Web fontSize="small" color="primary" />}
                loading="lazy"
                style={{ maxWidth: 32, maxHeight: 32 }}
              />
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
              width: { xs: 160 },
              fontWeight: "bold",
              overflow: "hidden",
            }}
          >
            {linkname}
          </Typography>
        </Stack>
        <Tooltip
          title={!!description ? description : linkname}
          enterDelay={1000}
          enterNextDelay={1000}
          leaveDelay={200}
        >
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              height: 40,
              overflow: "hidden",
              overflowWrap: "anywhere",
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
  const { t } = useTranslation();
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

import { useEffect, useState } from "react"
import { Web } from "@mui/icons-material"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  ImageListItem,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"

const Navlink = ({ navlink, editable, handleNavlink }) => {
  const { id, linkname, favicon, url, description } = navlink
  const initElevation = 2
  const [elevation, setElevation] = useState(initElevation)

  return (
    <Grid
      component={Paper}
      item
      lg={2}
      sm={3}
      xs={5}
      sx={{
        m: 1.5,
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
          padding: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              flexGrow: 1,
            }}
          >
            <ImageListItem sx={{ display: "flex", alignItems: "center" }}>
              {favicon ? (
                <img
                  src={favicon}
                  art={<Web fontSize="small" color="primary" />}
                  loading="lazy"
                  style={{ width: 32, height: 32 }}
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
                maxWidth: { xs: 160 },
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {linkname}
            </Typography>
          </Box>
          {editable ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                handleNavlink()
              }}
              sx={{ p: 0 }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Box>
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
  )
}

const NavlinkTable = ({
  tagNavlinks,
  editable,
  handleDone,
  handleAddNavlink,
  handleEditNavlink,
}) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ mt: 4 }}>
      {tagNavlinks.map(([tag, navlinks]) => (
        <Stack key={tag.id}>
          <Stack direction={"row"}>
            <Typography
              id={tag.name}
              variant="h5"
              sx={{ p: 1, fontWeight: "bold", textTransform: "capitalize" }}
            >
              {tag.name === "default" ? t("default tag") : tag.name}
            </Typography>
          </Stack>
          <Grid container>
            {navlinks.map((navlink) => (
              <Navlink
                key={navlink.id}
                navlink={navlink}
                editable={editable}
                handleNavlink={handleEditNavlink(navlink)}
              />
            ))}
            {editable ? (
              <ButtonGroup variant="outlined" sx={{ m: 1.5 }}>
                <Button onClick={handleAddNavlink(tag)}>{t("add")} </Button>
                <Button onClick={handleDone}>{t("done")}</Button>
              </ButtonGroup>
            ) : (
              ""
            )}
          </Grid>
        </Stack>
      ))}
    </Box>
  )
}

export default NavlinkTable

import React, { useState } from "react"
import { ArrowRight } from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/Close"
import MenuIcon from "@mui/icons-material/Menu"
import {
  AppBar,
  Box,
  Button,
  Container,
  DialogActions,
  Drawer,
  IconButton,
  ImageListItem,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import { useTranslation } from "react-i18next"
import { Link as RouterLink } from "react-router-dom"

import { useDeleteNavlink, useLinks } from "../../api/navlink"
import { useTagStore } from "../../store"
import LanguageToggle from "../Componets/LanguageTogole"
import LightModeToggle from "../Componets/LightToggle"
import UserAvatar from "../Componets/UserAvatar"
import { Navlink } from "../Dashboard/Navlink/CreateNavlink"
import NavlinkTable from "./NavlinkTable"
import { SearchButtons } from "./Search"

const EditAction = "EditAction"
const DeleteAction = "DeleteAction"

const scrollToElement = ({ elementId, offset }) => {
  const element = document.getElementById(elementId)
  const elementToTop = element?.getBoundingClientRect().top || 0
  let offsetTop = elementToTop + window.scrollY + offset
  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  })
}

const SideBar = ({ tags }) => {
  const [selected, setSelected] = useState(tags[0]?.id)
  const { t } = useTranslation()

  const handleClickMenu = ({ tag }) => {
    let offset = -75
    if (tag.name === "default") {
      offset += -160
    }
    scrollToElement({ elementId: tag.name, offset })
    setSelected(tag.id)
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        component={RouterLink}
        to="/navlink"
        underline="none"
        color={"inherit"}
        variant="h6"
        sx={{
          p: 2,
          pl: 8,
          textTransform: "capitalize",
        }}
      >
        {t("navlink")}
      </Link>
      {tags.map((tag) => {
        return (
          <Button
            key={tag.id}
            onClick={(e) => handleClickMenu({ tag })}
            sx={{
              pl: 8,
              pr: 4,
              height: 50,
              justifyContent: "flex-start",
              textTransform: "capitalize",
            }}
            color={tag.id === selected ? "secondary" : "inherit"}
            endIcon={tag.id === selected ? <ArrowRight /> : ""}
          >
            {tag.name}
          </Button>
        )
      })}
    </Box>
  )
}

const DeleteNavlinkDialog = ({ open, navlink, handleClose }) => {
  const { t } = useTranslation()
  const { trigger: deleteNavlink } = useDeleteNavlink()
  const handleDeleteNavlink = async () => {
    await deleteNavlink(navlink.id)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} sx={{ flex: 1 }} fullWidth>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 4 }}>
        <Stack direction={"row"} spacing={1}>
          <ImageListItem sx={{ display: "flex", alignItems: "center" }}>
            {navlink?.favicon ? (
              <img
                src={navlink?.favicon}
                loading="lazy"
                style={{ width: 32, height: 32 }}
              />
            ) : (
              <Web fontSize="small" color="primary" />
            )}
          </ImageListItem>
          <Typography variant="h6">{navlink.linkname}</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {navlink.description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button color="warning" onClick={handleDeleteNavlink}>
          {t("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const NavlinkDialog = ({ open, action, navlink, handleClose }) => {
  if (action == DeleteAction) {
    return (
      <DeleteNavlinkDialog
        {...{
          open,
          navlink,
          handleClose,
        }}
      />
    )
  }
  return (
    <Dialog open={open} onClose={handleClose} sx={{ flex: 1 }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 4 }}>
        <Navlink navlink={navlink} handleSucess={handleClose} />
        {/* <CreateNavlink /> */}
      </DialogContent>
    </Dialog>
  )
}

const bgImage = {
  backgroundImage: "url(/imgs/BACKGROUND.png)",
  backgroundPositionX: "left",
  backgroundRepeat: "no-repeat",
  backgroundSize: "auto 100% ",
  backgroundAttachment: "fixed",
}

const Navlinks = (props) => {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [newNavOpen, setNewNavOpen] = useState(false)
  const [editable, setEditable] = useState(false)
  const [navlink, setNavlink] = useState(null)
  const [action, setAction] = useState(EditAction)
  const setSelectTags = useTagStore((state) => state.setSelectTags)
  const handleAddNavlink = (tag) => () => {
    const tags = tag.name === "default" ? [] : [tag]
    setSelectTags(tags)
    setAction(EditAction)
    setNavlink(null)
    setNewNavOpen(!newNavOpen)
  }
  const handleEditNavlink = (navlink) => () => {
    setSelectTags(navlink.tags)
    setNavlink(navlink)
    setNewNavOpen(!newNavOpen)
  }

  const handleDeleteNavlink = (navlink) => () => {
    setSelectTags(navlink.tags)
    setAction(DeleteAction)
    setNavlink(navlink)
    setNewNavOpen(!newNavOpen)
  }

  const handleDone = () => {
    setEditable(!editable)
  }

  const handleClose = () => {
    setNewNavOpen(!newNavOpen)
    setAction(EditAction)
    setNavlink(null)
    mutate()
  }

  const { data, isLoading, mutate } = useLinks()
  const tagNavlinks = data?.tag_navlinks || []
  // useEffect(() => {
  //     const bodyStyle = document.body.style
  //     Object.keys(bgImage).forEach((key) => {
  //         document.body.style[key] = bgImage[key]
  //     })

  //     return () => {
  //         document.body.style = bodyStyle
  //     }
  // }, [])

  const drawerWidth = 200
  return (
    <Container disableGutters maxWidth={"xl"} sx={{ display: "flex" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: drawerWidth,
          height: "100vh",
          display: { md: "flex", xs: "none" },
        }}
      >
        <SideBar tags={tagNavlinks.map(([tag, navlinks]) => tag)} />
      </Box>
      <Box
        component="nav"
        sx={{
          display: { md: "none", xs: "flex" },
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            p: 5,
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <SideBar tags={tagNavlinks.map(([tag, navlinks]) => tag)} />
        </Drawer>
      </Box>
      <Box sx={{ flex: 1 }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={3}
          sx={{
            boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2)",
            // 0px 3px 3px -2px rgba(0,0,0,0.2),
            // 0px 3px 4px 0px rgba(0,0,0,0.14),
            // 0px 1px 8px 0px rgba(0,0,0,0.12)
          }}
        >
          <Toolbar disableGutters sx={{ width: 1 }}>
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{
                flexGrow: 0,
                display: { md: "none", xs: "flex" },
                ml: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ flexGrow: 1 }} align="center"></Typography>
            <Box sx={{ flexGrow: 0, pr: 2 }}>
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Button component={RouterLink} to="/" underline="none">
                  <Typography variant="button">{t("home")}</Typography>
                </Button>
                <LanguageToggle color="primary" />
                <LightModeToggle color="primary" />
                <UserAvatar
                  adminMenus={[
                    {
                      key: t("edite"),
                      to: "",
                      onClick: () => setEditable(!editable),
                    },
                  ]}
                />
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
        <SearchButtons></SearchButtons>
        {isLoading ? (
          <Typography>NavLinkPage </Typography>
        ) : (
          <NavlinkTable
            tagNavlinks={tagNavlinks}
            editable={editable}
            handleDone={handleDone}
            handleAddNavlink={handleAddNavlink}
            handleEditNavlink={handleEditNavlink}
            handleDeleteNavlink={handleDeleteNavlink}
          />
        )}
      </Box>
      <NavlinkDialog
        open={newNavOpen}
        action={action}
        navlink={navlink}
        handleClose={handleClose}
      />
    </Container>
  )
}

export default Navlinks

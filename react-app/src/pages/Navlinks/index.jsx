import * as React from "react";

import {
  Container,
  Typography,
  Button,
  Box,
  Toolbar,
  Drawer,
  IconButton,
  Link,
  AppBar,
  TextField,
  Stack,
} from "@mui/material";
import { useGetLinksQuery } from "../../api/navlink";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { SearchButtons } from "./Search";
import UserAvatar from "../Componets/UserAvatar";
import NavlinkTable from "./NavlinkTable";
import { ArrowRight } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Link as RouterLink } from "react-router-dom";
import { Navlink } from "../Dashboard/Navlink/CreateNavlink";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import LightModeToggle from "../Componets/LightToggle";
import LanguageToggle from "../Componets/LanguageTogole";

const scrollToElement = ({ elementId, offset }) => {
  const element = document.getElementById(elementId);
  const elementToTop = element?.getBoundingClientRect().top || 0;
  const offsetTop = elementToTop + window.scrollY + offset;
  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
};

const SideBar = ({ tags }) => {
  const [selected, setSelected] = useState(tags[0].id);
  const { t } = useTranslation();

  const handleClickMenu = ({ tag }) => {
    scrollToElement({ elementId: tag.name, offset: -75 });
    setSelected(tag.id);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        component={RouterLink}
        to="/"
        underline="none"
        color={"inherit"}
        variant="h6"
        sx={{
          p: 2,
          pl: 8,
          // pr: 4,
          textTransform: "capitalize",
        }}
      >
        {t("home")}
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
        );
      })}
    </Box>
  );
};

const NewNavlinkDialog = ({ open, handleClose }) => {
  const handleSucess = (data) => {
    console.log(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{ flex: 1 }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 4 }}>
        <Navlink handleSucess={handleSucess} />
        {/* <CreateNavlink /> */}
      </DialogContent>
    </Dialog>
  );
};

const bgImage = {
  backgroundImage: "url(/imgs/BACKGROUND.png)",
  backgroundPositionX: "left",
  backgroundRepeat: "no-repeat",
  backgroundSize: "auto 100% ",
  backgroundAttachment: "fixed",
};

const Navlinks = (props) => {
  const { data, isLoading } = useGetLinksQuery();
  const { t } = useTranslation();
  const tagNavlinks = data?.tag_navlinks || [];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [newNavOpen, setNewNavOpen] = useState(false);

  // useEffect(() => {
  //     const bodyStyle = document.body.style
  //     Object.keys(bgImage).forEach((key) => {
  //         document.body.style[key] = bgImage[key]
  //     })

  //     return () => {
  //         document.body.style = bodyStyle
  //     }
  // }, [])

  if (isLoading) {
    return (
      <Container disableGutters sx={{ marginTop: 2 }}>
        <Typography>NavLinkPage </Typography>
      </Container>
    );
  }

  const drawerWidth = 200;

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
              <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
                <LanguageToggle color="primary" />
                <LightModeToggle color="primary" />
                <UserAvatar
                  adminMenus={[
                    {
                      key: t("new navlink"),
                      to: "",
                      onClick: () => setNewNavOpen(!newNavOpen),
                    },
                  ]}
                />
                <NewNavlinkDialog open={newNavOpen} handleClose={() => setNewNavOpen(!newNavOpen)} />
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
        <SearchButtons></SearchButtons>
        <NavlinkTable tagNavlinks={tagNavlinks} />
      </Box>
    </Container>
  );
};

export default Navlinks;

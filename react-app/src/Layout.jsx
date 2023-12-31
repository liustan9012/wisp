import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Outlet, useMatch } from "react-router-dom";

import Header from "./pages/Header";
import Footer from "./pages/Footer";
// import DashboardAppBar from './pages/Dashboard/DashboardAppBar';
// import DashboardDrawer from './pages/Dashboard/DashboardDrawer';
import { DrawerHeader, Main, DashboardDrawer, DashboardAppBar } from "./pages/Dashboard";

export default function Layout() {
  return (
    <>
      <Header />
      <Container
        sx={{
          flex: "1 1 auto",
          flexGrow: 1,
        }}
        maxWidth="lg"
      >
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export function AdminLayout() {
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <DashboardAppBar {...{ open, handleDrawerOpen }} />
        <DashboardDrawer {...{ open, handleDrawerClose }} />
        <Main open={open}>
          <DrawerHeader />
          <Outlet />
        </Main>
      </Box>
    </>
  );
}

export function AccountLayout() {
  return (
    <>
      <Container
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

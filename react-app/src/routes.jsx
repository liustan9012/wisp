import React from "react";
import { NavLink, createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";

import About from "./pages/About";

import Layout, { AdminLayout, AccountLayout } from "./Layout";
import { RequireAuth } from "./context";
import ErrorPage, { NoMatch } from "./pages/ErrorPage";
import Post from "./pages/Post";
import PostList from "./pages/PostList";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import TimeLine from "./pages/Timeline";
import TagPage from "./pages/Tag";
import TagsPage from "./pages/Tags";

import { NewPost, PostTable } from "./pages/Dashboard/Post";
import { TagTable, CreateTag } from "./pages/Dashboard/Tag";
import { CreateUser, UserTable } from "./pages/Dashboard/User";
import { CommentTable } from "./pages/Dashboard/Comment";
import { NavlinkTable, NewNavlink } from "./pages/Dashboard/Navlink";
import Navlinks from "./pages/Navlinks";
import Settings from "./pages/Settings";
import { Tune } from "@mui/icons-material";
import Dataset from "./pages/Dashboard/Dateset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <PostList />,
          },
          {
            path: "post/:postId",
            element: <Post />,
          },
          {
            path: "posts",
            element: <PostList />,
          },
          {
            path: "tags",
            element: <TagsPage />,
          },
          {
            path: "tag/:tagId",
            element: <TagPage />,
          },
          {
            path: "timeline",
            element: <TimeLine />,
          },
          {
            path: "post/new",
            element: (
              <RequireAuth>
                <NewPost />
              </RequireAuth>
            ),
          },

          {
            path: "about",
            element: <About />,
          },

          {
            path: "/error",
            element: <ErrorPage />,
          },
          {
            path: "*",
            element: <NoMatch />,
          },
        ],
      },
    ],
  },
  {
    path: "navlink",
    // async lazy() {
    //   let Navlinks = await import("./pages/Navlinks");
    //   return { Component: Navlinks.default };
    // },
    element: <Navlinks />,
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "user/list",
            element: <UserTable />,
          },
          {
            path: "user/create",
            element: <CreateUser />,
          },
          {
            path: "post",
            element: <PostTable />,
          },
          {
            path: "post/list",
            element: <PostTable />,
          },
          {
            path: "post/create",
            element: <NewPost />,
          },
          {
            path: "post/:postId",
            element: <Post />,
          },
          {
            path: "post/:postId/edit",
            element: <NewPost />,
          },
          {
            path: "tag/list",
            element: <TagTable />,
          },
          {
            path: "tag/:tagId",
            element: <TagPage />,
          },
          {
            path: "tag/:tagId/edit",
            element: <CreateTag />,
          },
          {
            path: "tag/create",
            element: <CreateTag />,
          },
          {
            path: "comment/list",
            element: <CommentTable />,
          },
          {
            path: "navlink/list",
            element: <NavlinkTable />,
          },
          {
            path: "navlink/create",
            element: <NewNavlink />,
          },
          {
            path: "navlink/:navlinkId/edit",
            element: <NewNavlink />,
          },
          {
            path: "dataset",
            element: <Dataset />,
          },

          {
            path: "*",
            element: <NoMatch />,
          },
        ],
      },
    ],
  },

  {
    path: "/signin",
    element: <AccountLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
    ],
  },
  {
    path: "/signup",
    element: <AccountLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/settings",
    element: <AccountLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: Tune,
        element: <Settings />,
      },
      ,
    ],
  },
]);

export default router;

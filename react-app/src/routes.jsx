import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from "./pages/Home";

import About from "./pages/About";

import Layout, { AdminLayout } from "./Layout";
import { RequireAuth } from "./context";
import ErrorPage, { NoMatch } from './pages/ErrorPage';
import Post from './pages/Post';
import PostList from "./pages/PostList";
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import TimeLine from './pages/TImeLine';
import TagPage from './pages/Tag';
import TagsPage from './pages/Tags';

import { NewPost, PostTable } from './pages/Dashboard/Post';
import { TagTable, CreateTag } from './pages/Dashboard/Tag';
import { CreateUser, UserTable } from './pages/Dashboard/User';
import { CommentTable } from './pages/Dashboard/Comment';


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
            element: <Home />,
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
            element: <RequireAuth><NewPost /></RequireAuth>,
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
        ]
      },
    ],
  },

  {
    path: "/admin",
    element: <RequireAuth><AdminLayout /></RequireAuth>,
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
            path: "*",
            element: <NoMatch  />,
          },
        ]
      }
    ]
  },

  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },


])

export default router

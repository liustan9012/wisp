import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import request from "./request"

export const useHello = () => {
  return useSWR("/hello", fetch)
}

const createPost = async (key, { arg: post }) => {
  return await request(key, { body: post })
}

export const useCreatePost = () => {
  return useSWRMutation({ url: `/post`, method: "post" }, createPost)
}

const updatePost = async (key, { arg: { postId, post } }) => {
  return await request(
    { url: `/post/${postId}`, method: "post" },
    { body: post }
  )
}

export const useUpdatePost = () => {
  return useSWRMutation({ url: `/post/update`, method: "post" }, updatePost)
}

const deletePost = async (key, { arg: postId }) => {
  return await request({ url: `/post/${postId}/delete`, method: "post" })
}
export const useDeletePost = () => {
  return useSWRMutation({ url: `/post/delete`, method: "post" }, deletePost)
}

export const usePost = (postId) => {
  return useSWR(postId ? { url: `/post/${postId}` } : null, request)
}

export const usePostList = (searchParams) => {
  return useSWR({ url: `/posts`, searchParams }, request)
}

import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import request from "./request"

const createComment = async (key, { arg: { content, parentId, postId } }) => {
  return await request(
    { url: `/post/${postId}/comment/add`, method: "post" },
    { body: { content, parent_id: parentId } }
  )
}

export const useCreateComment = () => {
  return useSWRMutation(
    { url: `/post/postId/comment/add`, method: "post" },
    createComment
  )
}

const deleteComment = async (key, { arg: commentId }) => {
  return await request({ url: `/comment/${commentId}/delete`, method: "post" })
}

export const useDeleteComment = () => {
  return useSWRMutation(
    { url: `/comment/commentId/delete`, method: "post" },
    deleteComment
  )
}

export const usePostComments = (postId) => {
  const { data, error, isLoading, mutate } = useSWR(
    { url: `/post/${postId}/comments`, searchParams },
    request
  )
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useComments = (searchParams) => {
  const { data, error, isLoading, mutate } = useSWR(
    { url: `/comments`, searchParams },
    request
  )
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

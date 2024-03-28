import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import request from "./request"

export const useTags = () => {
  const { data, error, isLoading, mutate } = useSWR({ url: `/tags` }, request)
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useTagsList = (searchParams) => {
  const { data, error, isLoading, mutate } = useSWR(
    { url: `/tags/list`, searchParams },
    request
  )
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

const createTag = async (key, { arg: { name } }) => {
  return await request(key, { body: { name } })
}

export const useCreateTag = () => {
  return useSWRMutation({ url: `/tag`, method: "post" }, createTag)
}

const deleteTag = async (key, { arg: tagId }) => {
  return await request({ url: `/tag/${tagId}/delete`, method: "post" })
}

export const useDeleteTag = () => {
  return useSWRMutation({ url: `/tag/tagId/delete`, method: "post" }, deleteTag)
}

const updateTag = async (key, { arg: { tagId, name, contentType } }) => {
  return await request(
    { url: `/tag/${tagId}`, method: "post" },
    { body: { name, content_type: contentType } }
  )
}

export const useUpdateTag = () => {
  return useSWRMutation({ url: `/tag/tagId/update`, method: "post" }, updateTag)
}

export const useTagsPosts = () => {
  const { data, error, isLoading } = useSWR({ url: `/tags/posts` }, request)
  return {
    data: data,
    isLoading,
    isError: error,
  }
}

export const useTag = (tagId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    tagId ? { url: `/tag/${tagId}` } : null,
    request
  )
  return {
    data: data,
    isLoading,
    isValidating,
    isError: error,
  }
}

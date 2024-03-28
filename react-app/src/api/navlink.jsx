import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import request from "./request"

const createNavlink = async (key, { arg: navlink }) => {
  return await request(key, { body: navlink })
}

export const useCreateNavlink = () => {
  return useSWRMutation({ url: `/navlink`, method: "post" }, createNavlink)
}

const updateNavlink = async (key, { arg: { navlinkId, navlink } }) => {
  return await request(
    { url: `/navlink/${navlinkId}/update`, method: "post" },
    { body: navlink }
  )
}

export const useUpdateNavlink = () => {
  return useSWRMutation(
    { url: `/navlink/update`, method: "post" },
    updateNavlink
  )
}

const deleteNavlink = async (key, { arg: navlinkId }) => {
  return await request({ url: `/navlink/${navlinkId}/delete`, method: "post" })
}

export const useDeleteNavlink = () => {
  return useSWRMutation(
    { url: `/navlink/delete`, method: "post" },
    deleteNavlink
  )
}

export const useLinks = () => {
  const { data, error, isLoading, mutate } = useSWR({ url: `/links` }, request)
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useNavlink = (navlinkId) => {
  const url = `/navlink/${navlinkId}`
  const { data, error, isLoading } = useSWR(navlinkId ? { url } : null, request)
  return {
    data: data,
    isLoading,
    isError: error,
  }
}

export const useNavlinks = (searchParams) => {
  const url = `/navlinks`
  const { data, error, isLoading, mutate } = useSWR(
    { url, searchParams },
    request
  )
  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  }
}

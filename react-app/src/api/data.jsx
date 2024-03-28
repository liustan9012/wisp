import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import request from "./request"

const downloadNavlink = async (key, { arg: downloadParams }) => {
  return await request(key, {
    body: downloadParams,
    responseHandler: (response) => response.text(),
  })
}

export const useDownloadNavlink = () => {
  return useSWRMutation(
    { url: `/navlink/download`, method: "post" },
    downloadNavlink
  )
}

const uploadNavlink = async (key, { arg }) => {
  return await request(key, {
    body: arg,
    headers: {},
    bodyHandler: (body) => body,
    // responseHandler: (response) => response.text(),
  })
}
export const useUploadNavlink = () => {
  return useSWRMutation(
    { url: `/navlink/upload`, method: "post" },
    uploadNavlink
  )
}

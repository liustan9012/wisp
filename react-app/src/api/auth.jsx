import useSWR, { mutate } from "swr"
import useSWRMutation from "swr/mutation"

import { useAuthStore } from "../store"
import request from "./request"

export const useHello = () => {
  return useSWR("/hello", fetch)
}

const signIn = async (key, { arg: { username, password, remember } }) => {
  return await request(key, { body: { username, password, remember } })
}

export const useSignIn = () => {
  return useSWRMutation({ url: `/login`, method: "post" }, signIn)
}

const signUp = async (
  key,
  { arg: { username, email, password1, password2 } }
) => {
  return await request(key, { body: { username, email, password1, password2 } })
}

export const useSignUp = () => {
  return useSWRMutation({ url: `/register`, method: "post" }, signUp)
}

const changePassword = async (
  key,
  { arg: { username, password1, password2 } }
) => {
  return await request(key, { body: { username, password1, password2 } })
}

export const useChangePassword = () => {
  return useSWRMutation(
    { url: `/change_password`, method: "post" },
    changePassword
  )
}

const signOut = async (key, { arg: {} }) => {
  return await request({ url: `/logout`, method: "post" })
}

export const useSignOut = () => {
  return useSWRMutation({ url: `/logout`, method: "post" }, signOut)
}

const deleteUser = async (key, { arg: userid }) => {
  return await request({ url: `/user/${userid}/delete`, method: "post" })
}

export const useDeleteUser = () => {
  return useSWRMutation(
    { url: `/user/userid/delete`, method: "post" },
    deleteUser
  )
}

export const useUsers = (searchParams) => {
  return useSWR({ url: "/users", searchParams, method: "post" }, request)
}

const refresh = async () => {
  return await request({
    url: "/refresh",
    method: "post",
    authorization: "refreshToken",
  })
}

export const useSWROptions = () => {
  const auth = useAuthStore((state) => state.auth)
  const tokenRefresh = useAuthStore((state) => state.tokenRefresh)
  const unsetUser = useAuthStore((state) => state.unsetUser)
  const options = {
    revalidateOnFocus: false,
    onError: async (error, key, config) => {
      if (error.status === 401) {
        if (!!!auth.refreshToken) {
          unsetUser()
        } else {
          const refreshResult = await refresh()
          if (refreshResult?.msg === "OK") {
            tokenRefresh(refreshResult.access_token)
          } else {
            unsetUser()
          }
        }
        mutate(key)
      }
    },
  }
  return options
}

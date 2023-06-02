import { createSlice } from '@reduxjs/toolkit'
import jwt_decode from "jwt-decode";

// const initialState = {

// }

const userKeys = [
  'userid',
  'username',
  'accessToken',
  'refreshToken',
  'isAdmin',
]

const localSetUser = (auth) => {
  localStorage.setItem('auth', JSON.stringify(auth))
}

const localGetUser = () => {

  return JSON.parse(localStorage.getItem('auth') || '{}')
}

const localDeleteUser = () => {
  localStorage.removeItem('auth')
}
// const localSetAccessToken = (accessToken) => {
//   localStorage.setItem('accessToken', JSON.stringify(accessToken))
// }

export const authSlice = createSlice({
  name: 'auth',
  initialState: () => localGetUser(),
  reducers: {
    setUser: (state, action) => {
      const { userid, username, accessToken, refreshToken } = action.payload
      state.userid = userid
      state.username = username
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      const isAdmin = jwt_decode(accessToken).is_admin
      state.isAdmin = isAdmin
      localSetUser(state)
    },
    unsetUser: (state) => {
      state.username = null
      state.userid = null
      state.accessToken = null
      state.refreshToken = null
      state.isAdmin = null
      localDeleteUser()
    },
    tokenReceived: (state, action) => {
      const accessToken = action.payload
      state.accessToken = accessToken
      const isAdmin = jwt_decode(accessToken).is_admin
      state.isAdmin = isAdmin
      localSetUser(state)
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, unsetUser, tokenReceived } = authSlice.actions
export const selectCurrentAuth = (state) => state.auth

export default authSlice.reducer



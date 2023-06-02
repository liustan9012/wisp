import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tokenReceived, unsetUser } from './authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    let token = (getState()).auth.accessToken
    if (token) {
      const authorization = headers.get('authorization')
      if (authorization === 'refreshToken') {
        token = (getState()).auth.refreshToken
      }
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery({
      url: '/refresh',
      method: 'POST',
      headers: { 'authorization': 'refreshToken' },
    }, api, extraOptions)
    if (refreshResult.data) {
      // store the new token
      api.dispatch(tokenReceived(refreshResult.data.access_token))
      // retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(unsetUser())
    }
  }
  return result
}
// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 10,
  refetchOnMountOrArgChange: 20,
  endpoints: () => ({}),

})


export default baseApi
import { baseApi } from "./base";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHello: build.query({
      query: () => ({
        url: '/hello',
        responseHandler: (response) => response.text(),
      }),
    }),
    signIn: build.mutation({
      query: ({username, password}) => ({
        url: '/login',
        method: 'post',
        body: {username, password},
      }),
    }),
    signUp: build.mutation({
      query: ({username, email, password1, password2}) => ({
        url: `/register`,
        method: 'post',
        body: {username, email, password1, password2},
      }),
    }),
    signOut: build.mutation({
      query: () => ({
        url: `/logout`,
        method: 'post',
      }),

    }),
    getUsers: build.query({
      query: () => ({
        url: `/users`,
        method: 'post',
      }),

    }),

    overrideExisting: false,
  })

})






export const { useSignInMutation, useSignUpMutation, useSignOutMutation, useGetHelloQuery, useGetUsersQuery } = authApi

export default authApi
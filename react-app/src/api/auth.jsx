import { baseApi } from "./base";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHello: build.query({
      query: () => ({
        url: "/hello",
        responseHandler: (response) => response.text(),
      }),
    }),
    signIn: build.mutation({
      query: ({ username, password, remember }) => ({
        url: "/login",
        method: "post",
        body: { username, password, remember },
      }),
    }),
    signUp: build.mutation({
      query: ({ username, email, password1, password2 }) => ({
        url: `/register`,
        method: "post",
        body: { username, email, password1, password2 },
      }),
    }),
    changePassword: build.mutation({
      query: ({ username, password1, password2 }) => ({
        url: `/change_password`,
        method: "post",
        body: { username, password1, password2 },
      }),
    }),
    signOut: build.mutation({
      query: () => ({
        url: `/logout`,
        method: "post",
      }),
    }),
    deleteUser: build.mutation({
      query: ({ userid }) => ({
        url: `/user/${userid}/delete`,
        method: "post",
      }),
    }),
    getUsers: build.query({
      query: ({ params }) => ({
        url: `/users`,
        method: "post",
        params,
      }),
    }),

    overrideExisting: false,
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useChangePasswordMutation,
  useSignOutMutation,
  useDeleteUserMutation,
  useGetHelloQuery,
  useGetUsersQuery,
} = authApi;

export default authApi;

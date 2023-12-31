import { baseApi } from "./base";

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    newPost: build.mutation({
      query: (post) => ({
        url: `/post`,
        method: "Post",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: build.mutation({
      query: ({ postId, post }) => ({
        url: `/post/${postId}`,
        method: "Post",
        body: post,
      }),
      invalidatesTags: ["Posts", "Post"],
    }),
    deletePost: build.mutation({
      query: (postId) => ({
        url: `/post/${postId}/delete`,
        method: "Post",
      }),
      invalidatesTags: ["Posts"],
    }),
    getPost: build.query({
      query: (postId) => ({
        url: `/post/${postId}`,
        method: "get",
      }),
      providesTags: ["Post"],
    }),
    getPostList: build.query({
      query: ({ params }) => ({
        url: `/posts`,
        method: "get",
        params,
      }),
      providesTags: ["Posts"],
    }),

    overrideExisting: false,
  }),
});

export const {
  useNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useGetPostListQuery,
} = postApi;

export default postApi;

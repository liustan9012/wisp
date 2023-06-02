import { baseApi } from "./base";

const commentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    newComment: build.mutation({
      query: ({ content, parentId, postId }) => ({
        url: `/post/${postId}/comment/add`,
        method: 'post',
        body: { content, parent_id: parentId }
      }),
      invalidatesTags: ['Post', 'Comments']
    }),

    deleteComment: build.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}/delete`,
        method: 'post',
      }),
      invalidatesTags: ['Post', 'Comments']
    }),

    getPostComments: build.mutation({
      query: (postId) => ({
        url: `/post/${postId}/comments`,
        method: 'get',
      }),
      providesTags: ['Comments']
    }),

    getComments: build.query({
      query: () => ({
        url: `/comments`,
        method: 'get',
      }),
      providesTags: ['Comments']
    }),

    overrideExisting: false,
  })

})


export const {
  useNewCommentMutation,
  useDeleteCommentMutation,
  useGetPostCommentsMutation,
  useGetCommentsQuery,
} = commentApi

export default commentApi
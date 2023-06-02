import { baseApi } from "./base";

const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    tagList: build.query({
      query: () => ({
        url: '/tags',
        method: 'get',
      }),
      providesTags: ['Tags']
    }),

    reqTags: build.mutation({
      query: () => ({
        url: '/tags',
        method: 'get',
      }),
    }),

    getTags: build.query({
      query: () => ({
        url: '/tags',
        method: 'get',
      }),
      providesTags: ['Tags']
    }),

    newTag: build.mutation({
      query: ({ name }) => ({
        url: '/tag',
        method: 'Post',
        body: { name }
      }),
      invalidatesTags: ['Tags']
    }),

    deleteTag: build.mutation({
      query: (tagId) => ({
        url: `/tag/${tagId}/delete`,
        method: 'post',
      }),
      invalidatesTags: ['Tags']
    }),

    updateTag: build.mutation({
      query: ({ tagId, name }) => ({
        url: `/tag/${tagId}`,
        method: 'post',
        body: { name, },
      }),
      invalidatesTags: ['Tags']
    }),

    getTagsPosts: build.query({
      query: () => ({
        url: `/tags/posts`,
        method: 'get',
      }),
    }),

    getTag: build.query({
      query: (tagId) => ({
        url: `/tag/${tagId}`,
        method: 'get',
      }),
    }),

    overrideExisting: false,
  })

})


export const {
  useTagListQuery,
  useLazyTagListQuery,
  useReqTagsMutation,
  useGetTagsQuery,
  useDeleteTagMutation,
  useUpdateTagMutation,
  useNewTagMutation,
  useGetTagsPostsQuery,
  useGetTagQuery,
} = tagsApi

export default tagsApi
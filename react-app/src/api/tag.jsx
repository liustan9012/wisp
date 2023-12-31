import { baseApi } from "./base";

const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query({
      query: () => ({
        url: "/tags",
        method: "get",
      }),
      providesTags: ["Tags"],
    }),

    tagList: build.query({
      query: ({ params }) => ({
        url: "/tags/list",
        method: "get",
        params,
      }),
      providesTags: ["Tags"],
    }),

    newTag: build.mutation({
      query: ({ name, contentType }) => ({
        url: "/tag",
        method: "Post",
        body: { name, content_type: contentType },
      }),
      invalidatesTags: ["Tags", "Tag"],
    }),

    deleteTag: build.mutation({
      query: (tagId) => ({
        url: `/tag/${tagId}/delete`,
        method: "post",
      }),
      invalidatesTags: ["Tags"],
    }),

    updateTag: build.mutation({
      query: ({ tagId, name, contentType }) => ({
        url: `/tag/${tagId}`,
        method: "post",
        body: { name, content_type: contentType },
      }),
      invalidatesTags: ["Tags", "Tag"],
    }),

    getTagsPosts: build.query({
      query: () => ({
        url: `/tags/posts`,
        method: "get",
      }),
    }),

    getTag: build.query({
      query: (tagId) => ({
        url: `/tag/${tagId}`,
        method: "get",
      }),
      invalidatesTags: ["Tag"],
    }),

    overrideExisting: false,
  }),
});

export const {
  useGetTagsQuery,
  useTagListQuery,
  useDeleteTagMutation,
  useUpdateTagMutation,
  useNewTagMutation,
  useGetTagsPostsQuery,
  useGetTagQuery,
} = tagsApi;

export default tagsApi;

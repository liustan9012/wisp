import { baseApi } from "./base";

const navlinkapi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createNavlink: build.mutation({
      query: (navlink) => ({
        url: `/navlink`,
        method: "post",
        body: navlink,
      }),
      invalidatesTags: ["NavlinkList"],
    }),

    deleteNavlink: build.mutation({
      query: (navlinkId) => ({
        url: `/navlink/${navlinkId}/delete`,
        method: "post",
      }),
      invalidatesTags: ["NavlinkList"],
    }),

    updateNavlink: build.mutation({
      query: ({ navlinkId, navlink }) => ({
        url: `/navlink/${navlinkId}/update`,
        method: "post",
        body: navlink,
      }),
      invalidatesTags: ["NavlinkList"],
    }),

    getLinks: build.query({
      query: () => ({
        url: `/links`,
        method: "get",
      }),
      providesTags: ["NavlinkList"],
    }),

    getNavlinks: build.query({
      query: ({ params }) => ({
        url: `/navlinks`,
        method: "get",
        params,
      }),
      providesTags: ["NavlinkList"],
    }),

    reqNavlink: build.query({
      query: (navlinkId) => ({
        url: `/navlink/${navlinkId}`,
        method: "get",
      }),
      providesTags: ["NavlinkList"],
    }),

    overrideExisting: false,
  }),
});

export const {
  useCreateNavlinkMutation,
  useDeleteNavlinkMutation,
  useUpdateNavlinkMutation,
  useGetLinksQuery,
  useGetNavlinksQuery,
  useReqNavlinkQuery,
} = navlinkapi;

export default navlinkapi;

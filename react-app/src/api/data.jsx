import { baseApi } from "./base";

const dataapi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadNavlink: build.mutation({
      query: ({ formData }) => ({
        url: `/navlink/upload`,
        method: "post",
        body: formData,
      }),
      //   invalidatesTags: ["NavlinkList"],
    }),

    overrideExisting: false,
  }),
});



export const { useUploadNavlinkMutation } = dataapi;

export default dataapi;

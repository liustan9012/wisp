import { baseApi } from "./base";

const dataapi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadNavlink: build.mutation({
      query: ({ formData }) => ({
        url: `/navlink/upload`,
        method: "post",
        body: formData,
      }),
    }),
    downloadNavlink: build.mutation({
      query: (downloadParams) => ({
        url: `/navlink/download`,
        method: "post",
        body: downloadParams,
        responseHandler: (response) => response.text(),
      }),
      //   invalidatesTags: ["NavlinkList"],
    }),

    overrideExisting: false,
  }),
});

export const { useUploadNavlinkMutation, useDownloadNavlinkMutation } = dataapi;

export default dataapi;

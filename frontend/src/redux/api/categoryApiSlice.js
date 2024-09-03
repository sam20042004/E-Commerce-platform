import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: data,
      }),
        invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
        invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
        invalidatesTags: ["Category"],
    }),

    fetchCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/categories`,
        method: "GET",
      }),
        providesTags: ["Category"],
    }),

    readCategory: builder.query({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useReadCategoryQuery,
} = categoryApiSlice;

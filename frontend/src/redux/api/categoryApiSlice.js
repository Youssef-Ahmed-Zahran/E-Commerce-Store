import { apiSlice } from "./apiSlice";
import { GATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => ({
        url: `${GATEGORY_URL}/categories`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${GATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${GATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${GATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://sports-backend-production-e82f.up.railway.app/api/posts" }),
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getPosts: builder.query<any, void>({
            query: () => "/",
            providesTags: ["Post"],
        }),
        getPost: builder.query<any, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Post", id }],
        }),
        createPost: builder.mutation<any, any>({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Post"],
        }),
        deletePost: builder.mutation<any, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
        updatePost: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Post", id },
                "Post"
            ],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetPostQuery,
    useDeletePostMutation,
    useUpdatePostMutation,
    useCreatePostMutation
} = postApi;

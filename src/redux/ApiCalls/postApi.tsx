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
        getFilteredPosts: builder.mutation<any, any>({
            query: (filters) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value && value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)) {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, v));
                        } else {
                            params.append(key, value as string);
                        }
                    }
                });
                return {
                    url: `/filter?${params.toString()}`,
                    method: 'GET',
                };
            },
            invalidatesTags: ["Post"],
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
    useGetFilteredPostsMutation,
    useGetPostQuery,
    useDeletePostMutation,
    useUpdatePostMutation,
    useCreatePostMutation
} = postApi;

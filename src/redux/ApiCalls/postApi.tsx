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
        // Like/Unlike endpoints - using separate likes API
        likePost: builder.mutation<any, { postId: string; userId: string }>({
            query: ({ postId, userId }) => ({
                url: `https://sports-backend-production-e82f.up.railway.app/api/likes/${postId}/like`,
                method: "POST",
                body: { userId },
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
                "Post"
            ],
        }),
        unlikePost: builder.mutation<any, { postId: string; userId: string }>({
            query: ({ postId, userId }) => ({
                url: `https://sports-backend-production-e82f.up.railway.app/api/likes/${postId}/unlike`,
                method: "POST",
                body: { userId },
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
                "Post"
            ],
        }),
        // Comment endpoints - using separate comments API
        addComment: builder.mutation<any, { postId: string; userId: string; commentText: string }>({
            query: ({ postId, userId, commentText }) => ({
                url: `https://sports-backend-production-e82f.up.railway.app/api/comments/${postId}/comment`,
                method: "POST",
                body: { userId, commentText },
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
                "Post"
            ],
        }),
        deleteComment: builder.mutation<any, { postId: string; commentId: string; userId: string }>({
            query: ({ postId, commentId, userId }) => ({
                url: `https://sports-backend-production-e82f.up.railway.app/api/comments/${postId}/comment/${commentId}`,
                method: "DELETE",
                body: { userId },
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
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
    useCreatePostMutation,
    useLikePostMutation,
    useUnlikePostMutation,
    useAddCommentMutation,
    useDeleteCommentMutation
} = postApi;

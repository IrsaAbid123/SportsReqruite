import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://sports-backend-production-e82f.up.railway.app/api/users" }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUsers: builder.query<any, void>({
            query: () => "/",
            providesTags: ["User"],
        }),
        getUser: builder.query<any, string>({
            query: (id) => `/${id}`,
        }),
        deleteUser: builder.mutation<any, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        getProfile: builder.query<any, string>({
            query: (id) => `/${id}/profile`,
            providesTags: ["User"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetProfileQuery
} = userApi;

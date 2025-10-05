import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://sports-backend-production-e82f.up.railway.app/api/notifications",
        prepareHeaders: (headers) => {
            // Add auth token if available
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Notification"],
    endpoints: (builder) => ({
        sendNotification: builder.mutation<any, { userId: string; text: string }>({
            query: (data) => ({
                url: "/send",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),
        getUserNotifications: builder.query<any, string>({
            query: (userId) => `/user/${userId}`,
            providesTags: (result, error, userId) => [{ type: "Notification", id: userId }],
        }),
        markNotificationAsRead: builder.mutation<any, { notificationId: string; userId: string }>({
            query: ({ notificationId, userId }) => ({
                url: `/${notificationId}/read/${userId}`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: "Notification", id: userId }],
        }),
        markAllNotificationsAsRead: builder.mutation<any, string>({
            query: (userId) => ({
                url: `/read-all/${userId}`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, userId) => [{ type: "Notification", id: userId }],
        }),
    }),
});

export const {
    useSendNotificationMutation,
    useGetUserNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
} = notificationApi;

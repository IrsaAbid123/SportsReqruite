import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://sports-backend-production-e82f.up.railway.app/api/",
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<any, any>({
            query: (userData) => ({
                url: "auth/register",
                method: "POST",
                body: userData,
            }),
        }),
        loginUser: builder.mutation<any, any>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
        }),

        // ✅ Forgot Password APIs
        forgotPassword: builder.mutation<any, { email: string }>({
            query: (data) => ({
                url: "auth/forgot-password",
                method: "POST",
                body: data,
            }),
        }),

        verifyOtp: builder.mutation<any, { email: string; otp: string }>({
            query: (data) => ({
                url: "auth/verify-otp",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation<any, { email: string; password: string }>({
            query: (data) => ({
                url: "auth/reset-password",
                method: "POST",
                body: data,
            }),
        }),

        // ✅ Admin Management APIs
        getAdmins: builder.query<any, void>({
            query: () => "users/admins",
        }),

        getAdmin: builder.query<any, string>({
            query: (id) => `admin/admins/${id}`,
        }),

        inviteAdmin: builder.mutation<any, any>({
            query: (adminData) => ({
                url: "admin/invite",
                method: "POST",
                body: adminData,
            }),
        }),

        updateAdmin: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `admin/admins/${id}`,
                method: "PUT",
                body: data,
            }),
        }),

        deleteAdmin: builder.mutation<any, string>({
            query: (id) => ({
                url: `admin/admins/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useGetAdminsQuery,
    useGetAdminQuery,
    useInviteAdminMutation,
    useUpdateAdminMutation,
    useDeleteAdminMutation,
} = authApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/",
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
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
} = authApi;

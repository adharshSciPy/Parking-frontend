import { apiSlice } from "./apiSlice";
const USER_ROUTE_URL = '/user';

export const usersApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_ROUTE_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_ROUTE_URL}/register`,
                method: 'POST',
                body: data
            })
        }),
        verifyToken: builder.mutation({
            query: ({ token }) => ({
                url: `${USER_ROUTE_URL}/verify`,
                method: 'POST',
                body: {token: token}
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USER_ROUTE_URL}/logout`,
                method: 'POST',
            })
        }),
        updateUser: builder.mutation({
            query: ({ userId, data }) => ({
                url: `${USER_ROUTE_URL}/update-user/${userId}`,
                method: 'PUT',
                body: data
            })
        }),
        getAllUsers: builder.query({
            query: (page) => ({
                url: `${USER_ROUTE_URL}/get-all-users?page=${page}`,
                method: 'GET'
            })
        }),
        deleteUserById: builder.mutation({
            query: ({ userId }) => ({
                url: `${USER_ROUTE_URL}/delete-user/${userId}`,
                method: 'DELETE',
            })
        }),

    })
})

export const { useLoginMutation, useRegisterMutation, useVerifyTokenMutation, useLogoutMutation, useUpdateUserMutation, useGetAllUsersQuery, useDeleteUserByIdMutation } = usersApiSlice
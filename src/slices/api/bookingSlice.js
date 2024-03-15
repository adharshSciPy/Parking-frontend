import { apiSlice } from "./apiSlice";
const USER_ROUTE_URL = '/booking';

export const bookingApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        bookSlot: builder.mutation({
            query: ({ floorId, slotId, userId, payloadData }) => ({
                url: `${USER_ROUTE_URL}/create-booking/${floorId}/${slotId}/${userId}`,
                method: 'POST',
                body: payloadData
            })
        }),

        cancelBooking: builder.mutation({
            query: ({ floorId, slotId }) => ({
                url: `${USER_ROUTE_URL}/cancel-booking/${floorId}/${slotId}`,
                method: 'PUT'
            })
        }),

        extendBooking: builder.mutation({
            query: ({ floorId, slotId, payload }) => ({
                url: `${USER_ROUTE_URL}/extend-booking/${floorId}/${slotId}`,
                method: 'PUT',
                body: payload
            })
        }),

        updateBooking: builder.mutation({
            query: ({ floorId, slotId, data }) => ({
                url: `${USER_ROUTE_URL}/update-booking/${floorId}/${slotId}`,
                method: 'PUT',
                body: data
            })
        }),

        getUserBookings: builder.query({
            query: ({ userId }) => ({
                url: `${USER_ROUTE_URL}/get-bookings-byuser/${userId}`,
                method: 'GET'
            })
        }),

        getAllBookings: builder.query({
            query: (page = 1) => ({
                url: `${USER_ROUTE_URL}/get-allbookings?page=${page}`,
                method: 'GET'
            })
        }),

    })
})

export const { useBookSlotMutation, useCancelBookingMutation, useExtendBookingMutation, useUpdateBookingMutation, useGetUserBookingsQuery, useGetAllBookingsQuery } = bookingApiSlice
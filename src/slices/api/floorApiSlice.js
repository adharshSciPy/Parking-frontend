import { apiSlice } from "./apiSlice";
const FLOOR_ROUTE_URL = './floor';

export const floorApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        createFloorAndSlot: builder.mutation({
            query: (data) => ({
                url: `${FLOOR_ROUTE_URL}/create-floor-design`,
                method: 'POST',
                body: data
            })
        }),

        updateFloorAndSlot: builder.mutation({
            query: (data) => ({
                url: `${FLOOR_ROUTE_URL}/update-floor-design`,
                method: 'PUT',
                body: data
            })
        }),

        getFloorDesign: builder.query({
            query: () => ({
                url: `${FLOOR_ROUTE_URL}/get-floor-design`,
                method: 'GET'
            })
        }),

        deleteSlot: builder.mutation({
            query: ({ slotId, floorId }) => ({
                url: `${FLOOR_ROUTE_URL}/delete-slot/${slotId}/${floorId}`,
                method: 'DELETE'
            })
        }),

        deleteFloor: builder.mutation({
            query: ({ floorId }) => ({
                url: `${FLOOR_ROUTE_URL}/delete-floor/${floorId}`,
                method: 'DELETE'
            })
        })
    })
})

export const { useCreateFloorAndSlotMutation, useUpdateFloorAndSlotMutation, useGetFloorDesignQuery, useDeleteSlotMutation, useDeleteFloorMutation } = floorApiSlice
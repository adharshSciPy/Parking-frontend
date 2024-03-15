import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    floor: []
}

const userFloorSlice = createSlice({
    name: 'floor',
    initialState,
    reducers: {

        setUserFloor: (state, action) => {
            const { floorData } = action.payload;
            state.floor = floorData;
        },

    }
})


export const { setUserFloor } = userFloorSlice.actions
export default userFloorSlice.reducer;
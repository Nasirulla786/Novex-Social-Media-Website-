import { createSlice } from "@reduxjs/toolkit";
const commentSLice = createSlice({
    name:"Comment",
    initialState:{
        commnetData:[]
    },
    reducers:{
        setCommentData:(state,action)=>{
            state.commnetData = action.payload;
        }
    }
})


export const{setCommentData} = commentSLice.actions;
export default commentSLice.reducer;

import { USER_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

//to dynamically add reducers to the slice made for api calls
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        login : builder.mutation({
            query : (data) =>  ({
                url: `${USER_URL}/auth`,
                method : "POST",
                body: data,
            })
        })
    })
})


export const {useLoginMutation} = userApiSlice;

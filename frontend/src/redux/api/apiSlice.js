import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
    baseQuery,
    // tagTypes- here we define a list of tags, tags are used to 
    // link a tag to some data, like we are getting data for all users 
    // so we are tagging "User" with that data, and whenever we are updating the data 
    // by some another API, we are simply invalidating this tag 
    // so that, the API call associated with that is called again automatically by redux 
    // in order to maintain the udpated data.
    tagTypes:['Product', 'Order', "User", "Category"],
    endpoints: () => ({}),
})
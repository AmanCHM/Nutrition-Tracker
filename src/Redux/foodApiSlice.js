import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export  const foodApi=  createApi({
    
    name: "foodApi",
    baseQuery : fetchBaseQuery({
        baseUrl:"https://trackapi.nutritionix.com/v2/",
        prepareHeaders:(headers) => {
            headers.set("x-app-id", import.meta.env.VITE_NUTRITIONIX_APP_ID);
            headers.set("x-app-key", import.meta.env.VITE_NUTRITIONIX_APP_KEY);
            headers.set("Content-Type", "application/json");
            return headers;
          },
    }),
    endpoints:(builder)=>({
        fetchSuggestions:builder.query({
            query:(query)=>  `search/instant/?query=${query}`,
        }),
        addMeal :builder.mutation({
            query:(select)=>({
                url : `natural/nutrients`,
                method:"POST",
                body: {"query":select },
            }),
        }),
    }),
})

export  const {useFetchSuggestionsQuery, useAddMealMutation}= foodApi
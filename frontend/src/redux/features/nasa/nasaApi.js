import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/asteroids`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const nasaApi = createApi({
  reducerPath: "nasaApi",
  tagTypes: ["Asteroids", "Asteroid", "Alerts"],
  baseQuery,
  endpoints: (builder) => ({
    getAsteroidsByDate: builder.query({
      query: (date) => `/feed?date=${date}`,
      providesTags: ["Asteroids"],
    }),

    getAsteroidsByDateRange: builder.query({
      query: ({ startDate, endDate }) => `/feed?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Asteroids"],
    }),

    getAsteroidsToday: builder.query({
      query: (date) => `/feed?date=${date}`,
      providesTags: ["Asteroids"],
    }),

    getAsteroidById: builder.query({
      query: (asteroidId) => `/${asteroidId}`,
      providesTags: (result, error, id) => [
        { type: "Asteroid", id },
      ],
    }),

    getAlerts: builder.query({
      query: () => `/alerts`,
      providesTags: ["Alerts"],
    }),
  }),
});

export const {
  useGetAsteroidsByDateQuery,
  useGetAsteroidsByDateRangeQuery,
  useGetAsteroidsTodayQuery,
  useGetAsteroidByIdQuery,
  useGetAlertsQuery,
} = nasaApi;

export default nasaApi;

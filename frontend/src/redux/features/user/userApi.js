import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/user`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User", "Watchlist"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "/change-password",
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    getWatchlist: builder.query({
      query: () => "/watchlist",
      providesTags: ["Watchlist"],
    }),

    addToWatchlist: builder.mutation({
      query: (asteroidId) => ({
        url: `/watchlist/${asteroidId}`,
        method: "POST",
      }),
      invalidatesTags: ["Watchlist", "User"],
    }),

    removeFromWatchlist: builder.mutation({
      query: (asteroidId) => ({
        url: `/watchlist/${asteroidId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Watchlist", "User"],
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: "/profile",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useDeleteUserMutation,
} = userApi;

export default userApi;

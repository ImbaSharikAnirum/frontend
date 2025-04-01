import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer"; // Импортируйте селектор для получения токена

const API = process.env.REACT_APP_API;

export const guidesAPI = createApi({
  reducerPath: "guidesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { getState }) => {
      const token = selectJwt(getState());
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Guide"],
  endpoints: (builder) => ({
    createGuide: builder.mutation({
      query: (formData) => ({
        url: `/guides`,
        method: "POST",
        body: formData,
      }),
    }),
    getGuideById: builder.query({
      query: ({ id, userId }) => {
        let url = `/guides/${id}?populate[image]=*&populate[users_permissions_user]=*&populate[savedBy]=*`;
        if (userId) {
          url += `&populate[creations][sort]=publishedAt:desc&populate[creations][populate][image]=*&filters[creations][users_permissions_user][id][$eq]=${userId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Guide"],
    }),
    deleteGuide: builder.mutation({
      query: (id) => ({
        url: `/guides/${id}`,
        method: "DELETE",
      }),
    }),
    // getGuides: builder.query({
    //   query: ({ search = "", userId, page = 1 } = {}) => {
    //     let url = `/guides?populate[image]=*&populate[savedBy]=*&pagination[page]=${page}&pagination[pageSize]=30`;
    //     const trimmedSearch = search.trim();
    //     if (trimmedSearch) {
    //       if (trimmedSearch === "Созданные гайды" && userId) {
    //         url += `&filters[users_permissions_user][id][$eq]=${userId}`;
    //       } else if (trimmedSearch === "Сохраненные" && userId) {
    //         url += `&filters[savedBy][id][$eq]=${userId}`;
    //       } else {
    //         url += `&filters[tags][$containsi]=${encodeURIComponent(
    //           trimmedSearch
    //         )}`;
    //       }
    //     }
    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["Guide"],
    // }),
    searchGuidesByText: builder.query({
      query: ({ query, userId, page = 1 }) => ({
        url: `/guides/search-by-text`,
        method: "POST",
        body: { query, userId, page },
      }),
    }),
    saveGuide: builder.mutation({
      query: ({ guideId, userId, action }) => ({
        url: `/guides/${guideId}`,
        method: "PUT",
        body: {
          data: {
            savedBy:
              action === "save"
                ? { connect: [userId] } // добавляем пользователя в список
                : { disconnect: [userId] }, // удаляем пользователя из списка
          },
        },
      }),
      // Оптимистичное обновление кэша запроса getGuides
      async onQueryStarted(
        { guideId, userId, action },
        { dispatch, queryFulfilled, getState }
      ) {
        // Здесь нужно обновить кэш именно для тех запросов, которые отображают список гайдов.
        // Предположим, что используется getGuides с аргументом { search, userId }.
        const patchResult = dispatch(
          guidesAPI.util.updateQueryData(
            "getGuides",
            { search: "", userId },
            (draft) => {
              // Проверяем, что в кэше есть данные
              if (draft && draft.data) {
                const guide = draft.data.find((g) => g.id === guideId);
                if (guide) {
                  // Если savedBy отсутствует, создаём пустой массив
                  if (!guide.attributes.savedBy) {
                    guide.attributes.savedBy = { data: [] };
                  }
                  if (action === "save") {
                    // Добавляем пользователя, если его там ещё нет
                    if (
                      !guide.attributes.savedBy.data.some(
                        (u) => u.id === userId
                      )
                    ) {
                      guide.attributes.savedBy.data.push({ id: userId });
                    }
                  } else {
                    // Удаляем пользователя из массива
                    guide.attributes.savedBy.data =
                      guide.attributes.savedBy.data.filter(
                        (u) => u.id !== userId
                      );
                  }
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          // Если сервер вернул ошибку, откатываем изменения
          patchResult.undo();
        }
      },
    }),

    createComplain: builder.mutation({
      query: ({ title, guideId }) => ({
        url: `/complains`,
        method: "POST",
        body: {
          data: {
            title,
            guide: guideId,
          },
        },
      }),
    }),
    createCreation: builder.mutation({
      query: (formData) => ({
        url: `/creations`, // убедитесь, что URL совпадает с настройками Strapi
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Guide", "SkillTree"],
    }),
  }),
});

export const {
  useCreateGuideMutation,
  useGetGuideByIdQuery,
  useDeleteGuideMutation,
  // useGetGuidesQuery,
  useSearchGuidesByTextQuery,
  useSaveGuideMutation,
  useCreateComplainMutation,
  useCreateCreationMutation,
} = guidesAPI;

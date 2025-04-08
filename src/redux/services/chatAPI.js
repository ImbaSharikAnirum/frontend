import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const chatAPI = createApi({
  reducerPath: "chatAPI",
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
  endpoints: (builder) => ({
    // ✅ Получение чатов (уже отсортированы на бэке по lastMessage)
    getChats: builder.query({
      query: () => ({
        url: `/chats?sort=lastMessage:desc&populate[contact]=*&populate[shannel]=*&populate[messages][sort]=timestamp:desc&populate[messages][pagination][limit]=1`,
      }),
      transformResponse: (response) =>
        response.data.map((chat) => {
          const rawMsg = chat.attributes.messages?.data?.[0];
          const mediaUrl = rawMsg?.attributes?.mediaUrl;

          const lastMessage = rawMsg
            ? {
                id: rawMsg.id,
                text:
                  rawMsg.attributes.text ||
                  (mediaUrl ? "[изображение]" : "") || // 👈 добавили fallback
                  rawMsg.attributes.emoji ||
                  "",
                emoji: rawMsg.attributes.emoji,
                sender:
                  rawMsg.attributes.direction === "outgoing"
                    ? "manager"
                    : "client",
                timestamp: rawMsg.attributes.timestamp,
                status: rawMsg.attributes.status,
              }
            : null;

          return {
            id: chat.id,
            chatId: chat.attributes.chatId,
            name:
              chat.attributes.contact?.data?.attributes?.name || "Без имени",
            avatar:
              chat.attributes.contact?.data?.attributes?.avatar || "#f44336",
            lastMessage,
            time: lastMessage?.timestamp || new Date().toISOString(),
            isClosed: chat.attributes.isClosed || false,
          };
        }),
    }),

    // ✅ Получение сообщений для одного чата
    getMessagesByChatId: builder.query({
      query: (chatId) => ({
        url: `/messages?filters[chat][chatId][$eq]=${chatId}&sort=timestamp:desc&pagination[pageSize]=100
`,
      }),
      transformResponse: (response) =>
        response.data
          .map((msg) => ({
            id: msg.id,
            text: msg.attributes.text,
            emoji: msg.attributes.emoji,
            mediaUrl: msg.attributes.mediaUrl || null,
            sender:
              msg.attributes.direction === "outgoing" ? "manager" : "client",
            direction: msg.attributes.direction,
            timestamp: msg.attributes.timestamp,
            status: msg.attributes.status,
            messageId: msg.attributes.messageId,
            reactionToMessageId: msg.attributes.reactionToMessageId || null,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)), // 🔥 добавленная сортировка
    }),

    // ✅ Отправка нового сообщения
    sendMessage: builder.mutation({
      query: ({ chatId, message }) => ({
        url: `/messages`,
        method: "POST",
        body: {
          data: {
            chat: parseInt(chatId),
            direction: "outgoing",
            senderName: "Менеджер",
            text: message,
            timestamp: new Date().toISOString(),
            status: "sent",
          },
        },
      }),
    }),
    updateChat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/chats/${id}`,
        method: "PUT",
        body: { data },
      }),
    }),
  }),
});

// ✅ Экспортируем хуки
export const {
  useGetChatsQuery,
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
  useUpdateChatMutation,
} = chatAPI;

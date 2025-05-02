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
          const contact = chat.attributes.contact?.data;

          const lastMessage = rawMsg
            ? {
                id: rawMsg.id,
                text:
                  rawMsg.attributes.text ||
                  (mediaUrl ? "[изображение]" : "") ||
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
            avatar: contact?.attributes?.avatarUrl || "#f44336",
            lastMessage,
            time: lastMessage?.timestamp || new Date().toISOString(),
            isClosed: chat.attributes.isClosed || false,
            contact: contact
              ? {
                  id: contact.id,
                  ...contact.attributes,
                }
              : null,
          };
        }),
    }),

    // ✅ Получение сообщений для одного чата
    getMessagesByChatId: builder.query({
      query: (chatId) => ({
        url: `/messages?filters[chat][chatId][$eq]=${chatId}&sort=timestamp:desc&pagination[pageSize]=100&populate[chat][fields][0]=chatId`,
      }),
      transformResponse: (response) => {
        const allMessages = response.data.map((msg) => ({
          id: msg.id,
          text: msg.attributes.text,
          emoji: msg.attributes.emoji,
          mediaUrl: msg.attributes.mediaUrl || null,
          sender:
            msg.attributes.senderName ||
            (msg.attributes.direction === "outgoing" ? "manager" : "client"),
          direction: msg.attributes.direction,
          timestamp: msg.attributes.timestamp,
          status: msg.attributes.status,
          messageId: msg.attributes.messageId,
          reactionToMessageId: msg.attributes.reactionToMessageId || null,
          chatId: msg.attributes.chatId,
        }));

        // Обработка реакций
        return allMessages
          .map((msg) => {
            if (msg.reactionToMessageId && msg.emoji) {
              const targetMessage = allMessages.find(
                (m) => m.messageId === msg.reactionToMessageId
              );
              const targetText = targetMessage?.text || "сообщение";
              return {
                ...msg,
                text: `реакция на сообщение "${targetText}": ${msg.emoji}`,
                emoji: null, // чтобы не дублировать
              };
            }
            return msg;
          })
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      },
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

    // ✅ Получение информации о контакте
    getContactInfo: builder.query({
      query: (contactId) => ({
        url: `/contacts/${contactId}?populate=*`,
      }),
      transformResponse: (response) => {
        const contact = response.data;
        return {
          id: contact.id,
          name: contact.attributes.name || "Без имени",
          phone: contact.attributes.phone,
          email: contact.attributes.email,
          notes: contact.attributes.notes,
          avatarUrl: contact.attributes.avatarUrl,
        };
      },
    }),

    // ✅ Получение счетов по телефону
    getInvoicesByPhone: builder.query({
      query: (phone) => ({
        url: `/invoices?filters[phone][$eq]=${encodeURIComponent(
          phone
        )}&populate=*`,
      }),
      transformResponse: (response) => response,
    }),

    // ✅ Создание нового чата
    createChat: builder.mutation({
      query: ({ data }) => ({
        url: "/chats",
        method: "POST",
        body: { data },
      }),
      transformResponse: (response) => {
        console.log("📥 Ответ от сервера при создании чата:", response);

        // Проверяем, что response существует
        if (!response) {
          console.error("❌ Нет ответа от сервера");
          return null;
        }

        const chat = response;
        const lastMessage = chat.messages?.[0];
        const contact = chat.contact;

        return {
          id: chat.id,
          chatId: chat.chatId,
          name: contact?.name || "Без имени",
          avatar: contact?.avatarUrl || "#f44336",
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                text: lastMessage.text || "",
                direction: lastMessage.direction || "outgoing",
                sender:
                  lastMessage.senderName ||
                  (lastMessage.direction === "outgoing" ? "manager" : "client"),
                timestamp: lastMessage.timestamp,
                status: lastMessage.status,
              }
            : null,
          time: chat.lastMessage || new Date().toISOString(),
          isClosed: chat.isClosed || false,
          contact: contact
            ? {
                id: contact.id,
                ...contact,
              }
            : null,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data: newChat } = await queryFulfilled;
          console.log("✅ Новый чат создан:", newChat);

          if (!newChat) {
            console.error("❌ Чат не был создан");
            return;
          }

          // Обновляем список чатов
          const currentChats = getState().chat.chats;
          dispatch({
            type: "chat/setChats",
            payload: [newChat, ...currentChats],
          });

          // Устанавливаем активный чат
          dispatch({
            type: "chat/setActiveChat",
            payload: newChat.id,
          });

          // Устанавливаем активный контакт
          if (newChat.contact) {
            dispatch({
              type: "chat/setActiveContact",
              payload: newChat.contact.id,
            });
          }

          // Обновляем сообщения в чате
          if (newChat.lastMessage) {
            dispatch({
              type: "chat/addMessage",
              payload: {
                chatId: newChat.chatId,
                message: {
                  ...newChat.lastMessage,
                  direction: newChat.lastMessage.direction || "outgoing",
                  sender: newChat.lastMessage.senderName || "Менеджер",
                },
              },
            });
          }
        } catch (error) {
          console.error("❌ Ошибка при создании чата:", error);
        }
      },
    }),
  }),
});

// ✅ Экспортируем хуки
export const {
  useGetChatsQuery,
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
  useUpdateChatMutation,
  useGetContactInfoQuery,
  useGetInvoicesByPhoneQuery,
  useCreateChatMutation,
} = chatAPI;

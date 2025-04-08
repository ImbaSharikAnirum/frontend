import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChatId: null,
  chatFilter: "open",
  messages: {},
  unread: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat?.chatId) {
        state.unread[chat.chatId] = 0;
      }
    },
    createNewChat: (state) => {
      const newChat = {
        id: Date.now(),
        chatId: `local-${Date.now()}`,
        name: "Новый чат",
        avatar: "#f44336",
        lastMessage: "",
        time: new Date().toISOString(),
        unread: 0,
        messages: [],
        isClosed: false,
      };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
    },
    addOrUpdateChat: (state, action) => {
      const chat = action.payload;
      const index = state.chats.findIndex((c) => c.id === chat.id);

      if (index === -1) {
        state.chats.unshift(chat);
      } else {
        state.chats[index] = chat;
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!chatId) return;

      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      const isReaction = !!message.reactionToMessageId;

      const isDuplicate =
        message.messageId &&
        state.messages[chatId].some((m) => m.messageId === message.messageId);

      if (isDuplicate) return;

      const finalMessage = {
        ...message,
        id: message.id || Date.now(),
        emoji: message.emoji || null,
        sender: message.sender || message.senderName || "пользователь",
        messageId: message.messageId || null,
        reactionToMessageId: message.reactionToMessageId || null,
        mediaUrl: message.mediaUrl || null, // ✅ добавлено
      };

      // ✅ 1. Если это реакция — обновляем оригинальное сообщение
      if (isReaction) {
        const originalMessageIndex = state.messages[chatId].findIndex(
          (msg) => msg.messageId === finalMessage.reactionToMessageId
        );

        if (originalMessageIndex !== -1) {
          const target = state.messages[chatId][originalMessageIndex];
          state.messages[chatId][originalMessageIndex] = {
            ...target,
            reactions: [
              ...(target.reactions || []),
              {
                emoji: finalMessage.emoji,
                timestamp: finalMessage.timestamp,
                sender: finalMessage.sender,
              },
            ],
          };
        }
      }

      // ✅ 2. Добавляем любое сообщение, включая реакцию, как отдельную запись
      state.messages[chatId].push(finalMessage);

      // ✅ 3. Обновление данных чата (но не если это реакция или только emoji)
      const chatIndex = state.chats.findIndex((chat) => chat.chatId === chatId);
      if (chatIndex !== -1) {
        const isEmojiOnly = !finalMessage.text && finalMessage.emoji;

        if (!isReaction && !isEmojiOnly) {
          state.chats[chatIndex].lastMessage = {
            text: finalMessage.text || "[изображение]",
            timestamp: finalMessage.timestamp,
            sender: finalMessage.sender,
          };
          state.chats[chatIndex].time = finalMessage.timestamp;
        }

        if (
          state.activeChatId !== state.chats[chatIndex].id &&
          finalMessage.direction === "incoming"
        ) {
          state.unread[chatId] = (state.unread[chatId] || 0) + 1;
        }

        const updated = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(updated);
      }
    },

    updateMessage: (state, action) => {
      const { chatId, messageId, newMessage } = action.payload;
      const messages = state.messages[chatId];
      if (!messages) return;

      const index = messages.findIndex(
        (msg) => msg.id === messageId || msg.messageId === messageId
      );

      if (index !== -1) {
        state.messages[chatId][index] = {
          ...state.messages[chatId][index],
          ...newMessage,
        };
      }
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    loadMoreChats: (state, action) => {
      const { count } = action.payload;
      const lastId =
        state.chats.length > 0
          ? Math.max(...state.chats.map((chat) => chat.id))
          : 0;

      for (let i = 0; i < count; i++) {
        const newChat = {
          id: lastId + i + 1,
          chatId: `local-${lastId + i + 1}`,
          name: "Чат " + (lastId + i + 1),
          avatar: "#f44336",
          lastMessage: "",
          time: new Date().toISOString(),
          unread: 0,
          messages: [],
          isClosed: false,
        };
        state.chats.push(newChat);
      }
    },
    markChatAsUnread: (state, action) => {
      const chatId = action.payload;
      state.unread[chatId] = (state.unread[chatId] || 0) + 1;
    },
    markChatAsRead: (state, action) => {
      const chatId = action.payload;
      state.unread[chatId] = 0;
    },
    reorderChats: (state, action) => {
      state.chats = action.payload;
    },
    closeChat: (state, action) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.isClosed = true;
      }
    },
    setChatFilter: (state, action) => {
      state.chatFilter = action.payload;
    },
    clearMessages: (state, action) => {
      const chatId = action.payload;
      state.messages[chatId] = [];
    },
  },
});

export const {
  setChats,
  setActiveChat,
  createNewChat,
  addOrUpdateChat,
  addMessage,
  updateMessage,
  setMessages,
  clearMessages,
  loadMoreChats,
  markChatAsUnread,
  markChatAsRead,
  reorderChats,
  closeChat,
  setChatFilter,
} = chatSlice.actions;

export const selectAllChats = (state) => state.chat.chats;
export const selectActiveChatId = (state) => state.chat.activeChatId;
export const selectActiveChat = (state) =>
  state.chat.chats.find((chat) => chat.id === state.chat.activeChatId);
export const selectChatFilter = (state) => state.chat.chatFilter;
export const selectFilteredChats = (state) => {
  const filter = state.chat.chatFilter;
  const chats = state.chat.chats;

  if (filter === "closed") {
    return chats.filter((chat) => chat.isClosed === true);
  }

  if (filter === "open") {
    return chats.filter((chat) => chat.isClosed === false);
  }

  return chats;
};

export default chatSlice.reducer;

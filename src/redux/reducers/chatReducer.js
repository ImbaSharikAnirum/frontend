import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChatId: null,
  chatFilter: "all",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
    },
    createNewChat: (state) => {
      const newChat = {
        id: Date.now(),
        name: "Новый чат",
        avatar: "#f44336",
        lastMessage: "",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
        messages: [],
        isClosed: false,
      };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message.text;
        chat.time = message.time;
        chat.unread =
          state.activeChatId !== chatId ? (chat.unread || 0) + 1 : 0;
        chat.isClosed = false;

        // Перемещаем чат с новым сообщением в начало списка
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        if (chatIndex > 0) {
          const [movedChat] = state.chats.splice(chatIndex, 1);
          state.chats.unshift(movedChat);
        }
      }
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
          name: "Чат " + (lastId + i + 1),
          avatar: "#f44336",
          lastMessage: "",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
          messages: [],
          isClosed: false,
        };
        state.chats.push(newChat);
      }
    },
    markChatAsRead: (state, action) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unread = 0;
      }
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
  },
});

export const {
  setActiveChat,
  createNewChat,
  addMessage,
  loadMoreChats,
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
  const chats = state.chat.chats;
  const filter = state.chat.chatFilter;

  switch (filter) {
    case "open":
      return chats.filter((chat) => !chat.isClosed);
    case "closed":
      return chats.filter((chat) => chat.isClosed);
    default:
      return chats;
  }
};

export default chatSlice.reducer;

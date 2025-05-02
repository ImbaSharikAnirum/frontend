import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChatId: null,
  activeContactId: null,
  chatFilter: "open",
  messages: {},
  unread: {},
  activeContactPreview: null,
  // Новые поля для хранения загруженного contactInfo и invoices
  contactsById: {}, // { [contactId]: { id, name, phone, email, notes, avatarUrl } }
  invoicesByPhone: {}, // { [phone]: [ invoiceObjects ] }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveSession: (state, action) => {
      const { chatId, contact } = action.payload;

      // 1) активный чат
      state.activeChatId = chatId;

      // 2) сбрасываем счётчик непрочитанных
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat?.chatId) {
        state.unread[chat.chatId] = 0;
      }

      // 3) выставляем контакт
      if (contact) {
        // если contact — объект с id и остальными полями
        state.activeContactId = contact.id;
        state.activeContactPreview = contact;
      } else {
        // если нет полного объекта — сбрасываем
        state.activeContactId = null;
        state.activeContactPreview = null;
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
        sender:
          message.senderName ||
          message.sender ||
          (message.direction === "outgoing" ? "manager" : "client"),
        direction: message.direction,
        messageId: message.messageId || null,
        reactionToMessageId: message.reactionToMessageId || null,
        mediaUrl: message.mediaUrl || null,
      };

      // Если это реакция — обновляем оригинальное сообщение
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

      // Добавляем любое сообщение, включая реакцию, как отдельную запись
      state.messages[chatId].push(finalMessage);

      // Обновление данных чата (но не если это реакция или только emoji)
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
        const existing = state.messages[chatId][index];

        // 👇 Восстанавливаем direction, если его нет в newMessage
        const updated = {
          ...existing,
          ...newMessage,
          direction: newMessage.direction || existing.direction || "outgoing",
        };

        state.messages[chatId][index] = updated;
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
    setContactInfo: (state, action) => {
      const contact = action.payload;
      state.contactsById[contact.id] = contact;
    },
    setInvoices: (state, action) => {
      const { phone, invoices } = action.payload;
      state.invoicesByPhone[phone] = invoices;
    },
  },
});

export const {
  setChats,
  setActiveSession,
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
  setContactInfo,
  setInvoices,
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

export const selectActiveContactId = (state) => state.chat.activeContactId;
export const selectActiveContactPreview = (state) =>
  state.chat.activeContactPreview;
export const selectContactById = (state, contactId) =>
  state.chat.contactsById[contactId];
export const selectInvoicesByPhone = (state, phone) =>
  state.chat.invoicesByPhone[phone] || [];
export default chatSlice.reducer;

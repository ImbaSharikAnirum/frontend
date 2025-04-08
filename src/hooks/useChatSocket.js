import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  addOrUpdateChat,
  updateMessage,
} from "../redux/reducers/chatReducer";
import socket from "./socket";

export default function useChatSocket() {
  const dispatch = useDispatch();

  // Получаем данные из Redux перед тем как использовать их в колбеке
  const messages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    socket.on("chat:message", (msg) => {
      // Проверяем, существует ли сообщение с таким messageId в Redux
      const existingMessage = msg.messageId
        ? messages[msg.chatId]?.find((m) => m.messageId === msg.messageId)
        : null;

      if (existingMessage) {
        // Если сообщение найдено, обновляем его
        dispatch(
          updateMessage({
            chatId: msg.chatId,
            messageId: msg.messageId,
            newMessage: msg,
          })
        );
      } else {
        // Если сообщение не найдено, добавляем новое
        dispatch(
          addMessage({
            chatId: msg.chatId,
            message: {
              text: msg.text,
              emoji: msg.emoji || null,
              direction: msg.direction,
              timestamp: msg.timestamp,
              sender: msg.senderName || "client",
              messageId: msg.messageId || null,
              mediaUrl: msg.mediaUrl || null,
              reactionToMessageId: msg.reactionToMessageId || null,
            },
          })
        );
      }

      // Обновляем чат (чтобы, например, isClosed стал false)
      dispatch((dispatch, getState) => {
        const state = getState();
        const chat = state.chat.chats.find((c) => c.chatId === msg.chatId);

        if (chat) {
          dispatch(
            addOrUpdateChat({
              ...chat,
              isClosed: false, // Если нужно форсить открытие
              lastMessage: {
                text:
                  msg.text ||
                  (msg.mediaUrl ? "[изображение]" : "") ||
                  (msg.emoji ? `Реакция ${msg.emoji}` : ""),
                emoji: msg.emoji || null,
                timestamp: msg.timestamp,
                sender: msg.senderName || "client",
              },
              time: msg.timestamp,
            })
          );
        }
      });
    });

    socket.on("chat:new", (chat) => {
      const { messages, ...cleanChat } = chat;
      dispatch(addOrUpdateChat(cleanChat));
    });

    return () => {
      socket.off("chat:message");
      socket.off("chat:new");
    };
  }, [dispatch, messages]); // добавляем 'messages' в зависимости эффекта
}

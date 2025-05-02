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
      const isReaction = !!msg.reactionToMessageId;

      if (isReaction) {
        // Найди сообщение, к которому относится реакция
        const baseMessage = messages[msg.chatId]?.find(
          (m) => m.messageId === msg.reactionToMessageId
        );

        if (baseMessage) {
          const updatedReactions = [
            ...(baseMessage.reactions || []),
            {
              emoji: msg.emoji,
              sender: msg.senderName || "client",
              timestamp: msg.timestamp,
            },
          ];

          dispatch(
            updateMessage({
              chatId: msg.chatId,
              messageId: baseMessage.messageId,
              newMessage: { reactions: updatedReactions },
            })
          );
        }

        // Добавляем сообщение с реакцией в чат
        dispatch(
          addMessage({
            chatId: msg.chatId,
            message: {
              text: msg.text || null,
              emoji: msg.emoji || null,
              direction: msg.direction,
              timestamp: msg.timestamp,
              sender: msg.senderName || "client",
              messageId: msg.messageId || null,
              mediaUrl: msg.mediaUrl || null,
              reactionToMessageId: msg.reactionToMessageId,
              reactions: [],
            },
          })
        );

        // обновляем lastMessage для отображения в ChatList
        dispatch((dispatch, getState) => {
          const state = getState();
          const chat = state.chat.chats.find((c) => c.chatId === msg.chatId);

          if (chat) {
            dispatch(
              addOrUpdateChat({
                ...chat,
                isClosed: false,
                lastMessage: {
                  text: msg.text || `Реакция ${msg.emoji}`,
                  emoji: msg.emoji,
                  timestamp: msg.timestamp,
                  sender: msg.senderName || "client",
                },
                time: msg.timestamp,
              })
            );
          }
        });

        return;
      }

      // если это обычное сообщение
      const existingMessage = msg.messageId
        ? messages[msg.chatId]?.find((m) => m.messageId === msg.messageId)
        : null;

      if (existingMessage) {
        dispatch(
          updateMessage({
            chatId: msg.chatId,
            messageId: msg.messageId,
            direction: msg.direction,
            newMessage: msg,
          })
        );
      } else {
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
              reactions: [],
            },
          })
        );
      }

      // обновляем чат
      dispatch((dispatch, getState) => {
        const state = getState();
        const chat = state.chat.chats.find((c) => c.chatId === msg.chatId);

        if (chat) {
          dispatch(
            addOrUpdateChat({
              ...chat,
              isClosed: false,
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

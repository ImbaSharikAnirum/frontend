import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useUpdateChatMutation } from "../../redux/services/chatAPI";

import {
  addMessage,
  markChatAsRead,
  createNewChat,
  closeChat,
  selectActiveChat,
  selectActiveChatId,
  setMessages,
  addOrUpdateChat,
  updateMessage,
} from "../../redux/reducers/chatReducer";
import {
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
} from "../../redux/services/chatAPI";

const MESSAGES_PER_PAGE = 10;

export default function ChatWindow() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const activeChatId = useSelector(selectActiveChatId);
  const allMessages = useSelector(
    (state) => state.chat.messages[activeChat?.chatId] || []
  );
  const [updateChat] = useUpdateChatMutation();
  const [sendMessage] = useSendMessageMutation();
  const {
    data: fetchedMessages,
    isFetching,
    isSuccess,
  } = useGetMessagesByChatIdQuery(activeChat?.chatId, {
    skip: !activeChat?.chatId,
  });

  const [message, setMessage] = useState("");
  const [displayedMessagesCount, setDisplayedMessagesCount] =
    useState(MESSAGES_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ✅ Обновление сообщений: только если новых больше, или если нет сохраненных
  useEffect(() => {
    if (activeChat?.chatId && isSuccess && fetchedMessages) {
      const existingMessages = allMessages;

      const newUniqueMessages = fetchedMessages.filter(
        (msg) => !existingMessages.some((m) => m.id === msg.id)
      );

      if (newUniqueMessages.length > 0 || existingMessages.length === 0) {
        dispatch(
          setMessages({
            chatId: activeChat.chatId,
            messages: [...existingMessages, ...newUniqueMessages].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
          })
        );
      }

      setDisplayedMessagesCount(MESSAGES_PER_PAGE);
      dispatch(markChatAsRead(activeChat.chatId));
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [fetchedMessages, isSuccess, activeChat?.chatId, dispatch]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages.length]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !activeChat) return;

    if (
      container.scrollTop <= 100 &&
      displayedMessagesCount < allMessages.length &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      const previousScrollHeight = container.scrollHeight;

      setTimeout(() => {
        setDisplayedMessagesCount((prev) =>
          Math.min(prev + MESSAGES_PER_PAGE, allMessages.length)
        );
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - previousScrollHeight;
          setIsLoadingMore(false);
        }, 0);
      }, 300);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChatId) return;

    const optimisticId = Date.now();

    const newMessage = {
      id: optimisticId,
      text: message.trim(),
      direction: "outgoing",
      timestamp: new Date().toISOString(),
      sender: "manager",
      status: "sent",
    };
    if (activeChat.isClosed) {
      dispatch(
        addOrUpdateChat({
          ...activeChat,
          isClosed: false,
        })
      );
    }
    dispatch(addMessage({ chatId: activeChat.chatId, message: newMessage }));
    setMessage("");

    try {
      const res = await sendMessage({
        chatId: activeChat.id,
        message: newMessage.text,
      }).unwrap();

      // ✅ Обновляем сообщение с messageId
      dispatch(
        updateMessage({
          chatId: activeChat.chatId,
          messageId: optimisticId,
          newMessage: {
            id: res.id,
            messageId: res.messageId,
          },
        })
      );

      // ✅ Если чат был закрыт — обновим
      if (activeChat.isClosed) {
        await updateChat({
          id: activeChat.id,
          data: { isClosed: false },
        });
      }
    } catch (error) {
      console.error("❌ Ошибка при отправке:", error);
    }
  };

  if (!activeChat) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Выберите чат</Typography>
      </Box>
    );
  }

  const displayedMessages = allMessages.slice(-displayedMessagesCount);

  const handleToggleChatStatus = async () => {
    if (!activeChat) return;

    // ✅ Мгновенно обновляем в UI (оптимистично)
    dispatch(
      addOrUpdateChat({
        ...activeChat,
        isClosed: !activeChat.isClosed,
      })
    );

    // Потом отправляем PATCH-запрос на бэкенд
    try {
      await updateChat({
        id: activeChat.id,
        data: { isClosed: !activeChat.isClosed },
      });
    } catch (e) {
      console.error("Ошибка обновления статуса чата", e);
      // 👉 при ошибке можно вернуть обратно, если хочешь
      dispatch(
        addOrUpdateChat({
          ...activeChat,
          isClosed: activeChat.isClosed, // откатываем
        })
      );
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar alt={activeChat.name} src={activeChat.avatar} />
        <Box sx={{ flex: 1, ml: 2 }}>
          <Typography variant="h6">{activeChat.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {activeChat.isClosed ? "Чат закрыт" : "В сети"}
          </Typography>
        </Box>
        <Button
          onClick={handleToggleChatStatus}
          startIcon={activeChat.isClosed ? <LockOpenIcon /> : <LockIcon />}
          sx={{ textTransform: "none" }}
        >
          {activeChat.isClosed ? "Открыть чат" : "Закрыть чат"}
        </Button>
      </Box>

      {isFetching ? (
        <Box sx={{ flex: 1, p: 2 }}>
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} height={32} sx={{ mb: 1, borderRadius: 2 }} />
          ))}
        </Box>
      ) : (
        <Box
          ref={messagesContainerRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {displayedMessages.map((msg, i) => {
            const prevMsg = displayedMessages[i - 1];
            const isNewDay =
              i === 0 ||
              new Date(msg.timestamp).toDateString() !==
                new Date(prevMsg?.timestamp).toDateString();

            return (
              <React.Fragment key={msg.id || i}>
                {isNewDay && (
                  <Typography
                    variant="caption"
                    align="center"
                    color="text.secondary"
                    sx={{ my: 1 }}
                  >
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.direction === "outgoing" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      bgcolor:
                        msg.direction === "outgoing"
                          ? "primary.main"
                          : "grey.100",
                      color:
                        msg.direction === "outgoing" ? "white" : "text.primary",
                      opacity: msg.text === "" && msg.emoji ? 0.8 : 1,
                      fontStyle:
                        msg.text === "" && msg.emoji ? "italic" : "normal",
                    }}
                  >
                    {msg.text && <Typography>{msg.text}</Typography>}

                    {/* Реакция на сообщение */}
                    {!msg.text && msg.emoji && msg.reactionToMessageId && (
                      <Typography fontStyle="italic" color="text.secondary">
                        {msg.sender} отреагировал {msg.emoji} на сообщение: "
                        {allMessages.find(
                          (m) => m.messageId === msg.reactionToMessageId
                        )?.text || "…"}
                        "
                      </Typography>
                    )}

                    {/* Просто emoji, не реакция */}
                    {!msg.text && msg.emoji && !msg.reactionToMessageId && (
                      <Typography>{msg.emoji}</Typography>
                    )}
                    {msg.mediaUrl && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={msg.mediaUrl}
                          alt="image"
                          style={{
                            maxWidth: "200px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        opacity: 0.7,
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Paper>
                </Box>
              </React.Fragment>
            );
          })}

          <div ref={messagesEndRef} />
        </Box>
      )}

      <Divider />

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <IconButton type="submit" color="primary" disabled={!message.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

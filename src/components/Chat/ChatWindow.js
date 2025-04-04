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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
  addMessage,
  markChatAsRead,
  selectActiveChat,
  selectActiveChatId,
  createNewChat,
  closeChat,
} from "../../redux/reducers/chatReducer";

const MESSAGES_PER_PAGE = 10;

export default function ChatWindow() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const activeChatId = useSelector(selectActiveChatId);

  const [message, setMessage] = useState("");
  const [displayedMessagesCount, setDisplayedMessagesCount] =
    useState(MESSAGES_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const firstMessageRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: "end" });
    }
  };

  useEffect(() => {
    if (activeChatId) {
      setDisplayedMessagesCount(MESSAGES_PER_PAGE);
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages?.length]);

  useEffect(() => {
    if (activeChatId) {
      dispatch(markChatAsRead(activeChatId));
    }
  }, [activeChatId, dispatch]);

  const handleScroll = () => {
    if (!messagesContainerRef.current || !activeChat) return;

    const container = messagesContainerRef.current;

    if (
      container.scrollTop <= 100 &&
      displayedMessagesCount < activeChat.messages.length &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);

      const previousScrollHeight = container.scrollHeight;

      setTimeout(() => {
        setDisplayedMessagesCount((prevCount) =>
          Math.min(prevCount + MESSAGES_PER_PAGE, activeChat.messages.length)
        );

        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
          setIsLoadingMore(false);
        }, 0);
      }, 300);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChatId) {
      // Если чат закрыт, сначала отправляем системное сообщение для его открытия
      if (activeChat.isClosed) {
        dispatch(
          addMessage({
            chatId: activeChatId,
            message: {
              id: Date.now(),
              text: "",
              sender: "system",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          })
        );
      }

      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "manager",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      dispatch(addMessage({ chatId: activeChatId, message: newMessage }));
      setMessage("");
    }
  };

  const handleCreateNewChat = () => {
    dispatch(createNewChat());
  };

  const handleCloseChat = () => {
    if (activeChatId) {
      dispatch(closeChat(activeChatId));
    }
  };

  if (!activeChat) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Выберите чат для начала общения
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewChat}
        >
          Создать новый чат
        </Button>
      </Box>
    );
  }

  const displayedMessages = activeChat.messages.slice(
    activeChat.messages.length - displayedMessagesCount
  );

  // Проверяем, есть ли хотя бы одно сообщение от менеджера
  const hasManagerMessage = activeChat.messages.some(
    (msg) => msg.sender === "manager"
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar alt={activeChat.name} src={activeChat.avatar} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{activeChat.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {activeChat.isClosed ? "Чат закрыт" : "В сети"}
          </Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={handleCreateNewChat}>
          Новый чат
        </Button>
        <Button
          variant="outlined"
          color={activeChat.isClosed ? "success" : "error"}
          size="small"
          startIcon={<CloseIcon />}
          onClick={handleCloseChat}
        >
          {activeChat.isClosed ? "Открыть чат" : "Закрыть чат"}
        </Button>
      </Box>

      {activeChat.isClosed && (
        <Alert severity="info" sx={{ mx: 2, mt: 2 }}>
          Этот чат закрыт. Отправьте сообщение, чтобы автоматически открыть его.
        </Alert>
      )}

      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {isLoadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {displayedMessagesCount < activeChat.messages.length && (
          <Typography variant="caption" color="text.secondary" align="center">
            Показано {displayedMessagesCount} из {activeChat.messages.length}{" "}
            сообщений
          </Typography>
        )}

        {displayedMessages.map((msg, index) => (
          <Box
            key={msg.id}
            ref={index === 0 ? firstMessageRef : null}
            sx={{
              display: "flex",
              justifyContent:
                msg.sender === "manager" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: "70%",
                bgcolor: msg.sender === "manager" ? "primary.main" : "grey.100",
                color: msg.sender === "manager" ? "white" : "text.primary",
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {msg.timestamp}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <IconButton size="small">
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
        />
        <IconButton type="submit" color="primary" disabled={!message.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

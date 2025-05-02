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
  Skeleton,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import {
  addMessage,
  markChatAsRead,
  setMessages,
  addOrUpdateChat,
  updateMessage,
  clearMessages,
  selectActiveChat,
  selectActiveChatId,
} from "../../redux/reducers/chatReducer";

import {
  useSendMessageMutation,
  useGetMessagesByChatIdQuery,
  useUpdateChatMutation,
} from "../../redux/services/chatAPI";

const MESSAGES_PER_PAGE = 10;

const MessageReactions = ({ reactions }) => {
  if (!reactions?.length) return null;

  return (
    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
      {reactions.map((reaction, index) => (
        <Chip
          key={index}
          size="small"
          label={reaction.emoji}
          sx={{
            height: 24,
            "& .MuiChip-label": { px: 0.5 },
          }}
        />
      ))}
    </Box>
  );
};

const ReactionMessage = ({ message, allMessages }) => {
  if (!message.reactionToMessageId) return null;

  const originalMessage = allMessages.find(
    (m) => m.messageId === message.reactionToMessageId
  );

  if (!originalMessage) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 1,
        p: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message.emoji
          ? `Реакция ${message.emoji} на сообщение:`
          : "Ответ на сообщение:"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "200px",
        }}
      >
        {originalMessage.text || "[изображение]"}
      </Typography>
    </Box>
  );
};

export default function ChatWindow() {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const activeChatId = useSelector(selectActiveChatId);
  const allMessages = useSelector(
    (state) =>
      (activeChat?.chatId && state.chat.messages[activeChat.chatId]) || []
  );

  const [message, setMessage] = useState("");
  const [displayedMessagesCount, setDisplayedMessagesCount] =
    useState(MESSAGES_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [sendMessage] = useSendMessageMutation();
  const [updateChat] = useUpdateChatMutation();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const {
    data: fetchedMessages,
    isSuccess,
    isFetching,
  } = useGetMessagesByChatIdQuery(activeChat?.chatId, {
    skip: !activeChat?.chatId,
  });

  // Очищаем предыдущие сообщения при смене активного чата

  useEffect(() => {
    if (activeChat?.chatId && isSuccess && fetchedMessages) {
      const fetched = fetchedMessages.filter(
        (m) => m.chatId === activeChat.chatId
      );
      const existing = allMessages;

      // Объединяем, избегая дубликатов по messageId
      const allCombined = [
        ...fetched,
        ...existing.filter(
          (msg) => !fetched.some((f) => f.messageId === msg.messageId)
        ),
      ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      dispatch(
        setMessages({ chatId: activeChat.chatId, messages: allCombined })
      );
      dispatch(markChatAsRead(activeChat.chatId));
      setDisplayedMessagesCount(MESSAGES_PER_PAGE);
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [fetchedMessages, isSuccess, activeChat?.chatId, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
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
      chatId: activeChat.chatId,
    };

    if (activeChat.isClosed) {
      dispatch(addOrUpdateChat({ ...activeChat, isClosed: false }));
    }

    dispatch(addMessage({ chatId: activeChat.chatId, message: newMessage }));
    setMessage("");

    try {
      const res = await sendMessage({
        chatId: activeChat.id,
        message: newMessage.text,
      }).unwrap();

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

      if (activeChat.isClosed) {
        await updateChat({ id: activeChat.id, data: { isClosed: false } });
      }
    } catch (error) {
      console.error("❌ Ошибка при отправке:", error);
    }
  };

  const handleToggleChatStatus = async () => {
    if (!activeChat) return;

    dispatch(
      addOrUpdateChat({ ...activeChat, isClosed: !activeChat.isClosed })
    );

    try {
      await updateChat({
        id: activeChat.id,
        data: { isClosed: !activeChat.isClosed },
      });
    } catch (error) {
      console.error("Ошибка при обновлении статуса чата", error);
      dispatch(
        addOrUpdateChat({ ...activeChat, isClosed: activeChat.isClosed })
      );
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
  console.log(displayedMessages, "displayedMessages");
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
            const prev = displayedMessages[i - 1];
            const isNewDay =
              i === 0 ||
              new Date(msg.timestamp).toDateString() !==
                new Date(prev?.timestamp).toDateString();

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
                    width: "100%",
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      width: "fit-content",
                      bgcolor:
                        msg.direction === "outgoing"
                          ? "primary.main"
                          : "grey.100",
                      color:
                        msg.direction === "outgoing" ? "white" : "text.primary",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text && (
                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.text}
                      </Typography>
                    )}

                    {msg.mediaUrl && (
                      <Box sx={{ mt: 1 }}>
                        {msg.mediaUrl.endsWith(".pdf") ? (
                          <Button
                            variant="outlined"
                            color="secondary"
                            href={msg.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textTransform: "none" }}
                          >
                            📄 Открыть PDF
                          </Button>
                        ) : (
                          <img
                            src={msg.mediaUrl}
                            alt="media"
                            style={{
                              maxWidth: 200,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <ReactionMessage message={msg} allMessages={allMessages} />
                    <MessageReactions reactions={msg.reactions} />

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

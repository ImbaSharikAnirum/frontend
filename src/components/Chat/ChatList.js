import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Box,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  setActiveChat,
  setChatFilter,
  reorderChats,
  markChatAsRead,
  selectActiveChatId,
  selectChatFilter,
  selectFilteredChats,
} from "../../redux/reducers/chatReducer";
import { useGetChatsQuery } from "../../redux/services/chatAPI";

const CHATS_PER_PAGE = 20;

export default function ChatList() {
  const dispatch = useDispatch();
  const activeChatId = useSelector(selectActiveChatId);
  const chatFilter = useSelector(selectChatFilter);
  const chats = useSelector(selectFilteredChats) || [];
  const unread = useSelector((state) => state.chat.unread || {});

  const { data: chatsData, isLoading, error } = useGetChatsQuery();

  const listRef = useRef(null);
  const [displayedChatsCount, setDisplayedChatsCount] =
    useState(CHATS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (chatsData) {
      dispatch(reorderChats(chatsData));
    }
  }, [chatsData, dispatch]);

  useEffect(() => {
    const savedChatId = localStorage.getItem("lastChatId");
    if (savedChatId && chats.length > 0) {
      const found = chats.find((c) => c.id === +savedChatId);
      if (found) {
        dispatch(setActiveChat(+savedChatId));
      }
    }
  }, [chats, dispatch]);

  useEffect(() => {
    if (chatsData?.length > 0 && !activeChatId) {
      dispatch(setActiveChat(chatsData[0].id));
    }
  }, [chatsData, activeChatId, dispatch]);

  useEffect(() => {
    setDisplayedChatsCount(CHATS_PER_PAGE);
  }, [chats.length, chatFilter]);

  const handleChatClick = (chatId) => {
    dispatch(setActiveChat(chatId));
    localStorage.setItem("lastChatId", chatId);
    const selectedChat = chats.find((chat) => chat.id === chatId);
    if (selectedChat?.chatId) {
      dispatch(markChatAsRead(selectedChat.chatId));
    }
  };

  const handleFilterChange = (event) => {
    dispatch(setChatFilter(event.target.value));
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isAtBottom && displayedChatsCount < chats.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedChatsCount((prev) =>
          Math.min(prev + CHATS_PER_PAGE, chats.length)
        );
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const displayedChats = chats.slice(0, displayedChatsCount);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">
          Ошибка загрузки чатов: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom>
          Чаты
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="chat-filter-label">Фильтр чатов</InputLabel>
          <Select
            labelId="chat-filter-label"
            value={chatFilter}
            label="Фильтр чатов"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Все чаты</MenuItem>
            <MenuItem value="open">Открытые</MenuItem>
            <MenuItem value="closed">Закрытые</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        ref={listRef}
        onScroll={handleScroll}
        sx={{ flex: 1, overflowY: "auto", position: "relative" }}
      >
        {displayedChats.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            Нет чатов
          </Typography>
        ) : (
          <List disablePadding>
            {displayedChats.map((chat, index) => {
              const isActive = activeChatId === chat.id;
              const unreadCount = unread[chat.chatId] || 0;

              return (
                <React.Fragment key={chat.id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => handleChatClick(chat.id)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isActive ? "action.selected" : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt={chat.name} src={chat.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {chat.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {chat.lastMessage?.timestamp
                              ? new Date(
                                  chat.lastMessage.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px",
                              fontStyle:
                                !chat.lastMessage?.text &&
                                (chat.lastMessage?.emoji ||
                                  chat.lastMessage?.mediaUrl)
                                  ? "italic"
                                  : "normal",
                            }}
                          >
                            {chat.lastMessage?.text ||
                              (chat.lastMessage?.mediaUrl && "[Изображение]") ||
                              (chat.lastMessage?.emoji &&
                                `Реакция ${chat.lastMessage.emoji}`) ||
                              "Нет сообщений"}
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {chat.isClosed && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ ml: 1 }}
                              >
                                Закрыт
                              </Typography>
                            )}
                            {unreadCount > 0 && (
                              <Badge
                                badgeContent={unreadCount}
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </Typography>
                      }
                      disableTypography
                    />
                  </ListItem>
                  {index < displayedChats.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {isLoadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {displayedChatsCount < chats.length && (
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ display: "block", py: 1 }}
          >
            Показано {displayedChatsCount} из {chats.length} чатов
          </Typography>
        )}
      </Box>
    </Box>
  );
}

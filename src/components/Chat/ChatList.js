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
  selectActiveChatId,
  setChatFilter,
  selectChatFilter,
  reorderChats,
} from "../../redux/reducers/chatReducer";
import { useGetChatsQuery } from "../../redux/services/chatAPI";

// Количество чатов для отображения за раз
const CHATS_PER_PAGE = 20;

export default function ChatList() {
  const dispatch = useDispatch();
  const activeChatId = useSelector(selectActiveChatId);
  const chatFilter = useSelector(selectChatFilter);

  // Получаем чаты из API
  const { data: chatsData, isLoading, error } = useGetChatsQuery();
  const chats = chatsData || [];

  const listRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [displayedChatsCount, setDisplayedChatsCount] =
    useState(CHATS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Сохраняем чаты в редюсер при их получении из API
  useEffect(() => {
    if (chatsData) {
      // Преобразуем данные из API в формат, который ожидает редюсер
      const formattedChats = chatsData.map((chat) => ({
        id: chat.id,
        name: chat.attributes.contact?.data?.attributes?.name || "Без имени",
        avatar: chat.attributes.contact?.data?.attributes?.avatar || "#f44336",
        lastMessage:
          chat.attributes.messages?.data?.[0]?.attributes?.text || "",
        time:
          chat.attributes.messages?.data?.[0]?.attributes?.timestamp ||
          new Date().toISOString(),
        unread: chat.attributes.unreadCount || 0,
        messages:
          chat.attributes.messages?.data?.map((msg) => ({
            id: msg.id,
            text: msg.attributes.text,
            sender: msg.attributes.sender,
            time: msg.attributes.timestamp,
            status: msg.attributes.status,
          })) || [],
        isClosed: chat.attributes.isClosed || false,
      }));

      dispatch(reorderChats(formattedChats));
    }
  }, [chatsData, dispatch]);

  const handleChatClick = (chatId) => {
    dispatch(setActiveChat(chatId));
  };

  const handleFilterChange = (event) => {
    dispatch(setChatFilter(event.target.value));
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isAtBottom);

    // Если пользователь прокрутил до конца и есть еще чаты для загрузки
    if (isAtBottom && displayedChatsCount < chats.length && !isLoadingMore) {
      setIsLoadingMore(true);

      // Имитация загрузки для плавности
      setTimeout(() => {
        setDisplayedChatsCount((prevCount) =>
          Math.min(prevCount + CHATS_PER_PAGE, chats.length)
        );
        setIsLoadingMore(false);
      }, 300);
    }
  };

  // Сброс количества отображаемых чатов при изменении списка чатов или фильтра
  useEffect(() => {
    setDisplayedChatsCount(CHATS_PER_PAGE);
  }, [chats.length, chatFilter]);

  // Фильтрация чатов в зависимости от выбранного фильтра
  const filteredChats = chats.filter((chat) => {
    if (chatFilter === "open") return !chat.attributes.isClosed;
    if (chatFilter === "closed") return chat.attributes.isClosed;
    return true;
  });

  // Получаем только отображаемые чаты
  const displayedChats = filteredChats.slice(0, displayedChatsCount);

  // Форматирование даты последнего сообщения
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Получение иконки канала
  const getChannelIcon = (channelType) => {
    switch (channelType) {
      case "whatsapp":
        return "📱";
      case "telegram":
        return "✈️";
      case "viber":
        return "📞";
      default:
        return "💬";
    }
  };

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
        <Typography variant="h6" component="h2" gutterBottom>
          Чаты
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="chat-filter-label">Фильтр чатов</InputLabel>
          <Select
            labelId="chat-filter-label"
            id="chat-filter"
            value={chatFilter}
            label="Фильтр чатов"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Все чаты</MenuItem>
            <MenuItem value="open">Открытые чаты</MenuItem>
            <MenuItem value="closed">Закрытые чаты</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        ref={listRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
        }}
      >
        <List disablePadding>
          {displayedChats.map((chat, index) => {
            const contact = chat.attributes.contact?.data?.attributes || {};
            const channel = chat.attributes.shannel?.data?.attributes || {};
            const lastMessage =
              chat.attributes.messages?.data?.[0]?.attributes || {};
            const isClosed = chat.attributes.isClosed;
            const unreadCount = chat.attributes.unreadCount || 0;

            return (
              <React.Fragment key={chat.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor:
                      activeChatId === chat.id
                        ? "action.selected"
                        : "transparent",
                  }}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={contact.name || "Контакт"}
                      src={contact.avatar}
                    />
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
                        <Typography component="span" variant="subtitle1">
                          {contact.name || "Без имени"}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(lastMessage.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "180px",
                          }}
                        >
                          {lastMessage.text || "Нет сообщений"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {isClosed && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mr: 1 }}
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
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayedChats.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>

        {/* Индикатор загрузки при подгрузке чатов */}
        {isLoadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Информация о количестве загруженных чатов */}
        {displayedChatsCount < filteredChats.length && (
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ display: "block", py: 1 }}
          >
            Показано {displayedChatsCount} из {filteredChats.length} чатов
          </Typography>
        )}
      </Box>
    </Box>
  );
}

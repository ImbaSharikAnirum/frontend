import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemButton,
  Chip,
} from "@mui/material";
import {
  setActiveSession,
  setChatFilter,
  reorderChats,
  markChatAsRead,
  setChats,
  addMessage,
  updateMessage,
  selectActiveChatId,
  selectChatFilter,
  selectFilteredChats,
  selectActiveContactPreview,
} from "../../redux/reducers/chatReducer";
import {
  useGetChatsQuery,
  useCreateChatMutation,
} from "../../redux/services/chatAPI";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import AddIcon from "@mui/icons-material/Add";

const CHATS_PER_PAGE = 20;

export default function ChatList() {
  const dispatch = useDispatch();
  const activeChatId = useSelector(selectActiveChatId);
  const chatFilter = useSelector(selectChatFilter);
  const chats = useSelector(selectFilteredChats) || [];
  const unread = useSelector((state) => state.chat.unread || {});
  const preview = useSelector(selectActiveContactPreview);

  const { data: chatsData, isLoading, error } = useGetChatsQuery();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [createChat] = useCreateChatMutation();

  const listRef = useRef(null);
  const [displayedChatsCount, setDisplayedChatsCount] =
    useState(CHATS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (chatsData) dispatch(reorderChats(chatsData));
  }, [chatsData, dispatch]);

  useEffect(() => {
    const last = localStorage.getItem("lastChatId");
    if (last && chats.length) {
      const found = chats.find((c) => c.id === +last);
      if (found)
        dispatch(setActiveSession({ chatId: +last, contact: found.contact }));
    }
  }, [chats, dispatch]);

  useEffect(() => {
    if (chatsData?.length && !activeChatId) {
      dispatch(
        setActiveSession({
          chatId: chatsData[0].id,
          contact: chatsData[0].contact,
        })
      );
    }
  }, [chatsData, activeChatId, dispatch]);

  useEffect(() => {
    setDisplayedChatsCount(CHATS_PER_PAGE);
  }, [chats.length, chatFilter]);

  const handleChatClick = (chat) => {
    dispatch(
      setActiveSession({ chatId: chat.id, contact: chat.contact || null })
    );
    localStorage.setItem("lastChatId", chat.id);
    if (chat.chatId) dispatch(markChatAsRead(chat.chatId));
  };

  const handleFilterChange = (e) => dispatch(setChatFilter(e.target.value));

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 100 && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedChatsCount((prev) =>
          Math.min(prev + CHATS_PER_PAGE, chats.length)
        );
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const handleCreateChat = async () => {
    const time = new Date().toISOString();
    const optId = Date.now();
    const optChatId = `local-${optId}`;
    const optimistic = {
      id: optId,
      chatId: optChatId,
      name: phone,
      avatar: "#f44336",
      lastMessage: {
        text: message,
        direction: "outgoing",
        timestamp: time,
        sender: "Менеджер",
      },
      time,
      isClosed: false,
      contact: { id: null, name: phone, phone },
    };

    dispatch(setChats([optimistic, ...chats]));
    dispatch(setActiveSession({ chatId: optId, contact: null }));
    dispatch(
      addMessage({
        chatId: optChatId,
        message: {
          id: optId + 1,
          text: message,
          direction: "outgoing",
          sender: "Менеджер",
          timestamp: time,
          status: "sending",
        },
      })
    );

    setOpen(false);
    setPhone("");
    setMessage("");

    try {
      const result = await createChat({
        data: {
          chatId: `${phone}@c.us`,
          contact: phone,
          shannel: 1,
          lastMessage: time,
          isClosed: false,
          message: {
            text: message,
            direction: "outgoing",
            senderName: "Менеджер",
            timestamp: time,
            status: "sent",
          },
        },
      }).unwrap();
      const updated = chats.filter((c) => c.id !== optId);
      dispatch(setChats([result, ...updated]));
      dispatch(
        setActiveSession({ chatId: result.id, contact: result.contact })
      );
      if (result.lastMessage) {
        dispatch(
          updateMessage({
            chatId: result.chatId,
            messageId: optId + 1,
            newMessage: {
              id: result.lastMessage.id,
              messageId: result.lastMessage.messageId,
              status: result.lastMessage.status || "sent",
              direction: "outgoing",
            },
          })
        );
      }
    } catch {
      dispatch(setChats(chats.filter((c) => c.id !== optId)));
    }
  };

  if (isLoading)
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
  if (error)
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">Ошибка: {error.message}</Typography>
      </Box>
    );

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Чаты</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setOpen(true)}
          >
            Новый чат
          </Button>
        </Box>
        <FormControl fullWidth size="small">
          <InputLabel id="filter-label">Фильтр</InputLabel>
          <Select
            labelId="filter-label"
            value={chatFilter}
            label="Фильтр"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="open">Открытые</MenuItem>
            <MenuItem value="closed">Закрытые</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        ref={listRef}
        onScroll={handleScroll}
        sx={{ flex: 1, overflowY: "auto" }}
      >
        {!chats.length ? (
          <Typography sx={{ mt: 4 }} align="center" color="text.secondary">
            Нет чатов
          </Typography>
        ) : (
          <List disablePadding>
            {chats.slice(0, displayedChatsCount).map((chat) => {
              const contact =
                preview?.id === chat.contact?.id
                  ? preview
                  : chat.contact || { name: chat.name, avatarUrl: chat.avatar };
              const isActive = activeChatId === chat.id;
              const unreadCount = unread[chat.chatId] || 0;
              return (
                <React.Fragment key={chat.id}>
                  <ListItem
                    disablePadding
                    sx={{ mb: 1, "&:hover": { bgcolor: "action.hover" } }}
                  >
                    <ListItemButton
                      selected={isActive}
                      onClick={() => handleChatClick(chat)}
                      sx={{ py: 1, px: 2, borderRadius: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={contact.avatarUrl}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: chat.avatar || "primary.main",
                          }}
                        >
                          {contact.name?.[0]?.toUpperCase()}
                        </Avatar>
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
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {contact.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDistanceToNow(new Date(chat.time), {
                                addSuffix: true,
                                locale: ru,
                              })}
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
                              noWrap
                              maxWidth={200}
                              variant="body2"
                              color="text.secondary"
                            >
                              {chat.lastMessage?.text || "Нет сообщений"}
                            </Typography>
                            {unreadCount > 0 && (
                              <Chip
                                label={unreadCount}
                                size="small"
                                color="primary"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
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
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Создать новый чат</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Номер телефона"
            type="tel"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="79991234567"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Сообщение"
            multiline
            rows={4}
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button
            onClick={handleCreateChat}
            variant="contained"
            disabled={!phone || !message}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

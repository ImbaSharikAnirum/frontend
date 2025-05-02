// src/components/ContactInfo.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  Skeleton,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import {
  useGetContactInfoQuery,
  useGetInvoicesByPhoneQuery,
} from "../../redux/services/chatAPI";
import {
  selectActiveContactId,
  selectActiveContactPreview,
} from "../../redux/reducers/chatReducer";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function ContactInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");

  const activeContactId = useSelector(selectActiveContactId);
  const preview = useSelector(selectActiveContactPreview);

  // Запрашиваем «полные» данные контакта и пересоздаем на каждый mount/arg change
  const {
    data: contact,
    isLoading: contactLoading,
    isFetching: contactFetching,
  } = useGetContactInfoQuery(activeContactId, {
    skip: !activeContactId,
    refetchOnMountOrArgChange: true,
  });

  // Берем сначала preview (из списка чатов), иначе — contact
  const displayContact = preview || contact || {};

  // Запрашиваем счета по номеру телефона, тоже с refetchOnMountOrArgChange
  const {
    data: invoicesResponse,
    isLoading: invoicesLoading,
    isFetching: invoicesFetching,
  } = useGetInvoicesByPhoneQuery(displayContact.phone, {
    skip: !displayContact.phone,
    refetchOnMountOrArgChange: true,
  });
  const invoices = invoicesResponse?.data || [];

  // Сбрасываем local notes при смене contact
  useEffect(() => {
    setNotes(contact?.notes || "");
  }, [contact]);

  // Без выбранного чата
  if (!activeContactId) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          Выберите чат для просмотра информации о клиенте
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* --- Аватар + имя --- */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={displayContact.avatarUrl}
          sx={{ width: 56, height: 56, mr: 2, bgcolor: "primary.main" }}
        >
          {!displayContact.avatarUrl &&
            (displayContact.name?.[0]?.toUpperCase() || <PersonIcon />)}
        </Avatar>
        <Typography variant="h5">
          {displayContact.name || "Без имени"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* --- Телефон и Email (всегда сразу из preview) --- */}
      <List>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText
            primary="Телефон"
            secondary={displayContact.phone || "Не указан"}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText
            primary="Email"
            secondary={displayContact.email || "Не указан"}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      {/* --- Заметки (Skeleton пока contactLoading || contactFetching) --- */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle1">Заметки</Typography>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <SaveIcon onClick={() => setIsEditing(false)} />
            ) : (
              <EditIcon />
            )}
          </IconButton>
        </Box>
        {contactLoading || contactFetching ? (
          <Skeleton variant="rectangular" height={80} />
        ) : isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {contact?.notes || "Нет заметок"}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* --- Счета (Skeleton пока invoicesLoading || invoicesFetching) --- */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <ReceiptIcon sx={{ mr: 1 }} /> Счета
        </Typography>
        {invoicesLoading || invoicesFetching ? (
          [...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={48}
              sx={{ mb: 1 }}
            />
          ))
        ) : invoices.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Нет счетов
          </Typography>
        ) : (
          <List dense>
            {invoices.map((inv) => {
              const { attributes } = inv;
              const start = new Date(attributes.start_day);
              const end = new Date(attributes.end_day);
              return (
                <ListItem key={inv.id} sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2">
                          {attributes.group.data.attributes.direction}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="body2">
                          {format(start, "dd.MM.yyyy", { locale: ru })} —{" "}
                          {format(end, "dd.MM.yyyy", { locale: ru })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {attributes.group.data.attributes.start_time} —{" "}
                          {attributes.group.data.attributes.end_time}
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {attributes.sum} {attributes.currency}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            attributes.status_payment ? "Оплачен" : "Не оплачен"
                          }
                          color={
                            attributes.status_payment ? "success" : "error"
                          }
                        />
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}

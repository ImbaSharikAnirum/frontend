import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  ListItemIcon,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RuleIcon from "@mui/icons-material/Rule";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import PaletteIcon from "@mui/icons-material/Palette";
import MoodIcon from "@mui/icons-material/Mood";
import InfoIcon from "@mui/icons-material/Info";

export default function Rules() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <div>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Grid>
        <Typography variant="h6" gutterBottom>
          Правила компании
        </Typography>
      </Grid>
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={isMobile ? 12 : 2} mb={1}>
          <Typography variant="subtitle2" mb={1}>
            Правила компании
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Допуск и регистрация
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Платежи и финансовые обязательства
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Правила посещения
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Дополнительные условия
          </Typography>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            mb={1}
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={handleClickOpen}
          >
            Подробнее
          </Typography>
        </Grid>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Правила компании</DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Допуск и регистрация
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Все учащиеся должны зарегистрироваться" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Допуск к занятиям только для зарегистрированных учащихся" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Сообщите о наличии специальных условий, если это необходимо" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Платежи и финансовые обязательства
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Соблюдайте сроки платежей" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Соглашение с политикой возврата средств" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Правила посещения
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EventAvailableIcon />
                </ListItemIcon>
                <ListItemText primary="Информируйте администрацию о пропусках занятий заранее" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Дополнительные условия
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText primary="Проявляйте уважение к преподавателям и другим учащимся" />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>

        <Grid item xs={isMobile ? 12 : 2} mb={1}>
          <Typography variant="subtitle2" mb={1}>
            Правила обучения
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Посещаемость
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Поддержание порядка
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Дружелюбная атмосфера
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Дополнительная информация
          </Typography>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            mb={1}
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={handleClickOpen1}
          >
            Подробнее
          </Typography>
        </Grid>
        <Dialog onClose={handleClose1} open={open1}>
          <DialogTitle>Правила обучения</DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Посещаемость
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="Учащиеся должны приходить вовремя" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="В группах ограниченное количество мест" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="Материалы для пропущенных занятий будут предоставлены" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Поддержание порядка
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <RuleIcon />
                </ListItemIcon>
                <ListItemText primary="Уважайте преподавателей и одногруппников" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RuleIcon />
                </ListItemIcon>
                <ListItemText primary="Ответственность за оборудование студии" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SmartphoneIcon />
                </ListItemIcon>
                <ListItemText primary="Запрещено использование телефонов во время занятий" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary="Необходимые материалы для занятий предоставляются" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Дружелюбная атмосфера
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <MoodIcon />
                </ListItemIcon>
                <ListItemText primary="Мы ожидаем дружелюбной и безопасной обстановки" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MoodIcon />
                </ListItemIcon>
                <ListItemText primary="Соблюдайте уважительное поведение" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Дополнительная информация
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Согласие с условиями и правилами" />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>

        <Grid item xs={isMobile ? 12 : 2} mb={1}>
          <Typography variant="subtitle2" mb={1}>
            Договор и условия
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Важные условия
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Обязательства сторон
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Условия отмены занятий
          </Typography>
          <Typography variant="caption" display="block" gutterBottom mb={1}>
            Порядок возврата средств
          </Typography>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            mb={1}
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={handleClickOpen2}
          >
            Подробнее
          </Typography>
        </Grid>
        <Dialog onClose={handleClose2} open={open2}>
          <DialogTitle>Договор и условия</DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Важные условия
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Учащиеся должны следовать условиям договора" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Все платежи должны быть произведены вовремя" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Обязательства сторон
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Все учащиеся обязаны уважать друг друга" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Все обязательства должны выполняться" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Условия отмены занятий
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Отмена возможна за 48 часов до начала занятия" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Возврат средств не осуществляется после начала занятия" />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Порядок возврата средств
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Возврат средств осуществляется по условиям договора" />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      </Grid>
    </div>
  );
}

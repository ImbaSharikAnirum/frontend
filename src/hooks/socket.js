// utils/socket.js
import { io } from "socket.io-client";
import { useEffect } from "react";

const SOCKET_URL = process.env.REACT_APP_SITE; // или твой прод-адрес

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"],
  autoConnect: true,
  forceNew: true,
});

// 🚀 Подключение
socket.on("connect", () => {
  // Оставляем только важные логи для отладки
});

// ❌ Отключение
socket.on("disconnect", (reason) => {
  // Оставляем только важные логи для отладки
});

// ⚠️ Ошибки подключения
socket.on("connect_error", (error) => {
  console.error("🚨 Socket connect error:", error);
});

// 🔁 Переподключение
socket.on("reconnect", (attempt) => {
  // Оставляем только важные логи для отладки
});

// 🐛 Лог всех входящих событий
socket.onAny((eventName, ...args) => {
  // Оставляем только важные логи для отладки
});

export default socket;

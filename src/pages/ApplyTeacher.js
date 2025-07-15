import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Alert, Box, Typography, Paper } from "@mui/material";
import {
  selectCurrentUser,
  updateTeacherRoleRequest,
  setUser,
} from "../redux/reducers/authReducer";
import {
  useUpdateTeacherRoleRequestMutation,
  useGetUserProfileDetailsQuery,
  useUpdateUserMutation,
} from "../redux/services/userProfileAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherApplicationsTable from "../components/ApplyTeacher/TeacherApplicationsTable";
import TeacherWelcome from "../components/ApplyTeacher/TeacherWelcome";
import moment from "moment";
import TeacherProfitCalculator from "../components/ApplyTeacher/TeacherProfitCalculator";

export default function ApplyTeacher() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateTeacherRoleRequestMutation, { isLoading }] =
    useUpdateTeacherRoleRequestMutation();
  const [updateUser] = useUpdateUserMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequestedData, setHasRequestedData] = useState(false);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;

  // Получаем функцию для принудительного обновления данных
  const {
    data: userData,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
    error: userError,
    refetch,
  } = useGetUserProfileDetailsQuery(user?.id, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true, // Принудительно обновляем при каждом посещении
    refetchOnFocus: true, // Обновляем при возвращении на вкладку
    refetchOnReconnect: true, // Обновляем при восстановлении соединения
    pollingInterval: 0, // Отключаем автоматический опрос
  });

  // Объединяем данные пользователя из Redux с актуальными данными с сервера
  const currentUser = useMemo(() => {
    if (userData && user) {
      const mergedUser = { ...user, ...userData };
      console.log("ApplyTeacher - Объединенные данные пользователя:", {
        isLoadingUser,
        isFetchingUser,
        hasUserData: !!userData,
        hasUser: !!user,
        requestedTeacherRole: mergedUser.requestedTeacherRole,
        rejectedAt: mergedUser.rejectedAt,
        roleId: mergedUser.role?.id,
      });
      return mergedUser;
    }
    return user;
  }, [user, userData, isLoadingUser, isFetchingUser]);

  // Отслеживаем когда данные были запрошены
  useEffect(() => {
    if (user?.id && !hasRequestedData) {
      setHasRequestedData(true);
      console.log("ApplyTeacher - Данные запрошены впервые");
    }
    // Сбрасываем состояние при смене пользователя
    if (!user?.id) {
      setHasRequestedData(false);
    }
  }, [user?.id, hasRequestedData]);

  // Обновляем данные в Redux и localStorage при получении новых данных с сервера
  useEffect(() => {
    if (userData && user) {
      const updatedUser = { ...user, ...userData };
      // Проверяем, действительно ли данные изменились
      const hasChanges = JSON.stringify(updatedUser) !== JSON.stringify(user);

      if (hasChanges) {
        dispatch(
          setUser({ user: updatedUser, jwt: localStorage.getItem("token") })
        );
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  }, [userData]); // Убираем user и dispatch из зависимостей

  // Калькулятор всегда сверху
  const calculator = <TeacherProfitCalculator />;

  // Если пользователь не авторизован, показываем приглашение зарегистрироваться/войти
  if (!currentUser) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "600px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Войдите или зарегистрируйтесь
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Чтобы подать заявку на роль преподавателя, пожалуйста, войдите
                  в свой аккаунт или зарегистрируйтесь на платформе.
                </Typography>
                <button
                  className="button Body-3 button-animate"
                  onClick={() => navigate("/login")}
                  style={{ marginRight: "16px" }}
                >
                  Войти
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => navigate("/signup")}
                >
                  Регистрация
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  // Показываем загрузку пока получаем актуальные данные пользователя
  // Показываем loading если: загружаемся, или есть пользователь но нет данных с сервера, или идет фоновое обновление
  console.log("ApplyTeacher - Проверка состояния загрузки:", {
    date: new Date().toISOString(),
    isLoadingUser,
    isFetchingUser,
    hasUser: !!user,
    hasUserData: !!userData,
    hasRequestedData,
    userError: !!userError,
    shouldShowLoading:
      isLoadingUser ||
      (user && !userData) ||
      (hasRequestedData && isFetchingUser),
  });

  if (
    isLoadingUser ||
    (user && !userData) ||
    (hasRequestedData && isFetchingUser)
  ) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <CircularProgress size={40} />
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  {isLoadingUser
                    ? "Загружаем данные..."
                    : "Проверяем статус заявки..."}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {isLoadingUser
                    ? "Получаем актуальную информацию"
                    : "Загружаем актуальные данные о вашей заявке на роль преподавателя"}
                </Typography>
                <button
                  className="button_white Body-3 button-animate"
                  onClick={() => refetch()}
                  style={{ marginTop: "16px" }}
                >
                  Обновить данные
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  // Если произошла ошибка при загрузке данных, показываем сообщение об ошибке
  if (userError) {
    console.error(
      "ApplyTeacher - Ошибка загрузки данных пользователя:",
      userError
    );

    // Определяем роль пользователя для показа соответствующего сообщения
    const isManager = user?.role?.id === Number(ManagerId);
    const isTeacher = user?.role?.id === Number(TeacherId);

    let errorTitle = "Ошибка загрузки данных";
    let errorDescription =
      "Не удалось загрузить данные. Пожалуйста, попробуйте обновить страницу.";

    if (isManager) {
      errorTitle = "Ошибка загрузки данных";
      errorDescription =
        "Не удалось загрузить данные для управления заявками. Пожалуйста, попробуйте обновить страницу.";
    } else if (isTeacher) {
      errorTitle = "Ошибка загрузки данных";
      errorDescription =
        "Не удалось загрузить данные профиля преподавателя. Пожалуйста, попробуйте обновить страницу.";
    } else {
      errorTitle = "Ошибка загрузки данных";
      errorDescription =
        "Не удалось загрузить данные о вашей заявке. Пожалуйста, попробуйте обновить страницу.";
    }

    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#fff3f3",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  color="error"
                >
                  {errorTitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {errorDescription}
                </Typography>
                <button
                  className="button Body-3 button-animate"
                  onClick={() => refetch()}
                  style={{ marginRight: "16px" }}
                >
                  Попробовать снова
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => navigate("/profile/" + currentUser.id)}
                >
                  Вернуться в профиль
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  // Если пользователь менеджер, показываем таблицу заявок
  // Проверяем только после завершения загрузки данных и получения данных с сервера
  if (
    !isLoadingUser &&
    !isFetchingUser &&
    userData &&
    currentUser?.role?.id === Number(ManagerId)
  ) {
    console.log("ApplyTeacher - Проверка роли менеджера:", {
      currentUserRoleId: currentUser?.role?.id,
      ManagerId: ManagerId,
      isManager: currentUser?.role?.id === Number(ManagerId),
    });
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
            <div
              className="h4"
              style={{ marginTop: "12px", marginBottom: "32px" }}
            >
              Заявки на роль преподавателя
            </div>
            <TeacherApplicationsTable />
          </div>
        </div>
      </>
    );
  }

  // Если пользователь уже является преподавателем, показываем приветственное сообщение
  // Проверяем только после завершения загрузки данных и получения данных с сервера
  if (
    !isLoadingUser &&
    !isFetchingUser &&
    userData &&
    currentUser?.role?.id === Number(TeacherId)
  ) {
    console.log("ApplyTeacher - Проверка роли преподавателя:", {
      currentUserRoleId: currentUser?.role?.id,
      TeacherId: TeacherId,
      isTeacher: currentUser?.role?.id === Number(TeacherId),
    });
    console.log("ApplyTeacher - Показываем TeacherWelcome");
    return (
      <>
        {calculator}
        <TeacherWelcome user={currentUser} />
      </>
    );
  }

  // Если пользователь уже подал заявку, показываем соответствующее сообщение
  // Проверяем только после завершения загрузки данных и получения данных с сервера
  if (
    !isLoadingUser &&
    !isFetchingUser &&
    userData &&
    currentUser.requestedTeacherRole
  ) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Заявка уже подана
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Вы уже подали заявку на роль преподавателя. Мы рассмотрим вашу
                  заявку и свяжемся с вами в ближайшее время.
                </Typography>
                <button
                  className="button Body-3 button-animate"
                  onClick={() => navigate("/profile/" + currentUser.id)}
                  style={{ marginRight: "16px" }}
                >
                  Вернуться в профиль
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => navigate("/courses")}
                >
                  Посмотреть курсы
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  // Если заявка была отклонена, проверяем время ожидания
  // Проверяем только после завершения загрузки данных и получения данных с сервера
  if (!isLoadingUser && !isFetchingUser && userData && currentUser.rejectedAt) {
    const daysSinceRejection = moment().diff(
      moment(currentUser.rejectedAt),
      "days"
    );
    const daysToWait = 30 - daysSinceRejection; // Оригинальная логика

    if (daysToWait > 0) {
      return (
        <>
          {calculator}
          <div
            className="padding"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
              <Paper
                elevation={3}
                style={{
                  padding: "40px",
                  textAlign: "center",
                  borderRadius: "20px",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Заявка была отклонена
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    К сожалению, ваша предыдущая заявка на роль преподавателя
                    была отклонена. Вы можете подать новую заявку через{" "}
                    {daysToWait} дней.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Дата отклонения:{" "}
                    {moment(currentUser.rejectedAt).format("DD.MM.YYYY")}
                  </Typography>
                  <button
                    className="button Body-3 button-animate"
                    onClick={() => navigate("/profile/" + currentUser.id)}
                    style={{ marginRight: "16px" }}
                  >
                    Вернуться в профиль
                  </button>
                  <button
                    className="button_secondary Body-3 button-animate-filter"
                    onClick={() => navigate("/courses")}
                  >
                    Посмотреть курсы
                  </button>
                  {/* Временная кнопка для тестирования - удалить после тестирования */}
                  {process.env.NODE_ENV === "development" && (
                    <>
                      {/* <button
                        className="button_white Body-3 button-animate"
                        onClick={async () => {
                          try {
                            // Устанавливаем дату 31 день назад (больше 30 дней)
                            const thirtyOneDaysAgo = moment()
                              .subtract(31, "days")
                              .toISOString();

                            // Обновляем данные на сервере
                            await updateUser({
                              id: currentUser.id,
                              rejectedAt: thirtyOneDaysAgo,
                            }).unwrap();

                            // Обновляем локальные данные
                            const testUser = {
                              ...currentUser,
                              rejectedAt: thirtyOneDaysAgo,
                            };
                            localStorage.setItem(
                              "user",
                              JSON.stringify(testUser)
                            );
                            dispatch(
                              setUser({
                                user: testUser,
                                jwt: localStorage.getItem("token"),
                              })
                            );

                            toast.success(
                              "Тест: установлена дата 31 день назад!"
                            );
                          } catch (error) {
                            console.error(
                              "Ошибка при установке тестовой даты:",
                              error
                            );
                            toast.error("Ошибка при установке тестовой даты");
                          }
                        }}
                        style={{ marginTop: "16px", marginRight: "8px" }}
                      >
                        Тест: Установить дату 31 день назад
                      </button> */}
                      <button
                        className="button_white Body-3 button-animate"
                        onClick={() => {
                          refetch();
                          toast.success("Данные обновлены!");
                        }}
                        style={{ marginTop: "16px" }}
                      >
                        Обновить данные
                      </button>
                    </>
                  )}
                </Box>
              </Paper>
            </div>
          </div>
        </>
      );
    }
  }

  const handleSubmit = async () => {
    console.log("ApplyTeacher - Начинаем подачу заявки");
    setIsSubmitting(true);
    try {
      console.log("ApplyTeacher - Выполняем запрос на подачу заявки");
      await updateTeacherRoleRequestMutation(currentUser.id).unwrap();
      console.log("ApplyTeacher - Заявка успешно отправлена на сервер");

      dispatch(updateTeacherRoleRequest()); // Обновляем состояние пользователя

      // Обновляем данные пользователя в localStorage
      const updatedUser = {
        ...currentUser,
        requestedTeacherRole: true,
        rejectedAt: null,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Обновляем данные с сервера, чтобы получить актуальный статус
      console.log("ApplyTeacher - Обновляем данные с сервера");
      await refetch();
      console.log("ApplyTeacher - Данные с сервера обновлены");

      setIsSubmitted(true);
      toast.success("Заявка на роль преподавателя успешно подана!");
    } catch (error) {
      console.error("Ошибка при подаче заявки:", error);
      toast.error("Ошибка при подаче заявки. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
      console.log("ApplyTeacher - Процесс подачи заявки завершен");
    }
  };

  // Показываем loading во время подачи заявки
  if (isSubmitting) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <CircularProgress size={40} />
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Отправляем заявку...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Пожалуйста, подождите, мы обрабатываем вашу заявку на роль
                  преподавателя
                </Typography>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  if (isSubmitted) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <Paper
              elevation={3}
              style={{
                padding: "40px",
                textAlign: "center",
                borderRadius: "20px",
                backgroundColor: "#f0f8f0",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  color="success.main"
                >
                  Заявка подана успешно!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Спасибо за ваш интерес к преподавательской деятельности! Мы
                  рассмотрим вашу заявку и свяжемся с вами в ближайшее время для
                  обсуждения дальнейших шагов.
                </Typography>
                <button
                  className="button Body-3 button-animate"
                  onClick={() => navigate("/profile/" + currentUser.id)}
                  style={{ marginRight: "16px" }}
                >
                  Вернуться в профиль
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => navigate("/courses")}
                >
                  Посмотреть курсы
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }

  // Показываем форму подачи заявки только после завершения загрузки данных и получения данных с сервера
  if (!isLoadingUser && !isFetchingUser && userData) {
    return (
      <>
        {calculator}
        <div
          className="padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            <div
              className="h4"
              style={{
                marginTop: "12px",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              Стать преподавателем
            </div>

            <Paper
              elevation={3}
              style={{
                padding: "40px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Добро пожаловать в команду преподавателей!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Мы рады, что вы хотите присоединиться к нашей команде
                  преподавателей. Подав заявку, вы получите возможность
                  создавать курсы и делиться своими знаниями с учениками.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Что вы получите:
                </Typography>
                <ul style={{ paddingLeft: "20px", color: "#666" }}>
                  <li className="Body-2">
                    Возможность создавать собственные курсы
                  </li>
                  <li className="Body-2">
                    Доступ к инструментам управления учениками
                  </li>
                  <li className="Body-2">
                    Возможность загружать гайды и материалы
                  </li>
                  <li className="Body-2">Создание портфолио и древа навыков</li>
                  {/* <li className="Body-2">
                Доступ к системе чатов для общения с учениками
              </li> */}
                </ul>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Что от вас требуется:
                </Typography>
                <ul style={{ paddingLeft: "20px", color: "#666" }}>
                  <li className="Body-2">
                    Заполненное портофлио на сайте anirum
                  </li>
                  <li className="Body-2">
                    Опыт в преподавании или желание делиться знаниями
                  </li>
                  <li className="Body-2">
                    Готовность создавать качественный контент
                  </li>
                  <li className="Body-2">
                    Ответственность в работе с учениками
                  </li>
                  <li className="Body-2">Соблюдение правил платформы</li>
                </ul>
              </Box>

              <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body2">
                  После подачи заявки наша команда рассмотрит вашу кандидатуру и
                  свяжется с вами для обсуждения деталей сотрудничества.
                </Typography>
              </Alert>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <button
                  className="button Body-3 button-animate"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    minWidth: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      Отправка...
                    </>
                  ) : (
                    "Подать заявку"
                  )}
                </button>
                <button
                  className="button_white Body-3 button-animate"
                  onClick={() => navigate("/profile/" + currentUser.id)}
                  disabled={isSubmitting}
                >
                  Отмена
                </button>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

import React from "react";
import { useLocation } from "react-router-dom";
import { useFetchInvoiceByIdQuery } from "../redux/services/invoiceAPI";
import moment from "moment";
import "moment/locale/ru";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getNextLessonDate(startDay, endDay, groupAttrs) {
  if (!startDay || !endDay || !groupAttrs) return null;
  const activeDays = [
    { key: "monday", value: groupAttrs.monday },
    { key: "tuesday", value: groupAttrs.tuesday },
    { key: "wednesday", value: groupAttrs.wednesday },
    { key: "thursday", value: groupAttrs.thursday },
    { key: "friday", value: groupAttrs.friday },
    { key: "saturday", value: groupAttrs.saturday },
    { key: "sunday", value: groupAttrs.sunday },
  ];
  const start = moment.max(moment().startOf("day"), moment(startDay));
  const end = moment(endDay);
  for (let day = start.clone(); day.isSameOrBefore(end); day.add(1, "days")) {
    const dayOfWeek = day.locale("en").format("dddd").toLowerCase();
    const isActive = activeDays.find((d) => d.key === dayOfWeek)?.value;
    if (isActive) {
      return day;
    }
  }
  return null;
}

function getDaysDiff(date) {
  if (!date) return null;
  const today = moment().startOf("day");
  return date.diff(today, "days");
}

function formatDateRu(date) {
  if (!date) return "—";
  return date.locale("ru").format("D MMMM YYYY");
}

export default function SucsessCourse() {
  const query = useQuery();
  // OrderId приходит в формате order_invoice_625
  const orderIdRaw = query.get("OrderId");
  // Достаём только id инвойса (число после последнего _)
  const invoiceId = orderIdRaw ? orderIdRaw.split("_").pop() : null;

  // Запрашиваем счет с популейтом группы
  const {
    data: invoiceData,
    isLoading,
    error,
  } = useFetchInvoiceByIdQuery(invoiceId, { skip: !invoiceId });

  // Выводим данные в консоль для отладки
  React.useEffect(() => {
    if (invoiceData) {
      console.log("invoiceData:", invoiceData);
    }
  }, [invoiceData]);

  // Достаём нужные поля из группы
  const group = invoiceData?.data?.attributes?.group?.data;
  const groupId = group?.id;
  const groupAttrs = group?.attributes || {};
  const { format, direction, items, start_time, end_time, time_zone } =
    groupAttrs;
  const invoiceStartDay = invoiceData?.data?.attributes?.start_day;
  const invoiceEndDay = invoiceData?.data?.attributes?.end_day;

  // Вычисляем ближайший день занятия
  const nextLessonMoment = getNextLessonDate(
    invoiceStartDay,
    invoiceEndDay,
    groupAttrs
  );
  const nextLessonDateRu = formatDateRu(nextLessonMoment);
  const daysDiff = getDaysDiff(nextLessonMoment);

  // Время занятий с учетом таймзоны пользователя
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let userStartTime = "—";
  let userEndTime = "—";
  if (start_time && end_time && time_zone) {
    userStartTime = moment
      .tz(start_time, "HH:mm:ss", time_zone)
      .tz(userTimeZone)
      .format("HH:mm");
    userEndTime = moment
      .tz(end_time, "HH:mm:ss", time_zone)
      .tz(userTimeZone)
      .format("HH:mm");
  }

  function renderNextLessonInfo() {
    if (daysDiff === 0) {
      return <span> (сегодня)</span>;
    }
    if (daysDiff !== null && daysDiff > 0) {
      return (
        <span>
          {` (через ${daysDiff} ${
            daysDiff === 1
              ? "день"
              : daysDiff >= 2 && daysDiff <= 4
              ? "дня"
              : "дней"
          })`}
        </span>
      );
    }
    return null;
  }

  return (
    <div className="padding">
      <div className="h4">Успешно оплачено</div>
      <div className="h5" style={{ marginTop: "16px" }}>
        Ваши занятия
      </div>
      {isLoading && (
        <div className="Body-2">Загрузка информации о платеже...</div>
      )}
      {error && (
        <div className="Body-2" style={{ color: "red" }}>
          Ошибка загрузки счета
        </div>
      )}
      {invoiceData && (
        <>
          <div className="Body-3" style={{ marginTop: "12px" }}>
            Что нужно взять с собой:
          </div>
          <div className="Body-2" style={{ marginTop: "4px" }}>
            {items || "—"}
          </div>
          <div className="Body-3" style={{ marginTop: "12px" }}>
            Даты:
          </div>
          <div className="Body-2" style={{ marginTop: "4px" }}>
            Ближайшее занятие: {nextLessonDateRu}
            {renderNextLessonInfo()}, Время {userStartTime} — {userEndTime} (
            {userTimeZone})
          </div>
          {format === "Онлайн" ? (
            <div>
              <div className="Body-3" style={{ marginTop: "12px" }}>
                Приглашение
              </div>
              <div className="Body-2" style={{ marginTop: "4px" }}>
                ссылка
              </div>
              <div className="Body-3" style={{ marginTop: "12px" }}>
                Где пройдут занятия
              </div>
              <div className="Body-2" style={{ marginTop: "4px" }}>
                Online Google Meet. Ссылка на связь будет отправлена в группе
                приглашения.
              </div>
            </div>
          ) : (
            <div>
              <div className="Body-3" style={{ marginTop: "12px" }}>
                Адрес
              </div>
              <div className="Body-2" style={{ marginTop: "4px" }}>
                гугл карта
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

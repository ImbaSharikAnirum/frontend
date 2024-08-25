import React from "react";

export default function Conditions() {
  return (
    <div>
      <div className="h4">Условия предоставления услуг</div>
      <div style={{ marginTop: "16px" }}>
        <div className="Body-3" style={{ marginTop: "8px" }}> Оплата:</div>
        <div className="Body-2" > Оплата производится ежемесячно.</div>
        <div className="Body-2"> Частичная оплата не предусмотрена.</div>
        <div className="Body-3" style={{ marginTop: "8px" }}>
          Возврат и отмена:
        </div>
        <div className="Body-2">
          Возврат средств возможен только при отмене не позднее чем за 2 дня до
          начала учебного месяца.
        </div>
        <div className="Body-2">
          Если занятия не удовлетворили, полная сумма за оплаченный месяц
          возвращается.
        </div>
        <div className="Body-2">
          Возврат средств за пропуски (включая болезни и прочие причины) не
          предусмотрен, даже при наличии справки.
        </div>
        <div className="Body-3" style={{ marginTop: "8px" }}>
          Бронирование места:
        </div>
        <div className="Body-2">
          Место в группе сохраняется только после полной оплаты.
        </div>
        <div className="Body-2">
          Рекомендуется производить оплату не позднее чем за 5 дней до начала
          учебного месяца.
        </div>
        <div className="Body-3" style={{ marginTop: "8px" }}>
          Контактная информация
        </div>
        <div className="Body-2">
          Если у вас возникли вопросы или вам требуется дополнительная
          информация, вы можете связаться с нами через по номеру whatsapp
          +79142701411
        </div>
      </div>
    </div>
  );
}

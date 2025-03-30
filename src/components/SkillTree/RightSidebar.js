import React from "react";
import { ReactComponent as Globe } from "../../images/globe.svg";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function RightSidebar({
  selectedNode,
  treeImage,
  branchTitle,
  branchId,
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 120px)",
        boxSizing: "border-box",
        marginTop: isMobile && "50px",
      }}
    >
      {!selectedNode && treeImage && (
        <div style={{ marginBottom: "16px" }}>
          <div className="h4"> {branchTitle}</div>
          <img
            src={treeImage}
            alt="Skill Tree"
            style={{
              borderRadius: "16px",
              width: "100%",
              objectFit: "cover",
              marginTop: "16px",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                width: "70px",
                minWidth: "70px",
                height: "70px",
                border: "1px solid #DDDDDD",
                borderRadius: "150px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe style={{ width: "30px", height: "30px" }} />
            </div>
            <div className="h5" style={{ marginLeft: "24px" }}>
              Просмотр и чтение / Бесплатно
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                width: "70px",
                minWidth: "70px",
                height: "70px",
                border: "1px solid #DDDDDD",
                borderRadius: "150px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="h5"
                style={{ fontSize: "14px", width: "60px", textAlign: "center" }}
              >
                15$ за пакет гайдов
              </div>
            </div>
            <div className="h5" style={{ marginLeft: "24px" }}>
              Загрузить работу путем выполнения задачи
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "32px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                width: "70px",
                minWidth: "70px",
                height: "70px",
                border: "1px solid #DDDDDD",
                borderRadius: "150px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="h5"
                style={{ fontSize: "14px", width: "60px", textAlign: "center" }}
              >
                20$ за занятие
              </div>
            </div>
            <div style={{ marginLeft: "24px" }}>
              <div className="h5"> Записаться на занятие по этой теме</div>
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "8px" }}
              >
                <div>
                  <div className="Body-2">Индивидуальные</div>
                  <div style={{ marginTop: "8px" }} className="Body-2">
                    Групповые
                  </div>
                </div>
                <div style={{ marginLeft: "12px" }}>
                  <div className="Body-2">Онлайн</div>
                  <div style={{ marginTop: "8px" }} className="Body-2">
                    Оффлайн
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNode ? (
        <div style={{ width: "100%" }}>
          {selectedNode.data?.imageUrl && (
            <img
              src={selectedNode.data.imageUrl}
              alt="Preview"
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
          )}
          {selectedNode.type === "customSkill" && (
            <div style={{ marginTop: "24px" }}>
              <div className="Body-3">Получаемый навык:</div>
              <div className="Body-3" style={{ marginTop: "12px" }}>
                {selectedNode.data.label}
              </div>
            </div>
          )}
          {selectedNode.type === "customNode" && (
            <div style={{ marginTop: "24px" }} className="Body-3">
              {selectedNode.data.label}
            </div>
          )}
          {selectedNode.type === "customNode" && (
            <Link
              to={`/guide/${selectedNode.data.guideId}`}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <button
                className="button Body-3 button-animate-filter"
                style={{ marginTop: "24px" }}
              >
                Смотреть
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div>
          {/* <div className="Body-3">
            Нажмите на гайд или навык, чтобы увидеть детали
          </div> */}
        </div>
      )}
    </div>
  );
}

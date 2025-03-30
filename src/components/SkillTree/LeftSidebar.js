import React, { useEffect } from "react";
import { Avatar, Skeleton } from "@mui/material";
import AddGuidesSection from "./AddGuidesSection";
import {
  useGetMySkillTreesQuery,
  useGetSavedSkillTreesQuery,
} from "../../redux/services/skillTreeAPI";
import { ReactComponent as Create } from "../../images/Create.svg";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setMySkillTrees,
  setSavedSkillTrees,
} from "../../redux/reducers/skillTreeSlice";
import { useMediaQuery } from "react-responsive";

export default function LeftSidebar({
  onAddNode,
  onLoadBranch,
  onCreateBranch,
  activeBranchId,
  userId,
}) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { data: fetchedMySkillTrees } = useGetMySkillTreesQuery(userId, {
    skip: !userId,
  });
  const { data: fetchedSavedSkillTrees } = useGetSavedSkillTreesQuery(userId, {
    skip: !userId,
  });
  const mySkillTrees = useSelector((state) => state.skillTree.mySkillTrees);
  const savedSkillTrees = useSelector(
    (state) => state.skillTree.savedSkillTrees
  );
  useEffect(() => {
    if (fetchedMySkillTrees?.data) {
      dispatch(setMySkillTrees(fetchedMySkillTrees.data));
    }
    if (fetchedSavedSkillTrees?.data) {
      dispatch(setSavedSkillTrees(fetchedSavedSkillTrees.data));
    }
  }, [fetchedMySkillTrees, fetchedSavedSkillTrees]);
  // Обработчик клика по блоку "2D Рисование"
  const handle2DClick = async () => {
    onLoadBranch("4");
  };
  const isActive2D = activeBranchId === 4;

  // Стиль для выделенного пункта
  const activeStyle = {
    backgroundColor: "#DDDDDD",
    // border: "2px solid #0288d1",
    borderRadius: "4px",
    padding: "8px",
    color: "black",
  };

  return (
    <div
      id="sidebar-container"
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
      <div className="Body-3">Направления</div>
      <div style={{ marginTop: "16px", display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            ...(isActive2D ? activeStyle : {}),
          }}
          onClick={handle2DClick}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#eee", // можно заменить на нужный цвет
              transform: "rotate(45deg)", // поворот контейнера
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
            <div
              className="Body-3"
              style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
            >
              2D
            </div>
          </div>

          <div
            className="Body-2"
            style={{ fontSize: "14px", marginLeft: "8px" }}
          >
            2D Рисование
          </div>
        </div>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "16px",
              opacity: 0.4,
            }}
          >
            <div
              style={{
                pointerEvents: "none",
                width: "20px",
                height: "20px",
                backgroundColor: "#eee",
                transform: "rotate(45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                3D
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              3D Моделирование
            </div>
          </div>
        </Tooltip>
      </div>
      <div style={{ marginTop: "16px", display: "flex" }}>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                A
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Анимация
            </div>
          </div>
        </Tooltip>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.5,
              marginLeft: "16px",
            }}
          >
            <div
              style={{
                pointerEvents: "none",
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                Sk
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Скетчинг
            </div>
          </div>
        </Tooltip>
      </div>
      <div className="Body-3" style={{ marginTop: "32px" }}>
        Софт
      </div>
      <div style={{ marginTop: "16px", display: "flex" }}>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                Sai
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Paint Tool SAI
            </div>
          </div>
        </Tooltip>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "16px",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                Zb
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              ZBrush
            </div>
          </div>
        </Tooltip>
      </div>
      <div style={{ marginTop: "16px", display: "flex" }}>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                Ph
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Photoshop
            </div>
          </div>
        </Tooltip>
        <Tooltip title="Готовьтесь скоро появится" arrow>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "16px",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#eee", // можно заменить на нужный цвет
                transform: "rotate(45deg)", // поворот контейнера
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {/* Текст внутри, выравниваем обратно -45°, чтобы он не был повернут */}
              <div
                className="Body-3"
                style={{ transform: "rotate(-45deg)", fontSize: "10px" }}
              >
                Sk
              </div>
            </div>

            <div
              className="Body-2"
              style={{
                pointerEvents: "none",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Скетчинг
            </div>
          </div>
        </Tooltip>
      </div>

      <div className="Body-3" style={{ marginTop: "24px" }}>
        Мои ветки развития
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            flexWrap: "nowrap",
          }}
        >
          {userId && (
            <button
              to="/create/guide"
              className="button-create"
              onClick={onCreateBranch}
              style={{
                padding: 0,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid #CDCDCD",
                minWidth: "40px",
              }}
            >
              <Create />
            </button>
          )}
          {fetchedMySkillTrees === undefined ? (
            // 👇 Показываем скелетоны при загрузке
            [1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                key={i}
                sx={{ flexShrink: 0, minWidth: 40 }}
              />
            ))
          ) : mySkillTrees.length > 0 ? (
            mySkillTrees.map((branch) => (
              <Avatar
                key={branch.id}
                alt={branch.attributes.title || "Без названия"}
                src={branch.attributes.image?.data?.[0]?.attributes?.url}
                sx={{
                  height: "39px",
                  width: "39px",
                  minWidth: "39px",
                  cursor: "pointer",
                  border: "1px solid #CDCDCD",
                }}
                onClick={() => onLoadBranch(branch.id)}
              />
            ))
          ) : (
            <div className="Body-2"></div>
          )}
        </div>
      </div>

      <div className="Body-3" style={{ marginTop: "16px" }}>
        Сохраненные ветки
      </div>
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "8px",
        }}
      >
        {fetchedSavedSkillTrees === undefined ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              key={i}
              sx={{ flexShrink: 0, minWidth: 40 }}
            />
          ))
        ) : savedSkillTrees.length > 0 ? (
          savedSkillTrees.map((branch) => (
            <Avatar
              key={branch.id}
              alt={branch.attributes.title || "Без названия"}
              src={branch.attributes.image?.data?.[0]?.attributes?.url}
              sx={{
                height: 40,
                width: 40,
                flex: "0 0 auto",
                cursor: "pointer",
                ...(branch.id === activeBranchId
                  ? { border: "1px solid blue" }
                  : {}),
              }}
              onClick={() => onLoadBranch(branch.id)}
            />
          ))
        ) : (
          <div className="Body-2">Нет веток</div>
        )}
      </div>
      <div className="Body-3" style={{ marginTop: "24px" }}>
        Добавьте гайды
      </div>
      <AddGuidesSection onAddNode={onAddNode} />
    </div>
  );
}

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../components/SkillTree/CustomNode";
import CustomSkill from "../components/SkillTree/CustomSkill";
import LeftSidebar from "../components/SkillTree/LeftSidebar";
import RightSidebar from "../components/SkillTree/RightSidebar";
import { useMemo } from "react";
import { useDeleteSkillMutation } from "../redux/services/skillAPI";
import SkillUploadModal from "../components/SkillTree/SkillUploadModal";
import SaveSkillTreeModal from "../components/SkillTree/SaveSkillTreeModal";
import { selectCurrentUser } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import {
  useDeleteSkillTreeMutation,
  useGetSkillTreeByIdQuery,
  useLazyGetSkillTreeByIdQuery,
  useSaveSkillTreeMutation,
  useUnsaveSkillTreeMutation,
} from "../redux/services/skillTreeAPI";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addToMySkillTrees,
  addToSavedSkillTrees,
  removeFromSavedSkillTrees,
  setActiveSkillTreeId,
  setEdges,
  setNodes,
  updateEdges,
  updateNodes,
} from "../redux/reducers/skillTreeSlice";
import DeleteSkillTreeModal from "../components/SkillTree/DeleteSkillTreeModal";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate } from "react-router-dom";

export default function SkillTree() {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.skillTree.nodes);
  const edges = useSelector((state) => state.skillTree.edges);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(!isMobile);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(!isMobile);
  const { branchId: paramBranchId } = useParams();
  const [savedBy, setSavedBy] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [deleteSkill] = useDeleteSkillMutation();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const getTreeData = () => ({ nodes, edges });
  // const [isLoadingBranch, setIsLoadingBranch] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSkillTree] = useDeleteSkillTreeMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [branchAuthorId, setBranchAuthorId] = useState(null);
  // const [branchId, setBranchId] = useState(null);
  const [branchTitle, setBranchTitle] = useState("");
  const [branchImageUrl, setBranchImageUrl] = useState(null);
  const user = useSelector(selectCurrentUser);
  const isUserReady = Boolean(user?.id);
  const navigate = useNavigate();

  const [branchId, setBranchId] = useState(
    paramBranchId || localStorage.getItem("lastBranchId") || "4"
  );
  const { data: branchResult, isLoading: isLoadingBranch } =
    useGetSkillTreeByIdQuery(
      { id: branchId },
      { skip: !branchId || !isUserReady }
    );
  const [isCreatingNewBranch, setIsCreatingNewBranch] = useState(false);

  const [backupNodes, setBackupNodes] = useState([]);
  const [backupEdges, setBackupEdges] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const onNodesChange = useCallback(
    (changes) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch(updateNodes(updated));
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch(updateEdges(updated));
    },
    [edges]
  );

  const onConnect = useCallback(
    (params) => {
      const updated = addEdge({ ...params, animated: true }, edges);
      dispatch(updateEdges(updated));
    },
    [edges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      const updated = updateEdge(oldEdge, newConnection, edges);
      dispatch(updateEdges(updated));
    },
    [edges]
  );

  const [saveSkillTree] = useSaveSkillTreeMutation();
  const [unsaveSkillTree] = useUnsaveSkillTreeMutation();
  const handleEditToggle = () => {
    if (!editMode) {
      setBackupNodes(nodes);
      setBackupEdges(edges);
      setEditMode(true);
    } else {
      setNodes(backupNodes);
      setEdges(backupEdges);
      setEditMode(false);
    }
  };
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
      customSkill: CustomSkill,
    }),
    []
  );
  // 1. Добавьте реф для обёртки ReactFlow и состояние для экземпляра flow
  const flowWrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  useEffect(() => {
    if (branchId) {
      localStorage.setItem("lastBranchId", branchId);
    } else {
      localStorage.removeItem("lastBranchId");
    }
  }, [branchId]);
  // 2. Функция для вычисления центра видимой области
  const getVisibleCenter = () => {
    if (!rfInstance || !flowWrapperRef.current) return { x: 300, y: 200 };
    const bounds = flowWrapperRef.current.getBoundingClientRect();
    const center = rfInstance.project({
      x: bounds.width / 2,
      y: bounds.height / 2,
    });
    // Диапазон смещения: x: [100,500] -> после вычитания 300 получается [-200,200],
    // y: [100,300] -> после вычитания 200 получается [-100,100]
    const offsetX = Math.random() * 400 + 100 - 300;
    const offsetY = Math.random() * 200 + 100 - 200;
    return { x: center.x + offsetX, y: center.y + offsetY };
  };

  // Функция для создания нового узла на основе выбранного гайда
  const addGuideNode = useCallback(
    (guide) => {
      if (!editMode) return;

      const imageAttributes = guide.attributes?.image?.data?.attributes;
      const url =
        imageAttributes?.formats?.medium?.url ||
        imageAttributes?.formats?.small?.url ||
        imageAttributes?.url;
      const center = getVisibleCenter();

      const newNode = {
        id: `guide-${guide.id}`,
        type: "customNode",
        position: center,
        data: {
          label: guide.attributes.title || "Без названия",
          text: guide.attributes.text || "Без описания",
          completed: false,
          imageUrl: url,
          guideId: guide.id,
        },
      };

      dispatch(setNodes([...nodes, newNode]));
    },
    [editMode, nodes, dispatch]
  );

  // Функция для добавления нового узла направления (результат API)
  const handleSkillCreated = (newSkill) => {
    const center = getVisibleCenter();
    const node = { ...newSkill, position: center };
    dispatch(setNodes([...nodes, node])); // ⬅️ Обновляем Redux-состояние
  };

  // Функция для загрузки ветки из API в React Flow
  const loadBranch = (branchData) => {
    dispatch(setNodes(branchData.nodes));
    dispatch(setEdges(branchData.edges));
    dispatch(setActiveSkillTreeId(branchData.skillTreeId));

    setBranchId(branchData.skillTreeId);
    setBranchTitle(branchData.skillTreeTitle);
    setBranchImageUrl(branchData.imageUrl);
    setBranchAuthorId(branchData.authorId);
    localStorage.setItem("lastBranchId", branchData.skillTreeId);
  };

  // Создание новой связи (source → target)
  // const onConnect = useCallback(
  //   (params) => {
  //     setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  //   },
  //   [setEdges]
  // );

  // // Разрешаем «перетягивать» существующие связи
  // const onEdgeUpdate = useCallback(
  //   (oldEdge, newConnection) => {
  //     setEdges((els) => updateEdge(oldEdge, newConnection, els));
  //   },
  //   [setEdges]
  // );

  // Удаляем связь по двойному клику
  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );
  // Обработка изменения узлов
  const handleNodesChange = useCallback(
    (changes) => {
      // Перебираем все изменения, если узел удаляется
      changes.forEach((change) => {
        if (change.type === "remove") {
          // Ищем удаляемый узел в текущем состоянии
          const nodeToRemove = nodes.find((n) => n.id === change.id);
          // Если узел типа customDirection — удаляем с сервера
          if (nodeToRemove && nodeToRemove.type === "customSkill") {
            // У нас id узла имеет вид "direction-<numericId>"
            const numericId = nodeToRemove.id.replace("skill-", "");
            deleteSkill(numericId);
          }
        }
      });
      onNodesChange(changes);
    },
    [nodes, onNodesChange, deleteSkill]
  );

  useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (
          sourceNode &&
          targetNode &&
          sourceNode.data.completed &&
          targetNode.data.completed
        ) {
          return {
            ...edge,
            animated: false,
            style: { stroke: "orange", strokeDasharray: "0" },
          };
        }
        return {
          ...edge,
          animated: true,
          style: {},
        };
      })
    );
  }, [nodes, setEdges]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  useEffect(() => {
    if (!branchResult?.entity || isCreatingNewBranch || editMode) return;
    const { entity } = branchResult;
    const treeData = entity?.treeData;
    const authorId = entity?.author?.id;
    const skillTreeId = entity?.id;
    const skillTreeTitle = entity?.title;
    const imageUrl = entity?.image?.[0]?.url;
    const savedIds = entity?.savedBy?.map((u) => u.id) || [];
    setSavedBy(savedIds);
    setIsSaved(user && savedIds.includes(user.id));
    if (treeData) {
      loadBranch({
        ...treeData,
        nodes: treeData.nodes,
        edges: treeData.edges,
        skillTreeId,
        skillTreeTitle,
        authorId,
        imageUrl,
      });
    }
  }, [branchResult, user, isCreatingNewBranch, editMode]);

  const handleToggleSave = async () => {
    if (!user || !branchId) return;

    const willBeSaved = !isSaved;

    // 💡 UI сразу обновляем
    setIsSaved(willBeSaved);
    setSavedBy((prev) =>
      willBeSaved ? [...prev, user.id] : prev.filter((uid) => uid !== user.id)
    );

    const skillTreePayload = {
      id: Number(branchId),
      attributes: {
        title: branchTitle,
        image: {
          data: [{ attributes: { url: branchImageUrl } }],
        },
      },
    };

    try {
      if (willBeSaved) {
        // 1️⃣ Сразу обновляем список в Redux
        dispatch(addToSavedSkillTrees(skillTreePayload));

        // 2️⃣ А потом отправляем запрос
        await saveSkillTree({ id: branchId, userId: user.id }).unwrap();
      } else {
        // 1️⃣ Удаляем из Redux сразу
        dispatch(removeFromSavedSkillTrees(Number(branchId)));

        // 2️⃣ А потом отправляем запрос
        await unsaveSkillTree({ id: branchId, userId: user.id }).unwrap();
      }
    } catch (err) {
      // 🔁 Откатим optimistic update, если ошибка
      setIsSaved(!willBeSaved);
      setSavedBy((prev) =>
        !willBeSaved
          ? [...prev, user.id]
          : prev.filter((uid) => uid !== user.id)
      );

      // ❗ Можно вернуть/удалить из Redux обратно, если хочешь
      if (willBeSaved) {
        dispatch(removeFromSavedSkillTrees(Number(branchId)));
      } else {
        dispatch(addToSavedSkillTrees(skillTreePayload));
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!branchId) return;

    setIsDeleting(true);
    try {
      await deleteSkillTree(branchId).unwrap();
      setBranchId(null);
      setBranchTitle("Новая ветка");
      setBranchImageUrl(null);
      setBranchAuthorId(null);
      dispatch(setNodes([]));
      dispatch(setEdges([]));
      dispatch(setActiveSkillTreeId(null));
      toast.success("Ветка успешно удалена");
      setIsDeleteModalOpen(false);
      setEditMode(false);
      setBranchId(null);
      setBranchTitle("");
      setBranchImageUrl(null);
    } catch (err) {
      console.error("Ошибка удаления:", err);
      toast.error("Не удалось удалить ветку");
    } finally {
      setIsDeleting(false);
    }
  };
  // Новая функция: очищаем React Flow и включаем режим редактирования
  const handleCreateBranch = () => {
    setIsCreatingNewBranch(true); // ✅ новый флаг
    dispatch(setNodes([])); // очистка Redux
    dispatch(setEdges([]));
    setEditMode(true);
    setBranchId(null);
    setBranchTitle("Новая ветка");
    setBranchImageUrl(null);
    dispatch(setActiveSkillTreeId(null)); // обязательно
  };

  const handleNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);

      if (isMobile && !editMode) {
        const guideId = node.data?.guideId;
        if (guideId) {
          navigate(`/guide/${guideId}`);
        } else {
          setIsRightSidebarOpen(true);
          setIsLeftSidebarOpen(false);
        }
      }
    },
    [isMobile, editMode, navigate]
  );

  const [fetchBranchById] = useLazyGetSkillTreeByIdQuery();
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  const loadBranchById = async (id) => {
    setEditMode(false);
    setBackupNodes([]);
    setBackupEdges([]);
    setSelectedNode(null);
    setIsBranchLoading(true);

    try {
      const response = await fetchBranchById({ id }).unwrap();

      const entity = response?.entity;
      const treeData = entity?.treeData;

      if (treeData) {
        setIsCreatingNewBranch(false); // ✅ сначала сбрасываем

        loadBranch({
          ...treeData,
          nodes: treeData.nodes,
          edges: treeData.edges,
          skillTreeId: entity.id,
          skillTreeTitle: entity.title,
          authorId: entity.author?.id,
          imageUrl: entity.image?.[0]?.url,
        });
        setIsCreatingNewBranch(false); // ⬅️ вот это обязательно
      }
    } catch (err) {
      console.error("Ошибка загрузки ветки:", err);
    } finally {
      setIsBranchLoading(false);
    }
  };
  const closeMobileMenu = () => {
    if (isMobile) {
      setIsLeftSidebarOpen(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      {isMobile && (
        <>
          <button
            className="button_secondary"
            onClick={() => {
              setIsLeftSidebarOpen((prev) => {
                const newState = !prev;
                if (newState) setIsRightSidebarOpen(false); // закрываем другую
                return newState;
              });
            }}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 20,
            }}
          >
            Меню
          </button>

          <button
            className="button_secondary"
            onClick={() => {
              setIsRightSidebarOpen((prev) => {
                const newState = !prev;
                if (newState) setIsLeftSidebarOpen(false); // закрываем другую
                return newState;
              });
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 20,
            }}
          >
            Инфо
          </button>
        </>
      )}
      {isMobile &&
        !isLeftSidebarOpen &&
        !isRightSidebarOpen &&
        !isLoadingBranch &&
        (branchId || editMode) &&
        user && (
          <div
            style={{
              position: "absolute",
              top: 64,
              left: 16,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {editMode && (
              <>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => setIsSkillModalOpen(true)}
                  title="Добавить скилл"
                >
                  <AddIcon fontSize="small" />
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => setIsSaveModalOpen(true)}
                  title="Сохранить ветку"
                >
                  <SaveIcon fontSize="small" />
                </button>
                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={!branchId}
                  title="Удалить ветку"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </>
            )}
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleEditToggle}
              title={editMode ? "Отменить редактирование" : "Редактировать"}
              style={{
                backgroundColor: editMode ? "#e3f2fd" : undefined,
                color: editMode ? "#1976d2" : undefined,
              }}
            >
              <EditIcon
                fontSize="small"
                color={editMode ? "primary" : "inherit"}
              />
            </button>
            {!editMode && branchId && user && branchAuthorId !== user.id && (
              <button
                className="button_secondary Body-3 button-animate-filter"
                onClick={handleToggleSave}
                title={isSaved ? "Сохранено" : "Сохранить"}
                style={{
                  backgroundColor: isSaved ? "black" : undefined,
                  color: isSaved ? "white" : undefined,
                }}
              >
                {isSaved ? (
                  <BookmarkIcon fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </button>
            )}
          </div>
        )}
      {(isBranchLoading || isLoadingBranch) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} />
        </div>
      )}
      {(!isMobile || isLeftSidebarOpen) && (
        <div
          style={{
            width: isMobile ? "100%" : "30%",
            position: isMobile ? "absolute" : "relative",
            zIndex: 15,
            backgroundColor: "white",
            height: "100%",
            overflowY: "auto",
            borderRight: isMobile ? "none" : "1px solid #CDCDCD",
          }}
        >
          <LeftSidebar
            onAddNode={(guide) => {
              addGuideNode(guide);
              closeMobileMenu(); // ✅ закрываем меню при добавлении гайда
            }}
            onLoadBranch={(id) => {
              loadBranchById(id);
              closeMobileMenu(); // ✅ закрываем меню при загрузке ветки
            }}
            onCreateBranch={() => {
              handleCreateBranch();
              closeMobileMenu(); // ✅ закрываем меню при создании новой ветки
            }}
            activeBranchId={branchId}
            userId={user?.id}
          />
        </div>
      )}
      <div
        style={{
          width: isMobile ? "70%" : "100vw",
          height: isMobile && "calc(100vh - 150px)", // ✅ добавь это

          position: "relative",
          flexGrow: 1, // ✅ если нужно, чтобы растягивался
        }}
        ref={flowWrapperRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Кнопка добавления направления */}
        {user && !isMobile && branchAuthorId === user.id && editMode && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              zIndex: 10,
            }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={() => setIsSkillModalOpen(true)}
            >
              Добавить скилл
            </button>
          </div>
        )}
        {isSkillModalOpen && (
          <div style={{ position: "absolute" }}>
            <SkillUploadModal
              onClose={() => setIsSkillModalOpen(false)}
              onSkillCreated={handleSkillCreated}
            />
          </div>
        )}
        <ReactFlow
          onInit={setRfInstance}
          proOptions={{ hideAttribution: true }}
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={editMode ? handleNodesChange : undefined}
          onEdgesChange={editMode ? onEdgesChange : undefined}
          onConnect={editMode ? onConnect : undefined}
          onEdgeUpdate={editMode ? onEdgeUpdate : undefined}
          onEdgeDoubleClick={editMode ? onEdgeDoubleClick : undefined}
          nodesDraggable={editMode}
          nodesConnectable={editMode}
          elementsSelectable={editMode}
          edgesUpdatable={editMode}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnDrag={true}
          panOnScroll={true}
          fitView
          onNodeClick={handleNodeClick}
        >
          <Background color="#aaa" />
          <Controls showInteractive={false} />
          <MiniMap />
        </ReactFlow>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "250px",
            zIndex: 10,
          }}
        >
          {!isLoadingBranch && !isMobile && user && (branchId || editMode) ? (
            branchAuthorId === user.id || !branchId ? (
              <>
                {editMode && (
                  <>
                    <button
                      className="button_secondary Body-3 button-animate-filter"
                      onClick={() => setIsDeleteModalOpen(true)}
                      style={{
                        marginRight: "16px",
                        backgroundColor: "#fff0f0",
                        color: "#d32f2f",
                        fontSize: isMobile && "10px",
                      }}
                      disabled={!branchId} // блокируем удаление, если ветка ещё не создана
                    >
                      Удалить ветку
                    </button>
                    <button
                      className="button_secondary Body-3 button-animate-filter"
                      onClick={() => setIsSaveModalOpen(true)}
                      style={{
                        marginRight: "16px",
                        fontSize: isMobile && "10px",
                      }}
                    >
                      Сохранить ветку
                    </button>
                  </>
                )}

                <button
                  className="button_secondary Body-3 button-animate-filter"
                  onClick={handleEditToggle}
                >
                  {editMode ? "Отменить редактирование" : "Редактировать"}
                </button>
              </>
            ) : (
              <>
                {!isMobile && (
                  <button
                    className="button_secondary Body-3 button-animate-filter"
                    onClick={handleToggleSave}
                    style={{
                      backgroundColor: isSaved ? "black" : undefined,
                      color: isSaved ? "white" : undefined,
                    }}
                  >
                    {isSaved ? "Сохранено" : "Сохранить"}
                  </button>
                )}
              </>
            )
          ) : null}
        </div>

        {isSaveModalOpen && (
          <div style={{ position: "absolute" }}>
            <SaveSkillTreeModal
              onCancel={() => setIsSaveModalOpen(false)}
              onSaveSuccess={() => {
                setIsSaveModalOpen(false);
                setEditMode(false);
                setIsCreatingNewBranch(false); // сброс
              }}
              treeData={getTreeData()}
              title={branchId ? branchTitle : "Новая ветка"}
              branchId={branchId}
              imageUrl={branchId ? branchImageUrl : null}
            />
          </div>
        )}
        {isDeleteModalOpen && (
          <div style={{ position: "absolute" }}>
            <DeleteSkillTreeModal
              onCancel={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>{" "}
      {(!isMobile || isRightSidebarOpen) && (
        <div
          style={{
            width: isMobile ? "100%" : "35%",
            position: isMobile ? "absolute" : "relative",
            zIndex: 15,
            backgroundColor: "white",
            height: "100%",
            overflowY: "auto",
            borderLeft: isMobile ? "none" : "1px solid #CDCDCD",
          }}
        >
          <RightSidebar
            selectedNode={selectedNode}
            treeImage={branchImageUrl}
            branchTitle={branchTitle}
            branchId={branchId}
          />
        </div>
      )}
    </div>
  );
}

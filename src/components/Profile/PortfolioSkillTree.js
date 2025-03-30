import React from "react";
import {
  useGetMySkillTreesQuery,
  useGetSavedSkillTreesQuery,
} from "../../redux/services/skillTreeAPI";
import { Link } from "react-router-dom";
import { Avatar, Skeleton } from "@mui/material";
import { useMediaQuery } from "react-responsive";

export default function PortfolioSkillTree({ id }) {
  const { data: myTrees, isLoading: isMyLoading } = useGetMySkillTreesQuery(
    id,
    { skip: !id }
  );

  const { data: savedTrees, isLoading: isSavedLoading } =
    useGetSavedSkillTreesQuery(id, { skip: !id });

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const renderList = (items, loading) => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="circular"
          width={150}
          height={150}
          style={{ marginLeft: "16px", marginTop: "16px" }}
        />
      ));
    }
    if (!items?.data?.length) {
      return (
        <div className="Body-2" style={{ marginTop: "16px" }}>
          Нет веток
        </div>
      );
    }
    return items.data.map((branch) => {
      const { id, attributes } = branch;
      const url =
        attributes.image?.data?.[0]?.attributes?.formats?.medium?.url ||
        attributes.image?.data?.[0]?.attributes?.url ||
        "";
      return (
        <Link
          key={id}
          to={`/skill-tree/${id}`}
          style={{ textDecoration: "none" }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              margin: "8px",
              border: "1px solid #CDCDCD",
              cursor: "pointer",
            }}
            src={url}
            alt={attributes.title || "Без названия"}
          />
        </Link>
      );
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="h4">Мои ветки развития</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {renderList(myTrees, isMyLoading)}
      </div>

      <h2 className="h4" style={{ marginTop: 32 }}>
        Сохранённые ветки
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {renderList(savedTrees, isSavedLoading)}
      </div>
    </div>
  );
}

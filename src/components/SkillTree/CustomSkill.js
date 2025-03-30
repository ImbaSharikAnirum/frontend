import React from "react";
import { Handle } from "reactflow";

export default function CustomSkill({ data }) {
  // Цвет рамки зависит от статуса completed
  const borderColor = data.completed ? "orange" : "#777";

  return (
    <div
      style={{
        width: 100, // немного больше чем обычные узлы
        height: 100,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2px solid ${borderColor}`,
      }}
    >
      <img
        src={data.imageUrl}
        alt={data.label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: data.completed ? "none" : "grayscale(100%)",
        }}
      />

      {/* Левая ручка (target) */}
      <Handle
        type="target"
        position="left"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          background: borderColor,
        }}
      />

      {/* Правая ручка (source) */}
      <Handle
        type="source"
        position="right"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          background: borderColor,
        }}
      />
    </div>
  );
}

import React from "react";
import { Handle } from "reactflow";

export default function CustomNode({ data }) {
  // Цвет рамки в зависимости от статуса
  const borderColor = data.completed ? "orange" : "#777";

  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2px solid ${borderColor}`,
      }}
    >
      {/* Картинка */}
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
          background: `${borderColor}`,
        }}
      />

      {/* Правая ручка (source) */}
      <Handle
        type="source"
        position="right"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          background: `${borderColor}`,
        }}
      />
    </div>
  );
}

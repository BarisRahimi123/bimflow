"use client";

import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export function PipeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <>
      {/* Outer glow when selected */}
      {selected && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: "#818cf8",
            strokeWidth: 10,
            opacity: 0.3,
          }}
        />
      )}
      
      {/* Main pipe */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "#6366f1" : "#64748b",
          strokeWidth: 6,
          strokeLinecap: "round",
          transition: "stroke 0.15s ease",
          ...style,
        }}
        markerEnd={markerEnd}
      />
      
      {/* Inner highlight */}
      <BaseEdge
        id={`${id}-highlight`}
        path={edgePath}
        style={{
          stroke: selected ? "#a5b4fc" : "#94a3b8",
          strokeWidth: 2,
          strokeLinecap: "round",
          opacity: 0.5,
        }}
      />
    </>
  );
}

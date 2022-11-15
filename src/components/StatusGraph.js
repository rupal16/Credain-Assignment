import React from "react";
import "../App.css";

function StatusGraph(props) {
  const { title } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <li class={title === "Netting" ? "no-netting" : "active"}></li>
      <div className="status-head">{title}</div>
    </div>
  );
}

export default StatusGraph;

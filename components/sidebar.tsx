import React from "react";

const lineColors: { [key: string]: string } = {
  "1": "#0052A4",
  "2": "#009D3E",
  "3": "#EF7C1C",
  "4": "#00A5DE",
  "5": "#996CAC",
  "6": "#CD7C2F",
  "7": "#747F00",
  "8": "#E6186C"
};

const subwayLines = Object.keys(lineColors).map(line => ({
  name: `${line}호선`,
  color: lineColors[line] ,
  short: line
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSelectLine: (line: string) => void;
}

export default function Sidebar({ open, onClose, onSelectLine }: SidebarProps) {
  if (!open) return null;
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 270,
        height: "100vh",
        background: "#f7f9fb",
        zIndex: 1000,
        padding: 28,
        boxShadow: "2px 0 16px 0 rgba(0,0,0,0.07)",
        overflowY: "auto",
        fontFamily: "Pretendard, sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28
        }}
      >
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#222" }}>
          서울 지하철 노선
        </h3>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            background: "none",
            border: "none",
            fontSize: 28,
            cursor: "pointer",
            color: "#888",
            lineHeight: 1,
            padding: 0
          }}
        >
          &times;
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {subwayLines.map(line => (
          <li
            key={line.short}
            onClick={() => {
              onSelectLine(line.short);
              onClose();
            }}
            style={{
              cursor: "pointer",
              margin: "10px 0",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              padding: "8px 12px",
              transition: "background 0.15s",
              fontWeight: 500,
              fontSize: 16,
              userSelect: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#e6eef7")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: line.color,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                marginRight: 14,
                border: "2px solid #fff",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                textAlign: "center",
                lineHeight: 1
              }}
            >
              {line.short}
            </span>
            <span style={{ letterSpacing: 0.5 }}>{line.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
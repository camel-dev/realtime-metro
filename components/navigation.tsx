"use client"

interface NavigationProps {
  onSidebarToggle: () => void;
}
export default function Navigation({ onSidebarToggle }:NavigationProps) {
  return (
    <nav style={{ padding: 16, background: "#fff", borderBottom: "1px solid #eee", display: "flex", alignItems: "center" }}>
      <button
        onClick={onSidebarToggle}
        aria-label="노선 선택"
        style={{
          background: "#0052A4",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 18px 8px 44px",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
          marginRight: 16,
          transition: "background 0.2s"
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#003c7a")}
        onMouseOut={e => (e.currentTarget.style.background = "#0052A4")}
      >
        <span
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            display: "inline-block"
          }}
        >
          {/* 햄버거 아이콘 SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect y="3" width="18" height="2.5" rx="1.2" fill="#fff"/>
            <rect y="8" width="18" height="2.5" rx="1.2" fill="#fff"/>
            <rect y="13" width="18" height="2.5" rx="1.2" fill="#fff"/>
          </svg>
        </span>
        노선 선택
      </button>
      {/* ...다른 네비게이션 요소들... */}
    </nav>
  );
}
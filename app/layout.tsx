"use client";

import React, { useState } from "react";
import Navigation from "../components/navigation";
import Sidebar from "../components/sidebar";
import SubwayMap from "../components/SubwayMap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState("1"); // 여기 "2" → "1"로 변경

  return (
    <html lang="en">
      <body style={{ margin: 0, overflow: "hidden" }}>
        {/* 네비게이션을 fixed로 */}
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 100,
          height: 56,
          background: "#fff"
        }}>
          <Navigation onSidebarToggle={() => setSidebarOpen(true)} />
        </div>
        {/* 사이드바 */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectLine={line => {
            setSelectedLine(line);
          }}
        />
        {/* SubwayMap 영역에 paddingTop */}
        <div
          style={{
            transition: "padding-left 0.3s",
            paddingLeft: sidebarOpen ? 250 + 20 * 2 : 0,
            minHeight: "100dvh",
            boxSizing: "border-box",
            background: "#f5f6fa",
            paddingTop: 56 // 네비게이션 높이만큼
          }}
        >
          <SubwayMap selectedLine={selectedLine} />
        </div>
      </body>
    </html>
  );
}

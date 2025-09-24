import React from "react";

export default function Navbar({ onNavigate, current }) {
  return (
    <header>
      <div className="brand">
        <div className="logo">J</div>
        <div>
          <div style={{ fontWeight: "bold" }}>Secure Journal</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            Private & Empathetic
          </div>
        </div>
      </div>

      <nav>
        <button
          className={current === "chat" ? "active" : ""}
          onClick={() => onNavigate("chat")}
        >
          Chat
        </button>
        <button
          className={current === "insights" ? "active" : ""}
          onClick={() => onNavigate("insights")}
        >
          Insights
        </button>
        <button
          className={current === "reports" ? "active" : ""}
          onClick={() => onNavigate("reports")}
        >
          Reports
        </button>
        <button
          className={current === "resources" ? "active" : ""}
          onClick={() => onNavigate("resources")}
        >
          Resources
        </button>

        <span className="right-buttons">
          <button onClick={() => alert("Onboarding")}>Onboard</button>
          <button onClick={() => alert("Export")}>Export</button>
        </span>
      </nav>
    </header>
  );
}

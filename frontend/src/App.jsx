import React, { useState } from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const [view, setView] = useState("chat");

  return (
    <div>
      <Navbar current={view} onNavigate={setView} />
      <div style={{ padding: "20px" }}>
        <h1>Current view: {view}</h1>
      </div>
    </div>
  );
}

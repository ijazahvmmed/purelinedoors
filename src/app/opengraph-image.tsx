import { ImageResponse } from "next/og";
export const alt = "Pureline — Considered doors. Welcoming spaces.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraph() {
  return new ImageResponse(
    <div
      style={{
        background: "#214b34",
        color: "#f6f5f1",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px 85px",
      }}
    >
      <div style={{ fontSize: 30, letterSpacing: 10 }}>PURELINE</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          lineHeight: 1.1,
        }}
      >
        <span>A considered entrance.</span>
        <span>A lasting impression.</span>
      </div>
      <div style={{ fontSize: 19, color: "#c2cfb4" }}>
        GRP & composite doors · United Kingdom
      </div>
    </div>,
    size,
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
        }}
      >
        <div
          style={{
            fontSize: 96,
            color: "#C9A96E",
            fontWeight: 600,
            letterSpacing: 4,
          }}
        >
          RAAH PRODUCTION
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#E8D5B0",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Live Music &amp; Events
        </div>
      </div>
    ),
    { ...size }
  );
}

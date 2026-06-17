import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const RAYS = ["#1b75bc", "#f7941e", "#ec008c", "#ffd200", "#8dc63f"];

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "#0e0c2c",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {RAYS.map((c) => (
            <div
              key={c}
              style={{ width: 12, height: 54, background: c, borderRadius: 6 }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 800,
            color: "#f5f4ff",
            letterSpacing: -2,
          }}
        >
          USF&apos;26
        </div>
      </div>
    ),
    { ...size },
  );
}

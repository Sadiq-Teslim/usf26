import { ImageResponse } from "next/og";

export const alt = "USF'26 — ULES Sport Festival 2026 · All or Nothing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RAYS = ["#1b75bc", "#f7941e", "#ec008c", "#ffd200", "#8dc63f", "#2ec4b6"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          justifyContent: "space-between",
          background:
            "radial-gradient(900px 500px at 15% -10%, #2e2a8c 0%, transparent 60%), radial-gradient(800px 480px at 110% 0%, #ec008c33 0%, transparent 55%), #0e0c2c",
          color: "#f5f4ff",
        }}
      >
        {/* rainbow bars */}
        <div style={{ display: "flex", gap: 10 }}>
          {RAYS.map((c) => (
            <div
              key={c}
              style={{ width: 26, height: 14, background: c, borderRadius: 7 }}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
            }}
          >
            USF&apos;26
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 700,
              color: "#d9d6ff",
              letterSpacing: -1,
            }}
          >
            ULES SPORT FESTIVAL 2026
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontStyle: "italic",
              color: "#ffd200",
            }}
          >
            ...all or nothing...
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#aba8d8",
            }}
          >
            Fixtures · Results · Standings
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

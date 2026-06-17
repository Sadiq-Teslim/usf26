import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const RAYS = ["#1b75bc", "#f7941e", "#ec008c", "#ffd200", "#8dc63f"];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "#0e0c2c",
          borderRadius: 7,
        }}
      >
        {RAYS.map((c) => (
          <div
            key={c}
            style={{ width: 3, height: 17, background: c, borderRadius: 2 }}
          />
        ))}
      </div>
    ),
    { ...size },
  );
}

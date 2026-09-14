import { ImageResponse } from "next/og";

export const alt = "LOCALY — Discover Beauty like a local";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#faf6ee",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            backgroundColor: "#f4dde5",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 100,
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "#c23a63",
            opacity: 0.25,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 6,
              color: "#c23a63",
            }}
          >
            BEAUTY IN SEOUL
          </span>
          <span
            style={{
              marginTop: 24,
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#9c2c4d",
            }}
          >
            LOCALY
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 30,
              color: "#221c17",
            }}
          >
            서울에서 만나는 나만의 빛나는 하루
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

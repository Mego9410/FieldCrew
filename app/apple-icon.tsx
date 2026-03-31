import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(120% 120% at 20% 10%, #FDBA74 0%, #F59E0B 35%, #0F172A 100%)",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 36,
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 10px 40px rgba(2, 6, 23, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          FC
        </div>
      </div>
    ),
    size,
  );
}


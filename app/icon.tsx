import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            width: 420,
            height: 420,
            borderRadius: 96,
            background: "rgba(15, 23, 42, 0.78)",
            border: "2px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 20px 70px rgba(2, 6, 23, 0.65)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: 168,
              letterSpacing: -10,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            FC
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 28,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.9,
              fontWeight: 700,
            }}
          >
            FieldCrew
          </div>
        </div>
      </div>
    ),
    size,
  );
}


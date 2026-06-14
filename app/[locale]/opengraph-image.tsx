import { ImageResponse } from "next/og";
import { readLocale } from "@/lib/locale";

export const alt = "U.D. Santiso F.C.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        alignItems: "center",
        padding: "70px",
        overflow: "hidden",
        background: "#10110f",
        color: "#f2efe6",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          right: "-150px",
          top: "-10px",
          borderRadius: "50%",
          background: "#f4cd22",
          opacity: 0.95,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
        <span
          style={{
            color: "#f4cd22",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "7px",
          }}
        >
          U.D. SANTISO F.C.
        </span>
        <strong
          style={{
            maxWidth: "760px",
            marginTop: "34px",
            fontSize: "110px",
            lineHeight: 0.88,
            letterSpacing: "-6px",
            textTransform: "uppercase",
          }}
        >
          {locale === "gl" ? "Somos de aquí." : "Somos de aquí."}
        </strong>
        <span
          style={{
            marginTop: "38px",
            color: "#aaa99f",
            fontSize: "24px",
          }}
        >
          {locale === "gl"
            ? "Fútbol, comunidade e orgullo."
            : "Fútbol, comunidad y orgullo."}
        </span>
      </div>
      <strong
        style={{
          position: "absolute",
          right: "58px",
          color: "#10110f",
          fontSize: "390px",
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        S
      </strong>
    </div>,
    size,
  );
}

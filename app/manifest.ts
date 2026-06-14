import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "U.D. Santiso F.C.",
    short_name: "UD Santiso",
    description:
      "Sitio oficial da U.D. Santiso F.C. Partidos, equipos, novas e tenda.",
    start_url: "/gl",
    display: "standalone",
    background_color: "#10110f",
    theme_color: "#f4cd22",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Northline Construction & Development",
    short_name: "NORTHLINE",
    description: "Building exceptional spaces through precision, craftsmanship, and uncompromising standards.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2ed",
    theme_color: "#101010",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

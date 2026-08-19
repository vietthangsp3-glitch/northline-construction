import { ImageResponse } from "next/og";

export const alt = "NORTHLINE - We Build What's Next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px 64px", background: "#101010", color: "#f4f2ed", fontFamily: "Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-100px", top: "-190px", width: "720px", height: "900px", display: "flex", border: "1px solid #55534e", transform: "rotate(18deg)" }} />
      <div style={{ position: "absolute", right: "180px", top: "-120px", width: "1px", height: "900px", display: "flex", background: "#55534e", transform: "rotate(18deg)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24, fontWeight: 700, letterSpacing: "0.18em" }}><span>NORTHLINE</span><span style={{ width: 12, height: 12, display: "flex", background: "#e6602b" }} /></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.82, textTransform: "uppercase" }}><span>We Build</span><span style={{ color: "#a9a79f" }}>What&apos;s Next.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #55534e", paddingTop: 20, color: "#a9a79f", fontSize: 18 }}><span>Construction &amp; Development</span><span>New York / Building Nationwide</span></div>
    </div>,
    size,
  );
}

import { NextResponse } from "next/server";

function esc(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = esc(searchParams.get("title") || "La taniere du code");
  const chapter = esc(searchParams.get("chapter") || "Cours NSI/SNT");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#fff7ed" />
        <stop offset="100%" stop-color="#ffedd5" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)" />
    <text x="80" y="160" fill="#ea580c" font-size="34" font-family="Arial, sans-serif" font-weight="700">${chapter}</text>
    <text x="80" y="260" fill="#0f172a" font-size="68" font-family="Arial, sans-serif" font-weight="800">${title}</text>
    <text x="80" y="540" fill="#334155" font-size="30" font-family="Arial, sans-serif">La taniere du code - Clement Braun</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}


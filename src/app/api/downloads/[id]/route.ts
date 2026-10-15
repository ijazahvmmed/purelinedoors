import { NextResponse } from "next/server";
import { fetchCmsDownloads } from "@/sanity/content";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const downloads = await fetchCmsDownloads();
  const file = downloads?.find((d) => d.id === id);
  if (!file)
    return NextResponse.json(
      { error: "This document is not available." },
      { status: 404 },
    );
  const url = new URL(file.url);
  if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io")
    return NextResponse.json(
      { error: "Document location requires review." },
      { status: 503 },
    );
  return NextResponse.redirect(url, 307);
}

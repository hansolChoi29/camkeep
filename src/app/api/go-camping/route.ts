import { fetchCampingList } from "@/lib/camping";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNo = Number(searchParams.get("pageNo")) || 1;

  try {
    const items = await fetchCampingList(pageNo, 20);
    console.log(
      "▶▶ fetchCampingList 결과(items):",
      JSON.stringify(items, null, 2)
    );
    return NextResponse.json(items, {
      status: 200,
      headers: {
        // 브라우저·CDN·서버(Edge)를 모두 10분(600초) 동안 캐싱
        "Cache-Control":
          "public, max-age=600, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

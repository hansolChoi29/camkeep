// src/app/api/shop/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("> NAVER_CLIENT_ID:", process.env.NAVER_CLIENT_ID);
    console.log("> NAVER_CLIENT_SECRET:", process.env.NAVER_CLIENT_SECRET);

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? "캠핑용품";
    const display = searchParams.get("display") ?? "30";
    const start = searchParams.get("start") ?? "1";

    const res = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
        query
      )}&display=${display}&start=${start}`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );

    const text = await res.text();
    console.log("▶️ Naver status:", res.status, "body:", text);

    if (!res.ok) {
      return NextResponse.json(
        { error: `네이버 API 에러: ${res.status}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("🔥 Route handler exception:", e);
    return NextResponse.json(
      { error: `서버 오류: ${e.message}` },
      { status: 500 }
    );
  }
}

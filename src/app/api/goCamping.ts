// src/app/api/shop/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = encodeURIComponent(searchParams.get("query") ?? "캠핑용품");
  const display = searchParams.get("display") ?? "100";
  const start = searchParams.get("start") ?? "1";

  const res = await fetch(
    `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=${display}&start=${start}`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: `네이버 API 에러: ${res.status}` },
      { status: 500 }
    );
  }
  return NextResponse.json(JSON.parse(text));
}

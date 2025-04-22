import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "캠핑용품";
  const display = searchParams.get("display") ?? "30";
  const start = searchParams.get("start") ?? "1";

  try {
    const res = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
        query
      )}&display=${display}&start=${start}`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
        // 1분간 캐시해서 속도 제한 대응
        next: { revalidate: 60 },
      }
    );

    const text = await res.text();
    const json = JSON.parse(text);

    // Naver 측 에러코드가 내려오면 빈 배열로 퉁치기
    if (!res.ok || json.errorCode) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json(json, { status: 200 });
  } catch {
    // 네트워크 오류에도 빈 배열 응답
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

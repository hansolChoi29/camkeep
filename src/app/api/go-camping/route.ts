// import { fetchCampingList } from "@/lib/camping";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const pageNo = Number(new URL(request.url).searchParams.get("pageNo")) || 1;
//   try {
//     const items = await fetchCampingList(pageNo, 20);
//     console.log("🟢 /api/go-camping items.length =", items.length);
//     return NextResponse.json(items, { status: 200 });
//   } catch (err) {
//     console.error("🛑 /api/go-camping 실패:", err);
//     return NextResponse.json([], { status: 200 });
//   }
// }
// //
import { fetchCampingList } from "@/lib/camping";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? "";

  console.log("region", region);

  const pageNo = Number(searchParams.get("pageNo")) || 1;
  try {
    const items = await fetchCampingList(pageNo, 20);
    return NextResponse.json(items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

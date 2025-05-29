import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await req.json();

  if (!user || !user.id || !user.email) {
    return NextResponse.json(
      { success: false, error: "잘못된 사용자 데이터" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("users").upsert(
    {
      id: user.id,
      email: user.email,
      nickname:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email.split("@")[0],
      phone: user.user_metadata?.phone_number ?? null,
      profile: user.user_metadata?.avatar_url ?? null,
      points: 0,
    },
    { onConflict: "id" } // 또는 "email", 테이블에 따라
  );

  if (error) {
    console.error("❌ users 업서트 실패:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

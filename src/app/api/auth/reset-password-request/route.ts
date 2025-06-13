import { randomInt } from "crypto";
import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();
    if (!email || !phone) {
      return NextResponse.json(
        { error: "이메일과 전화번호는 필수입니다. 다시 입력해 주세요." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const sanitizedPhone = phone.replace(/-/g, "");

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, name, phone")
      .eq("email", email)
      .or(`phone.eq.${sanitizedPhone},phone.ilike.%${phone}`)
      .single();

    if (findError || !user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다. 다시 시도해 주세요." },
        { status: 404 }
      );
    }

    // OTP 생성
    const otp = randomInt(100000, 1000000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const expiresAtISO = expiresAt.toISOString();

    const { error: insertError } = await supabase.from("OTP").insert({
      user_id: user.id,
      otp,
      expires_at: expiresAtISO,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "OTP 저장에 실패했습니다. 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        otp,
        name: user.name,
        message: "OTP가 성공적으로 발급되었습니다.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

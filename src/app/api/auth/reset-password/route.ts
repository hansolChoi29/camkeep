import { createClient } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// OTP 검증 + 비밀번호 변경 전용
export async function POST(request: Request) {
  try {
    const { otp, newPassword } = await request.json();

    if (!otp || !newPassword) {
      return NextResponse.json(
        { error: "OTP와 새비밀번호는 필수입니다. 다시 입력해 주세요." },
        { status: 400 }
      );
    }

    // 1) OTP 조회 (anon 키로 OK)
    const supabase = createClient();
    const { data: resetRequest, error: otpError } = await supabase
      .from("OTP")
      .select("user_id, expires_at, used")
      .eq("otp", otp)
      .single();

    if (otpError || !resetRequest) {
      return NextResponse.json(
        { error: "유효하지 않은 OTP입니다." },
        { status: 404 }
      );
    }
    if (resetRequest.used || new Date(resetRequest.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "만료되었거나 이미 사용된 OTP입니다." },
        { status: 400 }
      );
    }

    // 2) 비밀번호 업데이트 (service role 키 필요)
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(resetRequest.user_id, {
        password: newPassword,
      });
    if (updateError) {
      console.error("updateUserById error:", updateError);
      return NextResponse.json(
        { error: "비밀번호 변경에 실패했습니다. 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    // 3) OTP 사용 처리(Optional)
    await supabase.from("OTP").update({ used: true }).eq("otp", otp);

    return NextResponse.json(
      { message: "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요." },
      { status: 200 }
    );
  } catch (err) {
    console.error("reset-password catch:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

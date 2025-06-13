import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "이름과 휴대폰번호는 필수입니다." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("name", name)
      .eq("phone", phone)
      .single();
    if (error || !data) {
      return NextResponse.json({
        error:
          "입력한 정보와 일치하는 일치하는 이메일을 찾을 수 없습니다. 다시 입력해 주세요.",
      });
    }
    return NextResponse.json({ email: data.email }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

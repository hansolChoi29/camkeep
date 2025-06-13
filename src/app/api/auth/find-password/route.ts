import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: "이메일과 휴대폰번호는 필수입니다. 다시 입력해 주세요." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("email", email)
      .eq("phone", phone)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error:
            "입력한 정보와 일치하는 계정을 찾을 수 없습니다. 다시 입력해 주세요.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { userId: data.id, userName: data.name },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후에 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

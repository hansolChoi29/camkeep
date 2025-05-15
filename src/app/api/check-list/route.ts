import { serverSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 카테고리 목록 조회
export async function GET(req: NextRequest) {
  const supabase = serverSupabase();

  // 인증된 사용자 정보 가져오기
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  //  유저별 카테고리 조회
  if (categoryId) {
    // 해당 카테고리의 아이템만 조회
    const { data, error } = await supabase
      .from("checklist_items")
      .select("id, title, description, is_checked")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } else {
    // 모든 카테고리 조회
    const { data, error } = await supabase
      .from("checklist_categories")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }
}

// 생성
export async function POST(req: NextRequest) {
  const supabase = serverSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, payload } = await req.json();
  if (type === "category") {
    const { title } = payload;
    const { data, error } = await supabase
      .from("checklist_categories")
      .insert({ user_id: user.id, title })
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } else if (type === "item") {
    const { category_id, title, description } = payload;
    const { data, error } = await supabase
      .from("checklist_items")
      .insert({ category_id, title, description: description ?? null })
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

// 수정
export async function PATCH(req: NextRequest) {
  const supabase = serverSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { type, id, fields } = await req.json();

  if (type === "category") {
    const { title } = fields;
    const { error } = await supabase
      .from("checklist_categories")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } else if (type === "item") {
    const { title, description, is_checked } = fields;
    const { error } = await supabase
      .from("checklist_items")
      .update({
        title,
        description: description ?? null,
        is_checked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}
// 삭제
export async function DELETE(req: NextRequest) {
  const supabase = serverSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { type, id } = await req.json();

  if (type === "category") {
    const { error } = await supabase
      .from("checklist_categories")
      .delete()
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } else if (type === "item") {
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

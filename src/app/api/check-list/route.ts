import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
//withAuth 공통: 인증된 supabase 클라이언트 + user 객체 얻기
async function withAuth(req: NextRequest) {
  const supabase = serverSupabase();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return {
      supabase,
      user: null,
      unauthorized: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { supabase, user, unauthorized: null };
  console.log("req", req);
}
//GET 사용자 인증 확인 후, 전체 카테고리 또는 특정 카테고리의 아이템 목록 반환
export async function GET(req: NextRequest) {
  const { supabase, user, unauthorized } = await withAuth(req);
  if (unauthorized) return unauthorized;

  const userId = user.id;
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  if (categoryId) {
    // 특정 카테고리의 아이템 조회
    const { data, error } = await supabase
      .from("checklist_items")
      .select("id, title, description, is_checked")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("GET items error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } else {
    // 사용자의 카테고리 목록 조회
    const { data, error } = await supabase
      .from("checklist_categories")
      .select("id, title")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("GET categories error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  }
}

//POST type에 따라 카테고리 또는 아이템 생성
export async function POST(req: NextRequest) {
  const { supabase, user, unauthorized } = await withAuth(req);
  if (unauthorized) return unauthorized;

  //요청 본문 파싱 (한 번만)
  const { type, payload } = await req.json();
  console.log("POST body →", { type, payload });
  //카테고리 생성
  if (type === "category") {
    console.log("▶ insert category:", payload.title);
    const { data, error } = await supabase
      .from("checklist_categories")
      .insert({ user_id: user.id, title: payload.title })
      .select("id, title")
      .single();

    console.log("insert category result →", { data, error });
    if (error) {
      console.error("Insert category failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  }
  //아이템 생성
  if (type === "item") {
    console.log("▶ insert item into category", payload.category_id);
    const { data, error } = await supabase
      .from("checklist_items")
      .insert({
        category_id: payload.category_id,
        title: payload.title,
        description: payload.description ?? null,
        is_checked: false,
      })
      .select("id, title, description, is_checked")
      .single();

    console.log("insert item result →", { data, error });
    if (error) {
      console.error("Insert item failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  }

  console.warn("POST /api/check-list invalid type:", type);
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

//PATCH type에 따라 카테고리 또는 아이템 수정
export async function PATCH(req: NextRequest) {
  const { supabase, unauthorized } = await withAuth(req);
  if (unauthorized) return unauthorized;

  const { type, id, fields } = await req.json();
  //카테고리 제목 수정
  if (type === "category") {
    console.log("▶ update category", id, "→", fields.title);
    const { error } = await supabase
      .from("checklist_categories")
      .update({ title: fields.title })
      .eq("id", id);

    if (error) {
      console.error("Update category failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }
  //아이템 속성 수정
  if (type === "item") {
    console.log("▶ update item", id, "→", fields);
    const { error } = await supabase
      .from("checklist_items")
      .update(fields)
      .eq("id", id);

    if (error) {
      console.error("Update item failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  console.warn("PATCH /api/check-list invalid type:", type);
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

//DELETE type에 따라 카테고리 또는 아이템 삭제
export async function DELETE(req: NextRequest) {
  const { supabase, unauthorized } = await withAuth(req);
  if (unauthorized) return unauthorized;

  const { type, id } = await req.json();
  // 카테고리 삭제
  if (type === "category") {
    console.log("▶ delete category", id);
    const { error } = await supabase
      .from("checklist_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete category failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }
  //아이템 삭제
  if (type === "item") {
    console.log("▶ delete item", id);
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete item failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  console.warn("DELETE /api/check-list invalid type:", type);
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

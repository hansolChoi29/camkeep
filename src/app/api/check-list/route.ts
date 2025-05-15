import { serverSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 공용 인증 권한 로직
async function withAuth(req: NextRequest) {
  const supabase = serverSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      supabase,
      user: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { supabase, user, errorResponse: null };
}

// 카테고리 목록 조회
export async function GET(req: NextRequest) {
  const { supabase, user, errorResponse } = await withAuth(req);
  if (errorResponse) return errorResponse;

  const categoryId = req.nextUrl.searchParams.get("categoryId");
  if (categoryId) {
    // 소유 확인
    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", categoryId)
      .single();
    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // 아이템 조회
    const { data, error } = await supabase
      .from("checklist_items")
      .select("id, title, description, is_checked")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: true });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    // 카테고리 조회
    const { data, error } = await supabase
      .from("checklist_categories")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }
}

// 생성
export async function POST(req: NextRequest) {
  const { supabase, user, errorResponse } = await withAuth(req);
  if (errorResponse) return errorResponse;

  const { type, payload } = await req.json();
  if (type === "category") {
    const { data, error } = await supabase
      .from("checklist_categories")
      .insert({ user_id: user.id, title: payload.title })
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
  if (type === "item") {
    // 부모 카테고리 소유 확인
    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", payload.category_id)
      .single();
    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("checklist_items")
      .insert({
        category_id: payload.category_id,
        title: payload.title,
        description: payload.description ?? null,
        is_checked: false,
      })
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// 수정
export async function PATCH(req: NextRequest) {
  const { supabase, user, errorResponse } = await withAuth(req);

  if (errorResponse) return errorResponse;

  const { type, id, fields } = await req.json();

  if (type === "category") {
    // 소유 확인
    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("checklist_categories")
      .update({ title: fields.title })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (type === "item") {
    // 소유 확인
    const { data: item } = await supabase
      .from("checklist_items")
      .select("category_id")
      .eq("id", id)
      .single();

    if (!item?.category_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", item.category_id)
      .single();

    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("checklist_items")
      .update({
        title: fields.title,
        description: fields.description ?? null,
        is_checked: fields.is_checked,
      })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
// 삭제
export async function DELETE(req: NextRequest) {
  const { supabase, user, errorResponse } = await withAuth(req);

  if (errorResponse) return errorResponse;

  const { type, id } = await req.json();
  if (type === "category") {
    // 소유 확인
    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("checklist_categories")
      .delete()
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  if (type === "item") {
    // 소유 확인
    const { data: item } = await supabase
      .from("checklist_items")
      .select("category_id")
      .eq("id", id)
      .single();

    if (!item?.category_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data: cat } = await supabase
      .from("checklist_categories")
      .select("user_id")
      .eq("id", item.category_id)
      .single();

    if (!cat || cat.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

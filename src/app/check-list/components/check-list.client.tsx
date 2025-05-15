"use client";
import { SimpleToast } from "@/components/SimpleToast";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { motion } from "framer-motion";
export interface Category {
  id: string;
  title: string;
}
export interface Item {
  id: string;
  title: string;
  description: string | null;
  is_checked: boolean;
}

export default function CheckListClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // 새 추가용
  const [newCat, setNewCat] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // 수정 상태
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatTitle, setEditCatTitle] = useState("");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDesc, setEditItemDesc] = useState("");

  // 토스트 알림
  const [toast, setToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 카테고리 로드
  useEffect(() => {
    fetch("/api/check-list")
      .then((r) => r.json())
      .then((js) => setCategories(js.data));
  }, []);

  // 아이템 로드
  useEffect(() => {
    if (!selectedId) {
      setItems([]);
      return;
    }
    fetch(`/api/check-list?categoryId=${selectedId}`)
      .then((r) => r.json())
      .then((js) => setItems(js.data));
  }, [selectedId]);

  // 카테고리 추가
  const addCategory = async () => {
    if (!newCat.trim()) return;
    await fetch("/api/check-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "category",
        payload: { title: newCat.trim() },
      }),
    });
    setNewCat("");
    const { data } = await (await fetch("/api/check-list")).json();
    setCategories(data);
    setToast("카테고리 추가 완료!");
  };

  // 카테고리 삭제
  const deleteCategory = async (id: string) => {
    await fetch("/api/check-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", id }),
    });
    if (selectedId === id) setSelectedId(null);
    const { data } = await (await fetch("/api/check-list")).json();
    setCategories(data);
    setToast("카테고리 삭제 완료!");
  };

  // 카테고리 수정 저장
  const saveCategory = async (id: string) => {
    if (!editCatTitle.trim()) return;
    await fetch("/api/check-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "category",
        id,
        fields: { title: editCatTitle.trim() },
      }),
    });
    setEditCatId(null);
    const { data } = await (await fetch("/api/check-list")).json();
    setCategories(data);
    setToast("카테고리 수정 완료!");
  };

  // 아이템 추가
  const addItem = async () => {
    if (!selectedId || !newTitle.trim()) return;
    await fetch("/api/check-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        payload: {
          category_id: selectedId,
          title: newTitle.trim(),
          description: newDesc.trim(),
        },
      }),
    });
    setNewTitle("");
    setNewDesc("");
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${selectedId}`)
    ).json();
    setItems(data);
    setToast("아이템 추가 완료!");
  };

  // 아이템 삭제
  const deleteItem = async (id: string) => {
    await fetch("/api/check-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "item", id }),
    });
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${selectedId}`)
    ).json();
    setItems(data);
    setToast("아이템 삭제 완료!");
  };

  //아이템 수정 저장
  const saveItem = async (id: string) => {
    await fetch("/api/check-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        id,
        fields: {
          title: editItemTitle.trim(),
          description: editItemDesc.trim(),
        },
      }),
    });
    setEditItemId(null);
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${selectedId}`)
    ).json();
    setItems(data);
    setToast("아이템 수정 완료!");
  };

  //체크박스 토글
  const toggleItem = async (id: string, checked: boolean) => {
    await fetch("/api/check-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        id,
        fields: { is_checked: !checked },
      }),
    });
    setItems(
      items.map((i) => (i.id === id ? { ...i, is_checked: !checked } : i))
    );
  };

  // 이미지 저장 함수
  const downloadAsImage = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
      scale: 2,
      backgroundColor: "#fff",
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "checklist.png";
    link.click();
  };

  return (
    <section className="p-4">
      {/* 주의: 캡처 대상 전체 래퍼 */}
      <div ref={containerRef}>
        <div className="mb-4 flex gap-2">
          <input
            className="border p-1 flex-1"
            placeholder="새 카테고리"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="bg-[#578E7E] rounded text-white px-3 text-sm"
          >
            추가
          </button>
        </div>
        <div className="flex justify-end">
          <motion.button
            onClick={downloadAsImage}
            className="overflow-hidden leading-none focus:outline-none my-2 "
            style={{
              transformOrigin: "center center",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/images/check-download.svg"
              alt="다운로드"
              width={30}
              height={30}
              className="block"
            />
          </motion.button>
        </div>
        <div className="flex gap-4">
          {/* -- 카테고리 리스트 -- */}
          <ul className="w-1/3 border p-2 space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                {editCatId === c.id ? (
                  <>
                    <input
                      className="border p-1 flex-1"
                      value={editCatTitle}
                      onChange={(e) => setEditCatTitle(e.target.value)}
                    />
                    <button onClick={() => saveCategory(c.id)}>저장</button>
                    <button onClick={() => setEditCatId(null)}>취소</button>
                  </>
                ) : (
                  <>
                    <span
                      className={`cursor-pointer ${
                        c.id === selectedId ? "text-red-500" : ""
                      }`}
                      onClick={() => setSelectedId(c.id)}
                    >
                      {c.title}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditCatId(c.id);
                          setEditCatTitle(c.title);
                        }}
                      >
                        수정
                      </button>
                      <button onClick={() => deleteCategory(c.id)}>삭제</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {selectedId && (
            <div className="w-2/3">
              {/* 아이템 추가 */}
              <div className="mb-4 flex gap-2">
                <input
                  className="border p-1 flex-1"
                  placeholder="새 아이템"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                  className="border p-1 flex-1"
                  placeholder="설명 (선택)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                <button
                  onClick={addItem}
                  className="bg-[#578E7E] text-sm rounded text-white px-3"
                >
                  추가
                </button>
              </div>

              <ul className="space-y-2">
                {items.map((i) => (
                  <li key={i.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={i.is_checked}
                      onChange={() => toggleItem(i.id, i.is_checked)}
                    />
                    {editItemId === i.id ? (
                      <div className="flex-1 space-y-1">
                        <input
                          className="border p-1 w-full"
                          value={editItemTitle}
                          onChange={(e) => setEditItemTitle(e.target.value)}
                        />
                        <input
                          className="border p-1 w-full"
                          value={editItemDesc || ""}
                          onChange={(e) => setEditItemDesc(e.target.value)}
                        />
                        <button onClick={() => saveItem(i.id)}>저장</button>
                        <button onClick={() => setEditItemId(null)}>
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className={i.is_checked ? "line-through" : ""}>
                            {i.title}
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditItemId(i.id);
                                setEditItemTitle(i.title);
                                setEditItemDesc(i.description || "");
                              }}
                            >
                              수정
                            </button>
                            <button onClick={() => deleteItem(i.id)}>
                              삭제
                            </button>
                          </div>
                        </div>
                        {i.description && (
                          <small className="text-gray-500">
                            {i.description}
                          </small>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 주의: 이미지 저장 버튼 (캡처 대상 밖) */}

      {toast && (
        <SimpleToast
          message={toast}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

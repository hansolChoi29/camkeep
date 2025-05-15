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
  // 카테고리별 아이템 맵
  const [itemsByCat, setItemsByCat] = useState<Record<string, Item[]>>({});
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
    if (categories.length === 0) return;
    (async () => {
      const map: Record<string, Item[]> = {};
      await Promise.all(
        categories.map(async (c) => {
          const res = await fetch(`/api/check-list?categoryId=${c.id}`);
          const { data } = await res.json();
          map[c.id] = data;
        })
      );
      setItemsByCat(map);
    })();
  }, [categories]);

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
    <section className="m-4">
      <h2 className="text-3xl mt-10 main">나만의 체크리스트</h2>
      <div className="flex justify-end ">
        <motion.button
          onClick={downloadAsImage}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src="/images/check-download.svg"
            alt="다운로드"
            width={30}
            height={30}
          />
        </motion.button>
      </div>

      {/* 전체 캡처 영역 */}
      <div ref={containerRef} className="mt-6 space-y-8 border p-4">
        {/* 새 카테고리 추가 UI */}
        <div className="flex gap-2">
          <input
            className="border p-1 flex-1"
            placeholder="새 카테고리"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="bg-[#578E7E] text-white px-3 rounded"
          >
            추가
          </button>
        </div>

        {/* 모든 카테고리 + 아이템 렌더링 */}
        {categories.map((cat) => (
          <div key={cat.id} className="border p-4 rounded">
            {/* 카테고리 헤더 */}
            <div className="flex items-center justify-between mb-3">
              {editCatId === cat.id ? (
                <>
                  <input
                    className="border p-1 flex-1"
                    value={editCatTitle}
                    onChange={(e) => setEditCatTitle(e.target.value)}
                  />
                  <button onClick={() => saveCategory(cat.id)}>
                    <Image
                      src="/images/check.svg"
                      alt="check"
                      width={25}
                      height={25}
                    />
                  </button>
                  <button onClick={() => setEditCatId(null)}>
                    <Image
                      src="/images/delete.svg"
                      alt="delete"
                      width={16}
                      height={16}
                    />
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{cat.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditCatId(cat.id);
                        setEditCatTitle(cat.title);
                      }}
                    >
                      <Image
                        src="/images/update.png"
                        alt="update"
                        width={16}
                        height={16}
                      />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)}>
                      <Image
                        src="/images/delete.svg"
                        alt="delete"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 새 아이템 추가 */}
            <div className="flex gap-2 mb-4">
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
                className="bg-[#578E7E] text-white px-3 rounded"
              >
                추가
              </button>
            </div>

            {/* 아이템 리스트 */}
            <ul className="space-y-2">
              {(itemsByCat[cat.id] || []).map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={item.is_checked}
                    onChange={() => toggleItem(item.id, item.is_checked)}
                  />

                  {editItemId === item.id ? (
                    <div className="flex-1 space-y-1">
                      <input
                        className="border p-1 w-full"
                        value={editItemTitle}
                        onChange={(e) => setEditItemTitle(e.target.value)}
                      />
                      <input
                        className="border p-1 w-full"
                        value={editItemDesc}
                        onChange={(e) => setEditItemDesc(e.target.value)}
                      />
                      <button onClick={() => saveItem(item.id)}>
                        <Image
                          src="/images/check.svg"
                          alt="check"
                          width={25}
                          height={25}
                        />
                      </button>
                      <button onClick={() => setEditItemId(null)}>
                        <Image
                          src="/images/delete.svg"
                          alt="delete"
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={item.is_checked ? "line-through" : ""}>
                          {item.title}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditItemId(item.id);
                              setEditItemTitle(item.title);
                              setEditItemDesc(item.description || "");
                            }}
                          >
                            <Image
                              src="/images/update.png"
                              alt="update"
                              width={16}
                              height={16}
                            />
                          </button>
                          <button onClick={() => deleteItem(item.id)}>
                            <Image
                              src="/images/delete.svg"
                              alt="delete"
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <small className="text-gray-500">
                          {item.description}
                        </small>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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

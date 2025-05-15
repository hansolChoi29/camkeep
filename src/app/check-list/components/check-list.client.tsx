"use client";
import { useEffect, useState } from "react";

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
  const [newCat, setNewCat] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // 1) 카테고리 로드
  useEffect(() => {
    fetch("/api/check-list")
      .then((r) => r.json())
      .then((js) => setCategories(js.data));
  }, []);
  // 2) 아이템 로드
  useEffect(() => {
    if (!selectedId) return setItems([]);
    fetch(`/api/check-list?categoryId=${selectedId}`)
      .then((r) => r.json())
      .then((js) => setItems(js.data));
  }, [selectedId]);

  // 3) 카테고리 추가
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
  };

  // 4) 카테고리 삭제
  const deleteCategory = async (id: string) => {
    await fetch("/api/check-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", id }),
    });
    if (selectedId === id) setSelectedId(null);
    const { data } = await (await fetch("/api/check-list")).json();
    setCategories(data);
  };

  // 5) 아이템 추가
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
  };

  // 6) 아이템 삭제
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
  };

  // 7) 체크박스 토글
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

  return (
    <section className="mt-20">
      {/* 카테고리 추가 */}
      <div>
        <input
          placeholder="새 카테고리"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button onClick={addCategory}>추가</button>
      </div>
      <div>
        {/* 카테고리 리스트 */}
        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              <span
                className={`cursor-pointer ${
                  c.id === selectedId ? "text-red-500" : ""
                }`}
                onClick={() => setSelectedId(c.id)}
              >
                {c.title}
              </span>
              <button className="ml-2" onClick={() => deleteCategory(c.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
        {/* 아이템 섹션 */}
        {selectedId && (
          <div>
            <div>
              <input
                placeholder="아이템 제목"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                placeholder="설명"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <button onClick={addItem}>추가</button>
            </div>
            <ul>
              {items.map((i) => (
                <li key={i.id}>
                  <input
                    type="checkbox"
                    checked={i.is_checked}
                    onChange={() => toggleItem(i.id, i.is_checked)}
                  />
                  <div>
                    <p className={i.is_checked ? "line-through" : ""}>
                      {i.title}
                    </p>
                    {i.description && <small>{i.description}</small>}
                  </div>
                  <button onClick={() => deleteItem(i.id)}>삭제</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

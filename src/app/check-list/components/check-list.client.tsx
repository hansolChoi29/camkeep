"use client";
import { SimpleToast } from "@/app/components/SimpleToast";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import ImageDownloadModal from "@/features/check-list/image-download-modal";

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
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  // 카테고리별 아이템 맵
  const [itemsByCat, setItemsByCat] = useState<Record<string, Item[]>>({});
  // 새 카테고리 입력
  const [newCat, setNewCat] = useState("");
  // 카테고리별 새 아이템 입력(title, desc)
  const [newInputs, setNewInputs] = useState<
    Record<string, { title: string; desc: string }>
  >({});
  // 수정 상태
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatTitle, setEditCatTitle] = useState("");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");
  const [editItemDesc, setEditItemDesc] = useState("");
  // 토스트 알림
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  ); // 알림 타입 관리

  const containerRef = useRef<HTMLDivElement>(null);

  // 카테고리 로드
  useEffect(() => {
    fetch("/api/check-list")
      .then((r) => r.json())
      .then((js) => setCategories(js.data));
  }, []);

  // 각 카테고리별 아이템 로드
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
    setCategories(data.slice().reverse());
    setToast("카테고리 추가 완료!");
    setToastType("success");
  };

  // 카테고리 삭제
  const deleteCategory = async (id: string) => {
    const items = itemsByCat[id] || [];

    // 삭제 허용 조건: 빈 카테고리이거나, 모든 아이템이 체크된 상태
    const canDelete = items.length === 0 || items.every((it) => it.is_checked);
    if (!canDelete) {
      setToast(
        "완료되지 않은 항목이 남아 있습니다. 모든 항목을 완료하거나 비운 뒤에 삭제하세요."
      );
      setToastType("error");
      return;
    }

    // 1) 카테고리 안에 아이템이 있으면, 모두 삭제
    if (items.length > 0) {
      await Promise.all(
        items.map((it) =>
          fetch("/api/check-list", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "item", id: it.id }),
          })
        )
      );
      // 로컬 상태도 비워두기
      setItemsByCat((prev) => ({ ...prev, [id]: [] }));
    }

    // 2) 이제 카테고리 삭제
    await fetch("/api/check-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", id }),
    });

    // 3) 카테고리 목록 갱신 하.. 드디어 됐다.
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
    setToastType("success");
  };

  // 아이템 추가 (카테고리별)
  const addItem = async (categoryId: string) => {
    const { title = "", desc = "" } = newInputs[categoryId] || {};
    if (!title.trim()) return;
    await fetch("/api/check-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        payload: {
          category_id: categoryId,
          title: title.trim(),
          description: desc.trim(),
        },
      }),
    });
    // 입력 초기화
    setNewInputs((prev) => ({
      ...prev,
      [categoryId]: { title: "", desc: "" },
    }));
    // 아이템 다시 로드
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${categoryId}`)
    ).json();
    setItemsByCat((prev) => ({ ...prev, [categoryId]: data }));
    setToast("체크리스트 추가!");
    setToastType("success");
  };

  // 아이템 삭제
  const deleteItem = async (categoryId: string, itemId: string) => {
    await fetch("/api/check-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "item", id: itemId }),
    });
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${categoryId}`)
    ).json();
    setItemsByCat((prev) => ({ ...prev, [categoryId]: data }));
    setToast("체크리스트 삭제!");
    setToastType("success");
  };

  // 아이템 수정 저장
  const saveItem = async (categoryId: string, itemId: string) => {
    await fetch("/api/check-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        id: itemId,
        fields: {
          title: editItemTitle.trim(),
          description: editItemDesc.trim(),
        },
      }),
    });
    setEditItemId(null);
    const { data } = await (
      await fetch(`/api/check-list?categoryId=${categoryId}`)
    ).json();
    setItemsByCat((prev) => ({ ...prev, [categoryId]: data }));
    setToast("체크리스트 수정!");
    setToastType("success");
  };

  // 체크박스 토글
  const toggleItem = async (categoryId: string, item: Item) => {
    await fetch("/api/check-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "item",
        id: item.id,
        fields: { is_checked: !item.is_checked },
      }),
    });
    setItemsByCat((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].map((i) =>
        i.id === item.id ? { ...i, is_checked: !i.is_checked } : i
      ),
    }));
  };

  // 이미지 저장
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
  // TODO:  다운로드 버튼 + 모달
  // TODO: “새 카테고리” 입력 폼
  //TODO: 단일 아이템(체크박스+제목+수정/삭제) ...
  // 드롭스 엄청 길 것 같네 =>Zustand
  return (
    <section className="m-4 mb-20">
      <h2 className="text-3xl mt-10 main">나만의 체크리스트</h2>
      <article className="flex justify-end">
        <motion.button
          type="button"
          onClick={() => setDownloadModalOpen(true)}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            transformOrigin: "center center",
            willChange: "transform",
          }}
          className="w-10 h-10  flex items-center justify-center bg-transparent p-0 m-0
    border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 overflow-visible"
        >
          <Image
            src="/images/check-download.svg"
            alt="download"
            width={30}
            height={30}
            className="block"
          />
        </motion.button>

        {/* 모달 컴포넌트 */}
        <ImageDownloadModal
          open={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          onConfirm={downloadAsImage}
        />
      </article>

      {/* 전체 캡처 영역 */}
      <div
        ref={containerRef}
        className="mt-6 space-y-8 border-[#578E7E] border rounded  p-4"
      >
        <div className="flex gap-2 w-full">
          <Input
            className="p-2 flex-1 text-xs sm:text-base border border-[#578E7E] rounded"
            placeholder="새 카테고리 (대분류 예: 짐싸기)"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />

          <button onClick={addCategory} className="border px-3 rounded">
            <Image
              src="/images/check.svg"
              alt="check"
              className="text-white "
              width={25}
              height={25}
            />
          </button>
        </div>

        {/* 모든 카테고리 + 아이템 렌더링 */}
        {categories.map((cat) => {
          const { title: catTitle = "", desc: catDesc = "" } =
            newInputs[cat.id] || {};
          const items = itemsByCat[cat.id] || [];

          return (
            <div key={cat.id} className="border border-[#578E7E] rounded p-2">
              {/* 카테고리 헤더 */}
              <div className="flex items-center justify-between mb-3">
                {editCatId === cat.id ? (
                  <>
                    <Input
                      className="border p-1 flex-1 rounded"
                      value={editCatTitle}
                      onChange={(e) => setEditCatTitle(e.target.value)}
                    />
                    <button onClick={() => saveCategory(cat.id)}>
                      <Image
                        src="/images/check.svg"
                        alt="check"
                        width={25}
                        height={25}
                        className="m-2"
                      />
                    </button>
                    <button onClick={() => setEditCatId(null)}>
                      <Image
                        src="/images/delete.svg"
                        alt="delete"
                        width={16}
                        height={16}
                        className="m-2"
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
                <Input
                  className="border p-2 flex-1 rounded text-xs sm:text-base"
                  placeholder="TODO (예: 의자 챙기기)"
                  value={catTitle}
                  onChange={(e) =>
                    setNewInputs((prev) => ({
                      ...prev,
                      [cat.id]: { title: e.target.value, desc: catDesc },
                    }))
                  }
                />
                <Input
                  className="border p-1 flex-1 rounded text-xs sm:text-base"
                  placeholder="설명 (선택 예: 의자 닦아서 챙기기)"
                  value={catDesc}
                  onChange={(e) =>
                    setNewInputs((prev) => ({
                      ...prev,
                      [cat.id]: { title: catTitle, desc: e.target.value },
                    }))
                  }
                />
                <button
                  onClick={() => addItem(cat.id)}
                  className="border px-3 rounded"
                >
                  <Image
                    src="/images/check.svg"
                    alt="check"
                    className="text-white"
                    width={25}
                    height={25}
                  />
                </button>
              </div>

              {/* 아이템 리스트 */}
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <motion.button
                      onClick={() => toggleItem(cat.id, item)}
                      initial={false}
                      animate={{
                        scale: item.is_checked ? [1, 1.3, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 flex-shrink-0"
                    >
                      <Image
                        src={
                          item.is_checked
                            ? "/images/check.svg"
                            : "/images/checkbox.svg"
                        }
                        alt={item.is_checked ? "checked" : "unchecked"}
                        width={24}
                        height={24}
                      />
                    </motion.button>
                    {editItemId === item.id ? (
                      <div className="flex-1 space-y-1">
                        <Input
                          className="border p-1 w-full rounded"
                          value={editItemTitle}
                          onChange={(e) => setEditItemTitle(e.target.value)}
                        />
                        <Input
                          className="border p-1 w-full rounded"
                          value={editItemDesc}
                          onChange={(e) => setEditItemDesc(e.target.value)}
                        />
                        <button onClick={() => saveItem(cat.id, item.id)}>
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
                            <button onClick={() => deleteItem(cat.id, item.id)}>
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
          );
        })}
      </div>

      {toast && (
        <SimpleToast
          type={toastType}
          message={toast}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

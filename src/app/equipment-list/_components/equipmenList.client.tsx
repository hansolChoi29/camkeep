"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  mallName: string;
}

export default function EquipmentListClient() {
  const [items, setItems] = useState<NaverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shop?query=캠핑용품&display=30&start=1")
      .then((r) => r.json())
      .then((json) => {
        if (json.items) setItems(json.items);
        else throw new Error(json.error || "Invalid response");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>로딩중…</p>;
  if (error) return <p>에러: {error}</p>;
  if (!items.length) return <p>캠핑용품이 없습니다.</p>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {items.map((item, i) => (
        <li key={i} className="border rounded-md overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title.replace(/<[^>]+>/g, "")}
              width={200}
              height={200}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              No Image
            </div>
          )}
          <div className="p-4">
            <h2
              className="text-lg font-semibold mb-2"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="text-sm text-gray-600">최저가: {item.lprice}원</p>
            <p className="text-sm text-gray-500">{item.mallName}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 underline text-sm"
            >
              상세보기
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

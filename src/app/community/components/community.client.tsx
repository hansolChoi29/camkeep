"use client";
import React, { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function CommunityClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setPosts)
      .catch(() => setError("게시글을 불러오지 못했습니다."));
  }, []);

  return (
    <div className="w-full px-2 sm:px-32 mt-20 sm:mt-44">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="border p-4 rounded w-full">
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(p.created_at).toLocaleString()}
            </p>
            <p className="mt-2">{p.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

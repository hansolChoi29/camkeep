"use client";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function CommunityList() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then(setPosts)
      .catch(console.error);
  }, []);
  return (
    <ul className="space-y-4 px-2 sm:px-32 mt-20 sm:mt-44">
      {posts.map((p) => (
        <li key={p.id} className="border p-4 rounded">
          <h3 className="font-bold">{p.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(p.created_at).toLocaleString()}
          </p>
          <p className="mt-2">{p.content}</p>
        </li>
      ))}
    </ul>
  );
}

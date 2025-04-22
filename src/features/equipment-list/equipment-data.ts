export const CATEGORIES = [
  { label: "텐트", icon: "shop-tent.png" },
  { label: "타프", icon: "shop-tarp.png" },
  { label: "침낭", icon: "sleeping-bag.png" },
  { label: "매트", icon: "shop-mat.png" },
  { label: "테이블", icon: "shop-table.png" },
  { label: "체어", icon: "shop-chair.png" },
  { label: "랜턴", icon: "shop-lantern.png" },
  { label: "스토브", icon: "shop-cooker.png" },
  { label: "쿠커", icon: "shop-cockle.png" },
] as const;
export type Category = (typeof CATEGORIES)[number]["label"];

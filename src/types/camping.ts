// 캠핑관련 (캠핑장 및 용품)

export interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: number; // 최저가
  hprice?: number; // 최고가 (선택)
  mallName: string; // 쇼핑몰 이름
  productId: string; // 상품 고유 ID
  productType: string; // 상품 타입 ("1"=일반, "2"=렌탈)

  brand?: string; // 브랜드
  maker?: string; // 제조사
  category1?: string; // 대분류
  category2?: string; // 중분류
  category3?: string; // 소분류
  category4?: string; // 세분류
}

export interface EquipmentListProps {
  selected: string;
  list: NaverItem[];
  errors: Record<string, string>;
}

import axios from "axios";

export interface CampingItem {
  contentId: number;
  facltNm: string;
  addr1: string;
  firstImageUrl: string;
}

export async function fetchCampingList(
  pageNo: number = 1,
  numOfRows: number = 20
): Promise<CampingItem[]> {
  const { data } = await axios.get(
    "https://apis.data.go.kr/B551011/GoCamping/basedList",
    {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_VISIT_KOREA_KEY!, // ⚠️ 소문자 serviceKey
        MobileOS: "ETC",
        MobileApp: "Camkeep",
        _type: "json",
        pageNo,
        numOfRows,
      },
    }
  );

  const header = data.response?.header;
  if (header?.resultCode !== "0000") {
    throw new Error(header?.resultMsg || "API error");
  }

  const raw = data.response.body.items?.item;
  return Array.isArray(raw) ? raw : raw ? [raw] : [];
}
export async function fetchAllCampingList(): Promise<CampingItem[]> {
  const pageSize = 1000; // 한 페이지에 받을 최대 건수 (서비스 한도에 맞춰 조정)
  let pageNo = 1;
  const allItems: CampingItem[] = [];

  while (true) {
    const items = await fetchCampingList(pageNo, pageSize);
    if (items.length === 0) break; // 더 이상 데이터가 없으면 종료
    allItems.push(...items);
    if (items.length < pageSize) break; // 마지막 페이지
    pageNo += 1;
  }

  return allItems;
}

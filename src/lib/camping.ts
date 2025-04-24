import axios from "axios";

export interface CampingItem {
  contentId: number;
  facltNm: string;
  addr1: string;
  firstImageUrl?: string;
}
export async function fetchCampingList(
  pageNo: number = 1,
  numOfRows: number = 20
): Promise<CampingItem[]> {
  const { data } = await axios.get(
    "https://apis.data.go.kr/B551011/GoCamping/basedList",
    {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_VISIT_KOREA_KEY!,
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
    console.warn("⚠️ GoCamping header:", header);
    throw new Error(header?.resultMsg || "API error");
  }

  const raw = data.response.body.items?.item;
  return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

/**
 * 전체 캠핑장 목록 한 번에 가져오기 (페이징 자동)
 */
export async function fetchAllCampingList(): Promise<CampingItem[]> {
  const pageSize = 1000;
  let pageNo = 1;
  const allItems: CampingItem[] = [];

  while (true) {
    const items = await fetchCampingList(pageNo, pageSize);
    if (items.length === 0) break;
    allItems.push(...items);
    if (items.length < pageSize) break;
    pageNo += 1;
  }

  return allItems;
}

import axios from "axios";

export interface CampingItem {
  contentId: number;
  facltNm: string;
  addr1: string;
  firstImageUrl?: string;
  tel?: string;
  operPdCl?: string;
}

export interface Camp {
  id: string;
  name: string;
  address: string;
  img?: string;
}
export async function fetchCampingList(
  pageNo: number = 1,
  numOfRows: number = 20
): Promise<CampingItem[]> {
  try {
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

    const raw = data?.response?.body?.items?.item;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  } catch (e) {
    console.error("🛑 fetchCampingList 에러:", e);
    return [];
  }
}

/* 전체 캠핑장 목록 한 번에 가져오기 (페이징 자동)
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

export async function fetchCampingById(
  id: number
): Promise<CampingItem | null> {
  const items = await fetchAllCampingList();
  const found = items.find((item) => item.contentId === id);
  return found ?? null;
}

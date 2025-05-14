import axios from "axios";

export interface CampingItem {
  contentId: number;
  facltNm: string;
  addr1: string;
  firstImageUrl?: string;
  tel?: string;
  operPdCl?: string;
  resveCl?: string;
  sbrsCl?: string;
  brazierCl?: string;
  operDeCl?: string;
  gnrlSiteCo?: string;
  autoSiteCo?: string;
  caravSiteCo?: string;
  glampSiteCo?: string;
  animalCmgCl?: string;
  homepage?: string;
  resveUrl?: string;
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

/* 전체 캠핑장 목록 한 번에 가져오기 (페이징 자동)
 */
export async function fetchAllCampingList(): Promise<CampingItem[]> {
  const pageSize = 1000;
  let pageNo = 1;
  const allItems: CampingItem[] = [];

  while (true) {
    const items = await fetchCampingList(pageNo, pageSize);
    console.log("items", items);
    if (items.length === 0) break;
    allItems.push(...items);
    if (items.length < pageSize) break;
    pageNo += 1;
  }

  return allItems;
}

// 동적세그먼트 동작 불가능 문제
//문제의 핵심은 동적 세그먼트에서 detailCommon API 호출이 매번 실패해서 fetchCampingById 가 null 을 반환했고, 그걸 보고 notFound() 가 실행되면서 404 페이지가 떴다는 점
export async function fetchCampingById(
  id: string
): Promise<CampingItem | null> {
  const list = await fetchAllCampingList();
  // 여기는 contentId가 string이기 때문에 toString으로 비교
  //detailCommon 호출 → 500 에러, catch → null 반환
  //목록 조회 fallback (페이징 돌면서 basedList 호출) → 여기도 키 누락 등으로 빈 배열

  // 즉 detail API 호출을 모두 빼고, 이미 잘 받아오는 basedList 데이터만 뒤져서
  // contentId 가 일치하는 항목을 찾으니 항상 camp 에 실제 객체가 들어오고
  // notFound() 로 빠지지 않아서 404 없이 정상 렌더링
  const found = list.find((item) => item.contentId.toString() === id);
  return found ?? null;
}

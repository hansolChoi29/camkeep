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
  hasGlamping?: string;
  lineIntro?: string;
  intro?: string;
}

export interface CampingListResponse {
  items: CampingItem[];
  totalCount: number;
}

const campingListCache: {
  [key: string]: {
    data: CampingItem[];
    totalCount: number;
    timestamp: number;
  };
} = {};

export async function fetchCampingList(
  pageNo: number = 1,
  numOfRows: number = 20
): Promise<CampingListResponse> {
  const cacheKey = `${pageNo}-${numOfRows}`;
  const now = Date.now();

  // 캐시 유효하면 캐시된 데이터와 totalCount 반환
  const cached = campingListCache[cacheKey];
  if (cached && now - cached.timestamp < 600_000) {
    return {
      items: cached.data,
      totalCount: cached.totalCount,
    };
  }

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

  const body = data.response.body;
  const raw = body.items?.item;
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];
  // totalCount 필드가 있으면 사용, 없으면 배열 길이 사용
  const totalCount = body.totalCount ?? items.length;

  // 캐시에 저장
  campingListCache[cacheKey] = {
    data: items,
    totalCount,
    timestamp: now,
  };

  return { items, totalCount };
}

// 동적세그먼트 동작 불가능 문제
//문제의 핵심은 동적 세그먼트에서 detailCommon API 호출이 매번 실패해서 fetchCampingById 가 null 을 반환했고, 그걸 보고 notFound() 가 실행되면서 404 페이지가 떴다는 점
export async function fetchCampingById(
  id: string
): Promise<CampingItem | null> {
  const pageSize = 1000; // 한 페이지에 최대 1000개 로드
  let pageNo = 1;

  while (true) {
    const { items } = await fetchCampingList(pageNo, pageSize);
    if (items.length === 0) break; // 더 이상 데이터 없으면 중단
    const found = items.find((item) => item.contentId.toString() === id);
    if (found) return found; // 발견 즉시 반환
    if (items.length < pageSize) break; // 마지막 페이지였다면 중단
    pageNo += 1;
  }

  return null; // 못 찾으면 null
}

# CAMKEEP

## 브랜치 컨벤션

| **브랜치 타입** | **네이밍 규칙**                  | **설명**                                                |
| --------------- | -------------------------------- | ------------------------------------------------------- |
| Main            | `main` 또는 `master`             | 배포 가능한 최종 코드가 있는 브랜치                     |
| Develop         | `develop`                        | 개발자들이 통합하는 기본 브랜치 (기능 통합 및 테스트)   |
| Feature         | `feature/<티켓번호>-<짧은_설명>` | 새로운 기능 추가를 위한 브랜치                          |
| Bugfix / Fix    | `fix/<티켓번호>-<짧은_설명>`     | 버그나 문제점을 수정하기 위한 브랜치                    |
| Release         | `release/<버전번호>`             | 배포 전 최종 버그 수정, 테스트, 문서 업데이트           |
| Hotfix          | `hotfix/<티켓번호>-<짧은_설명>`  | 배포된 버전에서 긴급하게 수정해야 하는 버그 처리 브랜치 |

---

## 커밋 컨벤션

- **형식:** `<타입>: <변경 사항 요약>`
- **타입 예시:**
  - **feat:** 새로운 기능 추가
  - **fix:** 버그 수정
  - **docs:** 문서 수정
  - **style:** 코드 포맷팅, 스타일 변경 (로직 변경 없음)
  - **refactor:** 코드 리팩토링 (기능 변경 없음)
  - **test:** 테스트 코드 추가/수정
  - **chore:** 기타 잡다한 변경 (빌드, 패키지 등)

---

```
camkeep
├─ public
│  ├─ favicon.png
│  └─ images
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ route.ts
│  │  │  ├─ goCamping.ts
│  │  │  └─ shop
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components
│  │  │  │     └─ auth.client.tsx
│  │  │  └─ register
│  │  │     ├─ page.tsx
│  │  │     └─ _components
│  │  │        └─ register.client.tsx
│  │  ├─ camping
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ camping.client.tsx
│  │  ├─ equipment-list
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ equipmenList.client.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ newbie-guide
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ newbie-guide.client.tsx
│  │  ├─ page.tsx
│  │  └─ _components
│  │     ├─ ClientLayout.tsx
│  │     ├─ home.client.tsx
│  │     ├─ Providers.tsx
│  │     └─ SplashScreen.tsx
│  ├─ components
│  │  └─ ui
│  │     ├─ button.tsx
│  │     ├─ carousel.tsx
│  │     └─ input.tsx
│  ├─ features
│  │  ├─ auth
│  │  ├─ equipment-list
│  │  │  ├─ equipment-data.ts
│  │  │  ├─ equipment-list.tsx
│  │  │  ├─ equipment-modal.tsx
│  │  │  ├─ equipment-nav.tsx
│  │  │  ├─ equipment-search.tsx
│  │  │  ├─ equipment-sort.tsx
│  │  │  └─ index.ts
│  │  ├─ GNB
│  │  │  ├─ GNB.tsx
│  │  │  ├─ gnbData.ts
│  │  │  ├─ GNBItem.tsx
│  │  │  └─ index.ts
│  │  ├─ home
│  │  │  ├─ home-camping-month.tsx
│  │  │  ├─ home-promotion.tsx
│  │  │  └─ promotion-data.ts
│  │  └─ newbie-guide
│  │     ├─ newbie-guide-nav.tsx
│  │     └─ newbie-quide-data.ts
│  ├─ lib
│  │  ├─ auth
│  │  │  └─ session.ts
│  │  ├─ supabaseClient.ts
│  │  └─ utils.ts
│  ├─ store
│  │  └─ userStore.ts
│  ├─ types
│  │  ├─ auth.ts
│  │  ├─ gnbtype.ts
│  │  ├─ index.ts
│  │  ├─ promotion.ts
│  │  ├─ supabase
│  │  │  └─ supabase-type.ts
│  │  └─ user.ts
│  └─ widgets
│     ├─ Footer.tsx
│     └─ Header.tsx
├─ tailwind.config.ts
└─ tsconfig.json

```
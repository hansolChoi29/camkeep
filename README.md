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

#### 중간배포일: 5/2 (금)

---

```
camkeep
├─ .eslintrc.json
├─ components.json ##  shadcn/ui 같은 UI 컴포넌트 생성 도구가 프로젝트 설정을 읽어들이기 위해 사용하는 구성 파일
├─ middleware.ts
├─ next-auth.d.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ favicon.png
│  └─ images
│
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ google
│  │  │  │     └─ callback
│  │  │  │        └─ route.ts
│  │  │  ├─ check-list
│  │  │  │  └─ route.ts
│  │  │  ├─ comments
│  │  │  │  └─ route.ts
│  │  │  ├─ community
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [postId]
│  │  │  │     ├─ comments
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ commu
│  │  │  │     │  └─ route.ts
│  │  │  │     └─ likes
│  │  │  │        └─ route.ts
│  │  │  ├─ go-camping
│  │  │  │  └─ route.ts
│  │  │  ├─ shop
│  │  │  │  └─ route.ts
│  │  │  └─ upload-avatar
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  └─ auth.client.tsx
│  │  │  └─ [mode]
│  │  │     ├─ actions.ts
│  │  │     ├─ layout.tsx
│  │  │     └─ page.tsx
│  │  ├─ camping
│  │  │  ├─ page.tsx
│  │  │  ├─ [id]
│  │  │  │  ├─ components
│  │  │  │  │  └─ camping.client.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ _components
│  │  │     └─ camping.client.tsx
│  │  ├─ check-list
│  │  │  ├─ components
│  │  │  │  └─ check-list.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ community
│  │  │  ├─ components
│  │  │  │  └─ community.client.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     ├─ components
│  │  │     │  └─ community-detail.client.tsx
│  │  │     └─ page.tsx
│  │  ├─ components
│  │  │  ├─ ClientLayout.tsx
│  │  │  ├─ HomeClient.tsx
│  │  │  ├─ Providers.tsx
│  │  │  └─ SplashScreen.tsx
│  │  ├─ equipment-list
│  │  │  ├─ components
│  │  │  │  └─ equipmentList.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ mypage
│  │  │  ├─ components
│  │  │  │  └─ mypage.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ newbie-guide
│  │  │  ├─ components
│  │  │  │  └─ newbie-guide.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ search
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ components
│  │  │  └─ client-layout.tsx
│  │  ├─ SimpleToast.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     └─ input.tsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ auth-google.tsx
│  │  │  └─ auth-kakao.tsx
│  │  ├─ camping
│  │  │  └─ camping-list.tsx
│  │  ├─ check-list
│  │  │  └─ image-download-modal.tsx
│  │  ├─ community
│  │  │  ├─ community-list.tsx
│  │  │  ├─ community-modal.tsx
│  │  │  ├─ community-newpost-form.tsx
│  │  │  └─ like-button.tsx
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
│  │  │  ├─ home-camping-recommend.tsx
│  │  │  ├─ home-equipment-recommend.tsx
│  │  │  ├─ home-promotion.tsx
│  │  │  └─ promotion-data.ts
│  │  ├─ mypage
│  │  │  ├─ coupon-mock.ts
│  │  │  ├─ mypage-cart.tsx
│  │  │  ├─ mypage-comment.tsx
│  │  │  ├─ mypage-commu.tsx
│  │  │  ├─ mypage-coupon.tsx
│  │  │  └─ mypage-profile.tsx
│  │  └─ newbie-guide
│  │     ├─ newbie-list.tsx
│  │     └─ newbie-quide-data.ts
│  ├─ lib
│  │  ├─ auth
│  │  │  └─ session.ts
│  │  ├─ camping.ts
│  │  ├─ supabase
│  │  │  ├─ client.ts
│  │  │  ├─ index.ts
│  │  │  └─ server.ts
│  │  ├─ supabaseAdmin.ts
│  │  ├─ supabaseClient.ts
│  │  └─ utils.ts
│  ├─ store
│  │  └─ useAuthStore.ts
│  ├─ types
│  │  ├─ auth.ts
│  │  ├─ check-list.ts
│  │  ├─ community.ts
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

camkeep
├─ .eslintrc.json
├─ components.json
├─ middleware.ts
├─ next-auth.d.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ favicon.png
│  └─ images
│     ├─ camkeep.png
│     ├─ check-download.svg
│     ├─ check.svg
│     ├─ checkbox.svg
│     ├─ delete.svg
│     ├─ google.svg
│     ├─ header-newbie.png
│     ├─ kakao.svg
│     ├─ menu-chair.png
│     ├─ menu-checklist.png
│     ├─ menu-community.png
│     ├─ menu-person.png
│     ├─ menu-tent.png
│     ├─ newpost.png
│     ├─ promotion-clamping.png
│     ├─ promotion-newbie-batch.png
│     ├─ promotion-photo-contest.png
│     ├─ shop-chair.png
│     ├─ shop-cockle.png
│     ├─ shop-cooker.png
│     ├─ shop-lantern.png
│     ├─ shop-mat.png
│     ├─ shop-table.png
│     ├─ shop-tarp.png
│     ├─ shop-tent.png
│     ├─ sleeping-bag.png
│     └─ update.png
├─ README.md
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ check-list
│  │  │  │  └─ route.ts
│  │  │  ├─ comments
│  │  │  │  └─ route.ts
│  │  │  ├─ community
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [postId]
│  │  │  │     ├─ comments
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ commu
│  │  │  │     │  └─ route.ts
│  │  │  │     └─ likes
│  │  │  │        └─ route.ts
│  │  │  ├─ go-camping
│  │  │  │  └─ route.ts
│  │  │  ├─ shop
│  │  │  │  └─ route.ts
│  │  │  ├─ upload-avatar
│  │  │  │  └─ route.ts
│  │  │  └─ users
│  │  │     └─ upsert
│  │  │        └─ route.ts
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  └─ auth.client.tsx
│  │  │  ├─ oauth-callback
│  │  │  │  └─ page.tsx
│  │  │  └─ [mode]
│  │  │     ├─ actions.ts
│  │  │     ├─ layout.tsx
│  │  │     └─ page.tsx
│  │  ├─ camping
│  │  │  ├─ page.tsx
│  │  │  ├─ [id]
│  │  │  │  ├─ components
│  │  │  │  │  └─ camping.client.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ _components
│  │  │     └─ camping.client.tsx
│  │  ├─ check-list
│  │  │  ├─ components
│  │  │  │  └─ check-list.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ community
│  │  │  ├─ components
│  │  │  │  └─ community.client.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     ├─ components
│  │  │     │  └─ community-detail.client.tsx
│  │  │     └─ page.tsx
│  │  ├─ components
│  │  │  ├─ ClientLayout.tsx
│  │  │  ├─ HomeClient.tsx
│  │  │  ├─ Providers.tsx
│  │  │  └─ SplashScreen.tsx
│  │  ├─ equipment-list
│  │  │  ├─ components
│  │  │  │  └─ equipmentList.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ mypage
│  │  │  ├─ components
│  │  │  │  └─ mypage.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ newbie-guide
│  │  │  ├─ components
│  │  │  │  └─ newbie-guide.client.tsx
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ search
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ components
│  │  │  └─ client-layout.tsx
│  │  ├─ SimpleToast.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     └─ input.tsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ auth-google.tsx
│  │  │  └─ auth-kakao.tsx
│  │  ├─ camping
│  │  │  └─ camping-list.tsx
│  │  ├─ check-list
│  │  │  └─ image-download-modal.tsx
│  │  ├─ community
│  │  │  ├─ community-list.tsx
│  │  │  ├─ community-modal.tsx
│  │  │  ├─ community-newpost-form.tsx
│  │  │  └─ like-button.tsx
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
│  │  │  ├─ home-camping-recommend.tsx
│  │  │  ├─ home-equipment-recommend.tsx
│  │  │  ├─ home-promotion.tsx
│  │  │  └─ promotion-data.ts
│  │  ├─ mypage
│  │  │  ├─ coupon-mock.ts
│  │  │  ├─ mypage-cart.tsx
│  │  │  ├─ mypage-comment.tsx
│  │  │  ├─ mypage-commu.tsx
│  │  │  ├─ mypage-coupon.tsx
│  │  │  └─ mypage-profile.tsx
│  │  └─ newbie-guide
│  │     ├─ newbie-list.tsx
│  │     └─ newbie-quide-data.ts
│  ├─ lib
│  │  ├─ auth
│  │  │  └─ session.ts
│  │  ├─ camping.ts
│  │  ├─ supabase
│  │  │  ├─ client.ts
│  │  │  ├─ index.ts
│  │  │  └─ server.ts
│  │  ├─ supabaseAdmin.ts
│  │  ├─ supabaseClient.ts
│  │  └─ utils.ts
│  ├─ store
│  │  └─ useAuthStore.ts
│  ├─ types
│  │  ├─ auth.ts
│  │  ├─ check-list.ts
│  │  ├─ community.ts
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
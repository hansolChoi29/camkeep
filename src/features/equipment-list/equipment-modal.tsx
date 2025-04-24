/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { css, keyframes } from "@emotion/react";
import Image from "next/image";
import { NaverItem } from "@/app/equipment-list/_components/equipmenList.client";

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  item: NaverItem | null;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

export default function EquipmentModal({
  open,
  onClose,
  item,
}: EquipmentModalProps) {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open || !item) return null;

  const handleOverlayClick = () => {
    if (window.innerWidth < 640) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      css={css`
        animation: ${fadeIn} 0.2s ease-out;
      `}
    >
      <div
        className="relative bg-[#F1EFEC] overflow-y-auto w-full h-full p-4 sm:rounded-lg sm:p-6 sm:max-w-lg sm:mx-4 sm:h-auto sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        css={css`
          animation: ${slideUp} 0.3s ease-out;
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#030303] hover:text-[#4D55CC] text-3xl font-bold leading-none"
          aria-label="닫기"
        >
          &times;
        </button>

        {/* 모달 상세 정보 */}
        <h3
          className="text-xl font-bold mb-4 text-[#030303]"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <Image
          src={item.image}
          alt={item.title.replace(/<[^>]*>/g, "")}
          width={300}
          height={150}
          className="object-cover w-full rounded mb-4"
        />
        <p className="mb-2 text-sm text-[#123458]">판매처: {item.mallName}</p>
        <p className="mb-2 text-sm text-[#123458]">
          브랜드: {item.brand || "정보 없음"}
        </p>
        <p className="mb-2 text-sm text-[#123458]">
          제조사: {item.maker || "정보 없음"}
        </p>
        <p className="mb-2 text-sm text-[#123458]">
          카테고리: {item.category1} / {item.category2} / {item.category3}
        </p>
        <p className="mb-2 text-sm text-[#123458]">
          상품 타입: {item.productType === "1" ? "일반" : "렌탈"}
        </p>
        <p className="mb-4 text-lg font-bold text-[#123458]">
          최저가: {item.lprice}원
        </p>
        {item.hprice && (
          <p className="mb-4 text-sm text-[#123458]">최고가: {item.hprice}원</p>
        )}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-4 py-2 bg-[#211C84] text-white rounded text-center"
        >
          구매 페이지로 이동
        </a>
      </div>
    </div>
  );
}

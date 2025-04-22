/** @jsxImportSource @emotion/react */
import { ReactNode, useEffect } from "react";
import { css, keyframes } from "@emotion/react";

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
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
  children,
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

  if (!open) return null;

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
        className="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        css={css`
          animation: ${slideUp} 0.3s ease-out;
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl leading-none"
          aria-label="닫기"
        >
          &times;
        </button>

        {/* 모달 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}

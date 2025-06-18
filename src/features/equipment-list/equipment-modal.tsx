import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { SimpleToast } from "@/app/components/SimpleToast";
import type { NaverItem } from "@/types/camping";
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  item: NaverItem | null;
}
// 이렇게 사용해도 되는구나
const overlayClass =
  "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
const wrapperClass =
  "relative bg-white w-full h-screen sm:w-[90%] sm:max-w-lg sm:h-auto sm:max-h-[90vh] sm:rounded-lg flex flex-col";
const headerClass = "p-4 flex justify-end";
const bodyClass = "px-4 overflow-y-auto flex-1";
const footerClass = "p-4 flex justify-center gap-2 border-t";

const btnVariants: Variants = {
  rest: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  tap: { scale: 0.95 },
};

export const EquipmentModal: FC<EquipmentModalProps> = ({
  open,
  onClose,
  item,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  );

  useEffect(() => {
    const target = modalRef.current;
    if (open && target) disableBodyScroll(target);
    else if (target) enableBodyScroll(target);
    return () => clearAllBodyScrollLocks();
  }, [open]);

  if (!open || !item) return null;

  const handleGet = () => {
    setToast("업데이트 예정!");
    setToastType("warning");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={overlayClass}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className={wrapperClass}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={headerClass}>
              <div className="flex justify-center items-center w-full font-bold">
                <h3
                  className="sm:text-base text-sm font-bold text-[#3D3D3D] mb-2"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="text-3xl font-bold text-[#578E7E] hover:text-black"
              >
                &times;
              </button>
            </div>

            <div className={bodyClass}>
              <Image
                src={item.image}
                alt={item.title.replace(/<[^>]*>/g, "")}
                width={300}
                height={150}
                className="w-full object-cover rounded mb-4"
              />

              <div className="flex flex-wrap justify-end gap-1 sm:text-sm text-xs text-[#123458] mb-4">
                {[item.category1, item.category2, item.category3].map(
                  (cat) =>
                    cat && (
                      <span
                        key={cat}
                        className="bg-[#578E7E] text-[#FFFAEC] rounded px-2 py-1 font-bold"
                      >
                        {cat}
                      </span>
                    )
                )}
              </div>

              <div className="rounded sm:text-sm text-xs bg-[#FFFAEC] p-4 mb-4">
                <p className="mb-1">판매처: {item.mallName}</p>
                <p className="mb-1">브랜드: {item.brand || "정보 없음"}</p>
                <p className="mb-1">제조사: {item.maker || "정보 없음"}</p>
                <p>상품 타입: {item.productType === "1" ? "일반" : "렌탈"}</p>
              </div>

              <div className="flex justify-end items-baseline gap-2 mb-4">
                <p className="sm:text-lg text-sm font-bold text-[#3D3D3D]">
                  최저가: {item.lprice}원
                </p>
                {item.hprice && (
                  <p className="sm:text-lg text-sm text-[#3D3D3D]">
                    최고가: {item.hprice}원
                  </p>
                )}
              </div>
            </div>

            <div className={footerClass}>
              <motion.button
                onClick={handleGet}
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="w-32 py-2 text-xs sm:text-base font-bold text-[#FFFAEC] bg-[#578E7E] rounded"
              >
                바로 구매
              </motion.button>
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="w-32 py-2 text-xs sm:text-base font-bold text-[#FFFAEC] bg-[#578E7E] rounded flex items-center justify-center"
              >
                판매처로 이동
              </motion.a>
            </div>
          </motion.div>

          {toast && (
            <SimpleToast
              message={toast}
              type={toastType}
              duration={5000}
              onClose={() => setToast(null)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EquipmentModal;

/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import Image from "next/image";
import { NaverItem } from "@/app/equipment-list/_components/equipmenList.client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  item: NaverItem | null;
}

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

  const btnVariants = {
    rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: { scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" },
    tap: { scale: 0.95 },
  };

  const route = useRouter();

  const handleGet = () => {
    route.push("/");
  };
  return (
    <AnimatePresence>
      {open && (
        // overlay
        <motion.div
          className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* modal content */}
          <motion.div
            className="p-4 relative bg-white  overflow-y-auto w-full max-h-[80vh] sm:rounded-lg sm:max-w-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="flex w-full mb-1 justify-end text-[#578E7E] hover:text-black text-3xl font-bold leading-none"
              aria-label="닫기"
            >
              &times;
            </button>

            <Image
              src={item.image}
              alt={item.title.replace(/<[^>]*>/g, "")}
              width={300}
              height={150}
              className="object-cover w-full rounded "
            />

            <h3
              className="text-xl mt-1 font-bold mb-1 text-[#3D3D3D]"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />

            <div className="mb-2 flex gap-1 text-sm text-[#123458] justify-end">
              <p className="bg-[#578E7E] text-[#FFFAEC] rounded p-1 font-bold">
                {item.category1}
              </p>
              <p className="bg-[#578E7E] text-[#FFFAEC] rounded p-1 font-bold">
                {item.category2}
              </p>
              <p className="bg-[#578E7E] text-[#FFFAEC] rounded p-1 font-bold">
                {item.category3}
              </p>
            </div>

            <div className="bg-white rounded p-2">
              <p className="pb-2 text-sm ">판매처: {item.mallName}</p>
              <p className="pb-2 text-sm ">
                브랜드: {item.brand || "정보 없음"}
              </p>
              <p className="pb-2 text-sm ">
                제조사: {item.maker || "정보 없음"}
              </p>

              <p className="pb-2 text-sm ">
                상품 타입: {item.productType === "1" ? "일반" : "렌탈"}
              </p>

              <hr className="w-full border-t-1 border-[#578E7E] my-4" />

              <div className="flex justify-end">
                <p className="pt-2 text-lg font-bold text-[#3D3D3D]">
                  최저가: {item.lprice}원
                </p>
                {item.hprice && (
                  <p className=" text-sm text-[#3D3D3D]">
                    최고가: {item.hprice}원
                  </p>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className=" flex justify-center items-center gap-6 ">
              <motion.button
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate="rest"
                className="inline-block w-32 px-2 py-1 bg-[#578E7E] font-bold text-[#FFFAEC] rounded text-center"
              >
                {" "}
                장바구니넣기
              </motion.button>

              <motion.button
                onClick={handleGet}
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate="rest"
                className="inline-block px-2 w-32 py-1 bg-[#578E7E] font-bold text-[#FFFAEC] rounded text-center"
              >
                바로 구매
              </motion.button>
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener"
                referrerPolicy="no-referrer-when-downgrade"
                className="inline-block px-2 w-40 py-1 bg-[#578E7E] font-bold text-[#FFFAEC] rounded text-center"
                variants={btnVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate="rest"
              >
                구매 페이지로 이동
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface CommunityModalProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
}

export default function CommunityNewpostModal({
  onClose,
  open,
  children,
}: CommunityModalProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0   bg-black bg-opacity-50 z-50 flex justify-center items-center "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white overflow-y-auto 
             w-full h-full flex flex-col justify-start 
              sm:block sm:w-auto sm:h-auto sm:rounded-lg sm:max-w-lg sm:max-h-[80vh] sm:p-6 p-12
               [&::-webkit-scrollbar]:hidden`}
          >
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <div className="w-full relative flex justify-center items-center py-2">
                <h1 className="main w-full sm:text-xl text-sm flex justify-center items-center">
                  나도 게시 할 거야~
                </h1>
                <AlertDialogTrigger asChild>
                  <motion.button
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    animate="rest"
                    className="absolute top-2 right-4 "
                  >
                    <Image
                      src="/icons/close.svg"
                      alt="close"
                      width={20}
                      height={20}
                    />
                  </motion.button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 닫으시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      작성 중인 내용이 모두 사라집니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={onClose}>
                      닫기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </div>
            </AlertDialog>

            <div className="mt-10 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CATEGORIES } from "@/features/newbie-guide/newbie-quide-data";
import { useState } from "react";

export default function NewbieList() {
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
      className="space-y-1"
    >
      {CATEGORIES.map(({ label, text }) => (
        <div
          key={label}
          className={`border rounded ${
            openValue === label ? "border-[#578E7E]" : "border-white"
          }`}
        >
          <AccordionItem key={label} value={label}>
            <AccordionTrigger
              className={`px-2 flex justify-between items-center text-lg font-semibold rounded-t pl-2
                             bg-white text-[#578E7E] 
                             data-[state=open]:bg-[#578E7E] 
                             data-[state=open]:text-white `}
            >
              <span>{label}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="p-3 whitespace-pre-wrap sm:text-base leading-relaxed ">
                {text}
              </p>
            </AccordionContent>
          </AccordionItem>
        </div>
      ))}
    </Accordion>
  );
}

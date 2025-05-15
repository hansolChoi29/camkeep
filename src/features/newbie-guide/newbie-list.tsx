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
      className="space-y-4"
    >
      {CATEGORIES.map(({ label, text }) => (
        <AccordionItem key={label} value={label}>
          <AccordionTrigger className="flex justify-between items-center text-lg font-semibold text-[#578E7E]">
            <span>{label}</span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="whitespace-pre-wrap sm:text-base leading-relaxed">
              {text}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

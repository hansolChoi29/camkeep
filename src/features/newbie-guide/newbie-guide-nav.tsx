"use client";

import { CATEGORIES } from "./newbie-quide-data";
import { GuideCategory } from "@/app/newbie-guide/components/newbie-guide.client";
import { motion } from "framer-motion";

interface NewbieGuideNavProps {
  selected: GuideCategory;
  setSelected: React.Dispatch<React.SetStateAction<GuideCategory>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function NewbieGuideNav({
  selected,
  setSelected,
  setSearch,
}: NewbieGuideNavProps) {
  return (
    <nav className="flex flex-wrap">
      {CATEGORIES.map(({ label }) => (
        <motion.button
          key={label}
          onClick={() => {
            setSelected(label);
            setSearch("");
          }}
          className={`
            flex-shrink-0 px-2 py-1 m-1 rounded-full whitespace-nowrap
            border
          `}
          animate={{
            backgroundColor: selected === label ? "#504B38" : "transparent",
            color: selected === label ? "#ffffff" : "#ffffff",
            borderColor: selected === label ? "transparent" : "#CCCCCC",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.2,
          }}
        >
          {label}
        </motion.button>
      ))}
    </nav>
  );
}

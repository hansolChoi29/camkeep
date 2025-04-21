import Image from "next/image";
import { CATEGORIES, Category } from "./equipment-data";

interface NaProps {
  selected: Category;
  setSelected: React.Dispatch<React.SetStateAction<Category>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function EquipmentNav(props: NaProps) {
  const { selected, setSelected, setSearch } = props;
  return (
    <div>
      <nav className="flex sm:justify-center pl-4 sm:items-center  rounded-xl mb-12 bg-[#DCE4C9]  flex-wrap items-center h-auto overflow-auto">
        {CATEGORIES.map(({ label: cat, icon }) => (
          <button
            key={cat}
            onClick={() => {
              setSelected(cat);
              setSearch("");
            }}
            className={
              "flex flex-col m-1 items-center px-2 py-1 rounded-lg " +
              (selected === cat ? "border-[#E07B39] border  text-black" : "  ")
            }
          >
            <Image
              src={`/images/${icon}`}
              alt={cat}
              width={30}
              height={30}
              className="sm:w-14"
            />
            <span className="text-xs sm:text-xl mt-1 font-semibold">{cat}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

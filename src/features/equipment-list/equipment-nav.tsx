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
      <nav className="flex sm:justify-center pl-4 sm:items-center  rounded-xl mb-12 bg-[#B9B28A]  flex-wrap items-center h-auto overflow-auto">
        {CATEGORIES.map(({ label: cat, icon }) => (
          <button
            key={cat}
            onClick={() => {
              setSelected(cat);
              setSearch("");
            }}
            className={`
              flex flex-col m-1 font-bold text-[#504B38] items-center
              px-2 py-1 rounded-lg
              transition-colors transition-transform duration-200 ease-in-out
              hover:bg-[#F8F3D9]/20 hover:scale-105
              active:scale-95
              ${
                selected === cat
                  ? "border-[#F8F3D9] border text-[#F8F3D9]"
                  : "border-transparent"
              }
            `}
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

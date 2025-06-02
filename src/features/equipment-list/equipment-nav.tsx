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
    <div className="overflow-auto mb-12  justify-center items-center flex flex-col">
      <nav>
        <div className="mt-24 flex-wrap flex justify-center rounded-xl  bg-[#F5ECD5]   ">
          {CATEGORIES.map(({ label: cat, icon }) => (
            <button
              key={cat}
              onClick={() => {
                setSelected(cat);
                setSearch("");
              }}
              className={`
              items-center m-1 px-2 py-1 rounded-lg font-bold  text-black
              transition duration-200 ease-in-out transform
              hover:bg-[#F1EFEC]/20 hover:scale-105 active:scale-95
              ${
                selected === cat
                  ? "border border-[#D4C9BE] "
                  : "border-transparent "
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
              <span className="mt-1 font-semibold text-xs sm:text-xl">
                {cat}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

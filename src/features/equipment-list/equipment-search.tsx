import { Input } from "@/components/ui/input";

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
}

export default function EquipmentSearch(props: SearchProps) {
  const { search, setSearch, selected } = props;
  return (
    <>
      <div>
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${selected} 검색`}
          className="w-full border  focus-visible:ring-2 focus-visible:ring-[#B6A28E] "
        />
      </div>
    </>
  );
}

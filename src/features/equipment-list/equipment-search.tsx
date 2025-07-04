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
      <div className="flex justify-center">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${selected} 검색`}
          className=" border w-96 focus-visible:ring-1 focus-visible:ring-[#578E7E] "
        />
      </div>
    </>
  );
}

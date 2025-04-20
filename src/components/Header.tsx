"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  const handlelogin = () => {
    router.push("/login");
  };

  return (
    <header className="bg-[#E07B39] p-4">
      <div className="flex justify-between">
        <button onClick={handleHome}>
          <Image
            src="/images/camkeep.png"
            alt="Camkeep 로고"
            width={100}
            height={20}
            priority
          />
        </button>

        <div className="flex ">
          <button className="mr-2 text-[18px] hover:text-white">메뉴</button>
          <button
            onClick={handlelogin}
            className="text-[18px] hover:text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

import { City } from "@/src/features/cities/types/city.types";

interface HeaderProps {
  city?: City;
}

export default function Header({ city }: HeaderProps) {
  const handleSearchClick = () => {
    const officeSection = document.getElementById("Fresh-Space");
    if (officeSection) {
      officeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="flex flex-col w-full relative z-0">
      <section id="Hero-Banner" className="relative flex h-[720px] -mb-[93px]">
        <div
          id="Hero-Text"
          className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] p-10 gap-[30px] bg-white mt-[70px] z-10 ml-[40px] xl:ml-[calc((100%-1130px)/2)]"
        >
          <div className="flex items-center w-fit rounded-full py-2 px-4 gap-[10px] bg-[#000929]">
            <img src="/assets/images/icons/crown-white.svg" className="w-5 h-5" alt="icon" />
            <span className="font-semibold text-white">
              Kantor Top Yang Tersedia di Berbagai Daerah di Indonesia
            </span>
          </div>
          {city ? (
            <>
              <h1 className="font-extrabold text-[50px] leading-[60px]">
                Great Office in <span className="text-[#0D903A]">{city.name} City</span>
              </h1>
              <p className="text-lg leading-8 text-[#000929]">
                Kantor yang tepat dapat memberikan impact pekerjaan menjadi lebih baik dan sehat dalam tumbuhkan karir.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-extrabold text-[50px] leading-[60px]">
                OfficeHub<br />Mempermudah Urusan Anda
              </h1>
              <p className="text-lg leading-8 text-[#000929]">
                Platform terpercaya untuk mencari kantor yang tepat dapat memberikan impact pekerjaan menjadi lebih baik
                dan sehat dalam tumbuhkan karir.
              </p>
            </>
          )}
          <div className="flex items-center gap-5">
            <button
              onClick={handleSearchClick}
              className="flex items-center rounded-full p-[20px_26px] gap-3 bg-[#0D903A] hover:bg-[#0B7A2F] transition-colors cursor-pointer"
            >
              <img src="/assets/images/icons/slider-horizontal-white.svg" className="w-[30px] h-[30px]" alt="icon" />
              <span className="font-bold text-xl leading-[30px] text-[#F7F7FD]">Cari Sekarang</span>
            </button>
          </div>
        </div>
        <div
          id="Hero-Image"
          className="absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[720px] rounded-bl-[40px] overflow-hidden"
        >
          <img src={city ? city.image : "/assets/images/backgrounds/banner.webp"} className="w-full h-full object-cover" alt="hero background" />
        </div>
      </section>
      <div className="flex flex-col pt-[150px] pb-10 px-[120px] gap-10 bg-[#0D903A]">
      </div>
    </header>
  );
}
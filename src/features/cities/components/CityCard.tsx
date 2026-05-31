import Image from "next/image";
import { City } from "@/src/types";
import Link from "next/link";

export default function CityCard({ city }: { city: City }) {
  return (
    <Link href={`/city/${city.slug}`} className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden select-none" draggable="false">
      <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none rounded-[20px]">
        <h3 className="font-bold text-xl leading-[30px] text-white">
          {city.name}
        </h3>
        <p className="text-white">{city.officeCount} Offices</p>
      </div>
      <Image
        width={230}
        height={300}
        src={city.image}
        className="absolute w-full h-full object-cover"
        alt={city.name}
        draggable="true"
      />
    </Link>
  );
}
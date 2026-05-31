import Link from "next/link";
import { OfficeSpace } from "../types/officeSpace.types";
import Image from "next/image";

export default function OfficeSpaceCard({ space }: { space: OfficeSpace }) {
  return (
    <Link href={`/office/${space.slug}`} className="card">
      <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] bg-white overflow-hidden">
        <div className="thumbnail-container relative w-full h-[200px] rounded-t-[20px] overflow-hidden">
          <div className="absolute top-5 left-5 flex flex-col gap-1 z-10">
            {space.tags.map((tag) => (
              <p
                key={tag}
                className="w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]"
              >
                {tag}
              </p>
            ))}
          </div>
          <Image
            src={space.image}
            alt="thumbnails"
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="card-detail-container flex flex-col p-5 pb-[30px] gap-4">
          <h3 className="font-bold text-[22px] leading-[36px]">
            {space.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-xl leading-[30px]">
              Rp {space.price.toLocaleString('id')}
            </p>
            <div className="flex items-center justify-end gap-[6px]">
              <p className="font-semibold">{space.duration}</p>
              <Image src="/assets/images/icons/clock.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
            </div>
          </div>
          <hr className="border-[#F6F5FD]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <Image src="/assets/images/icons/location.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
              <p className="font-semibold">{space.location}</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <p className="font-semibold">{space.rating}/5</p>
              <Image src="/assets/images/icons/Star 1.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
            </div>
          </div>
          <hr className="border-[#F6F5FD]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <Image src="/assets/images/icons/wifi.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
              <p className="font-semibold">{space.features[0]}</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <Image src="/assets/images/icons/security-user.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
              <p className="font-semibold">{space.features[1]}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
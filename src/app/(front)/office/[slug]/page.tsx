import NavbarWrapper from "@/src/components/NavbarWrapper";
import Link from "next/link";
import Image from "next/image";
import OfficeHeader from "@/src/features/offices/components/OfficeHeader";
import { officeSpaces } from "@/src/features/offices/data/officeSpaces.mock";
import { notFound } from "next/navigation";
import OfficeFeatures from "@/src/features/offices/components/OfficeFeatures";
import SalesContactCard from "@/src/features/offices/components/SalesContactCard";
import SaveForLaterButton from "@/src/features/offices/components/SaveForLaterButton";
import { StartChatButton } from "@/src/features/chat/components/StartChatButton";

type Props = {
  params: {
    slug: string;
  };
};

export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const office = officeSpaces.find((item) => item.slug === slug);
  if (!office) return { title: "Office Not Found | OfficeHub" };
  return {
    title: `${office.title} | OfficeHub`,
    description: office.about,
  };
}

export async function generateStaticParams() {
  return officeSpaces.map((office) => ({
    slug: office.slug,
  }));
}

export default async function OfficeSpaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const office = officeSpaces.find((item) => item.slug === slug);
  if (!office) return notFound();

  return (
    <>
      <NavbarWrapper />
      <OfficeHeader image={office.image} images={office.images}/>
      <section id="Details" className="relative flex max-w-[1130px] mx-auto gap-[30px] mb-20 z-10">

        <div className="flex flex-col w-full rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
          {office.tags.map((tag) => (
            <p key={tag} className="w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]">
              {tag}
            </p>
          ))}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-extrabold text-[32px] leading-[44px]">{office.title}</h1>
              <div className="flex items-center gap-[6px] mt-[10px]">
                <Image src="/assets/images/icons/location.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                <p className="font-semibold">{office.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-[6px] items-end shrink-0">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Image
                    key={i}
                    src={i < Math.floor(office.rating) ? "/assets/images/icons/Star 1.svg" : "/assets/images/icons/Star 5.svg"}
                    className="w-5 h-5"
                    alt="star"
                    width={20}
                    height={20}
                  />
                ))}
              </div>
              <p className="font-semibold">{office.rating}/5 (19,384)</p>
            </div>
          </div>

          <p className="leading-[30px]">{office.about}</p>

          <hr className="border-[#F6F5FD]" />
          <h2 className="font-bold">You Get What You Need Most</h2>
          <OfficeFeatures features={office.features} />

          <hr className="border-[#F6F5FD]" />
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-bold">Office Address</h2>
            <p>{office.address}</p>
          </div>

          <div className="overflow-hidden w-full h-[280px]">
            <div id="my-map-display" className="h-full w-full max-w-[none] bg-none">
              <iframe
                className="h-full w-full border-0"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(office.title)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
              />
            </div>
          </div>
        </div>

        <div className="w-[392px] flex flex-col shrink-0 gap-[30px]">
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
            {office.isFullyBooked ? (
              <div>
                <p className="font-bold text-xl leading-[30px]">Sorry. this office is <span className="text-[#FF2D2D]">fully booked</span> at this moment, try next time.</p>
              </div>
            ) : (
              <div>
                <p className="font-extrabold text-[32px] leading-[48px] text-[#0D903A]">
                  Rp {office.price.toLocaleString('id-ID')}
                </p>
                <p className="font-semibold mt-1">For {office.duration} working</p>
              </div>
            )}
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Image src="/assets/images/icons/verify.svg" className="w-[30px] h-[30px]" alt="icon" width={30} height={30} />
                  <p className="font-semibold leading-[28px]">Mendapatkan akses pembelajaran terbaru terkait dunia startup</p>
                </div>
              ))}
            </div>
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-[14px]">
              {office.isFullyBooked ? (
                <SaveForLaterButton
  officeId={office.id}
  officeTitle={office.title}
  officeSlug={office.slug}
  officeImage={office.image}
  officePrice={office.price}
  officeLocation={office.location}
/>
              ) : (
                <>
                <Link href={`/booking/${office.slug}`} className="flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD] hover:bg-[#0B7A2F] transition-colors">
                  <Image src="/assets/images/icons/slider-horizontal-white.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                  <span>Book This Office</span>
                </Link>
                {office.providerId && (
                  <StartChatButton
                    officeId={office.id}
                    officeTitle={office.title}
                    officeProviderId={office.providerId}
                  />
                )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[20px] bg-white">
            <h2 className="font-bold">Contact Our Sales</h2>
            <div className="flex flex-col gap-[30px]">
              {office.salesContacts.map((contact, index) => (
                <SalesContactCard
                  key={index}
                  contact={contact}
                  officeId={office.id}
                  officeTitle={office.title}
                  officeProviderId={office.providerId}
                />
              ))}
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
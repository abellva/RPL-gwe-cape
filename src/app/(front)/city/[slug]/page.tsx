import Navbar from "@/src/components/Navbar";
import Header from "@/src/components/Header";
import { cities } from "@/src/features/cities/data/cities.mock";
import { officeSpaces } from "@/src/features/offices/data/officeSpaces.mock";
import OfficeSpaceCard from "@/src/features/offices/components/OfficeSpaceCard";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `Office Spaces in ${cityName} | OfficeHub`,
    description: `Browse available office spaces in ${cityName}. Find the perfect workspace for your business.`,
  };
}

export default async function CityDetailPage({ params }: Props){
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  if (!city) return notFound();

  const cityOffices = officeSpaces.filter(
    (space) => space.location === city.name
  );

    return(
        <>
  <Navbar/>
  <Header city={city}/>
  <section
    id="Fresh-Space"
    className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]"
  >
    <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
      Browse Offices
    </h2>

        <div className="grid grid-cols-3 gap-[30px]">
        {cityOffices.length > 0 ? (
          cityOffices.map((space) => (
            <OfficeSpaceCard key={space.id} space={space} />
          ))
        ) : (
          <p className="text-lg leading-8 text-[#000929]">
            No office spaces available in {city.name} at the moment. Please check back later.
        </p>
      )}</div>
  </section>
</>
    );
}
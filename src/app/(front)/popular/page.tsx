import NavbarWrapper from "@/src/components/NavbarWrapper";
import OfficeSpaceCard from "@/src/features/offices/components/OfficeSpaceCard";
import { officeSpaces } from "@/src/features/offices/data/officeSpaces.mock";

export const metadata = {
  title: "Popular Office Spaces | OfficeHub",
  description: "Discover the most popular office spaces in Indonesia",
};

export default async function PopularPage() {
  const offices = officeSpaces.filter((office) => office.tags.includes("Popular"));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]">
      <NavbarWrapper />
      <section className="w-full max-w-[1130px] mx-auto mt-[10px] mb-[80px] px-4">
        {offices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-[#999999]">No offices found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[30px]">
            {offices.map((office) => (
              <OfficeSpaceCard key={office.id} space={office} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
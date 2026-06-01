"use client";

import OfficeSpaceCard from "../components/OfficeSpaceCard";
import { useState, useEffect } from "react";
import type { OfficeSpace } from "../types/officeSpace.types";
import { getAllOffices } from "../store/providerOffices.store";

export default function FreshSpaceSection() {
  const [offices, setOffices] = useState<OfficeSpace[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOffices(getAllOffices());
    setIsHydrated(true);
  }, []);

  return (
    <section
      id="Fresh-Space"
      className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[100px] mb-[120px]"
    >
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-center">
        Browse Our Fresh Space.<br />For Your Better Productivity.
      </h2>
      <div className="grid grid-cols-3 gap-[30px]">
        {isHydrated && offices.map((office) => (
          <OfficeSpaceCard key={office.id} space={office} />
        ))}
      </div>
    </section> 
  );
}

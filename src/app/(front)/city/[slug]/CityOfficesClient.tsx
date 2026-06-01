'use client';

import { useMemo, useState } from 'react';
import OfficeSpaceCard from '@/src/features/offices/components/OfficeSpaceCard';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import { getAllOffices } from '@/src/features/offices/store/providerOffices.store';

export default function CityOfficesClient({ cityName }: { cityName: string }) {
  const [offices] = useState<OfficeSpace[]>(() => getAllOffices());

  const cityOffices = useMemo(() => offices.filter((o) => o.location === cityName), [offices, cityName]);

  return (
    <div className="grid grid-cols-3 gap-[30px]">
      {cityOffices.length > 0 ? (
        cityOffices.map((space) => <OfficeSpaceCard key={space.id} space={space} />)
      ) : (
        <p className="text-lg leading-8 text-[#000929]">
          No office spaces available in {cityName} at the moment. Please check back later.
        </p>
      )}
    </div>
  );
}


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { officeSpaces } from '@/src/features/offices/data/officeSpaces.mock';

export default function ProviderOfficesPage() {
  const { user } = useAuth();
  const myOffices = officeSpaces.filter((o) => String(o.providerId) === String(user?.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-[#000929]">Kantor Saya ({myOffices.length})</h2>
          <p className="text-sm opacity-60 mt-1">Kelola listing kantor yang Anda daftarkan</p>
        </div>
        <button
          disabled
          className="rounded-full bg-[#FF852D] text-white font-semibold px-6 py-2.5 text-sm opacity-50 cursor-not-allowed"
          title="Fitur tambah kantor akan segera hadir"
        >
          + Tambah Kantor
        </button>
      </div>

      {myOffices.length === 0 ? (
        <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-12 text-center">
          <p className="text-lg font-semibold opacity-60 mb-2">Belum ada kantor terdaftar</p>
          <p className="text-sm opacity-40">Hubungi admin untuk mendaftarkan kantor Anda ke platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {myOffices.map((office) => (
            <div key={office.id} className="bg-white border border-[#E0DEF7] rounded-[20px] overflow-hidden">
              <div className="relative h-[180px]">
                <Image src={office.image} alt={office.title} fill className="object-cover" />
                {office.isFullyBooked && (
                  <span className="absolute top-4 right-4 bg-[#FF2D2D] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Fully Booked
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-[#000929] leading-snug">{office.title}</h3>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Image src="/assets/images/icons/location.svg" width={16} height={16} alt="" />
                  {office.location}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#FF852D]">
                    Rp {office.price.toLocaleString('id-ID')}
                    <span className="text-xs font-normal opacity-60"> / {office.duration}</span>
                  </p>
                  <span className="text-sm font-semibold">⭐ {office.rating}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/office/${office.slug}`}
                    className="flex-1 text-center rounded-full border border-[#E0DEF7] py-2 text-sm font-semibold hover:border-[#FF852D] transition-all"
                  >
                    Lihat
                  </Link>
                  <button
                    disabled
                    className="flex-1 rounded-full bg-[#F7F7FD] py-2 text-sm font-semibold opacity-50 cursor-not-allowed"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { use } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllOffices } from '@/src/features/offices/store/providerOffices.store';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

interface DurationOption {
  label: string;
  days: number;
}

export default function BookingPage({ params }: { params: Props['params'] }) {
  const { slug } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [office, setOffice] = useState<OfficeSpace | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const durationOptions: DurationOption[] = [
    { label: '10 days', days: 10 },
    { label: '15 days', days: 15 },
    { label: '20 days', days: 20 },
    { label: '30 days', days: 30 },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role === 'office_provider' || user.role === 'admin') {
      alert('Hanya customer yang bisa melakukan booking.');
      router.push(user.role === 'office_provider' ? '/provider' : '/admin');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const foundOffice = getAllOffices().find((item) => item.slug === slug);
    if (foundOffice) {
      setOffice(foundOffice);
      setPageLoading(false);
    } else {
      router.push('/');
    }
  }, [slug, router]);

  const calculatePrice = () => {
    if (!office) return 0;
    const pricePerDay = office.price / parseInt(office.duration.split(' ')[0]);
    return Math.round(pricePerDay * selectedDuration);
  };

  const handleBooking = async () => {
  if (!user || !office) {
    alert('Please login first');
    return;
  }
  if (user.role === 'office_provider' || user.role === 'admin') {
    alert('Hanya customer yang bisa melakukan booking.');
    router.push(user.role === 'office_provider' ? '/provider' : '/admin');
    return;
  }
  if (office.isFullyBooked) {
    alert('Kantor ini sedang fully booked.');
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch('http://localhost:5000/api/bookings/create', { // ← tambah /create
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,           // ← snake_case sesuai controller
        office_id: office.id,
        office_title: office.title,
        office_slug: office.slug,
        price: calculatePrice(),
        duration: `${selectedDuration} days`,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Booking berhasil! ID: ' + result.id);
      router.push('/customer/bookings');
    } else {
      const err = await response.json();
      alert('Gagal booking: ' + (err.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error booking:', error);
    alert('Server tidak bisa dihubungi. Pastikan backend jalan di port 5000.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!office) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Office not found</p>
          <Link href="/" className="text-[#0D903A] font-semibold hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FD]">
      <nav className="bg-white border-b border-[#E0DEF7] sticky top-0 z-50">
        <div className="flex items-center justify-between w-full max-w-[1130px] py-[22px] mx-auto px-4">
          <Link href="/">
            <Image src="/assets/images/logos/logo.svg" alt="logo" width={150} height={40} style={{ height: 'auto' }} />
          </Link>
          <h1 className="font-bold text-lg">Book Office</h1>
          <h1 className="font-bold text-lg"><Link href="/">Home</Link></h1>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#000929]">{user.name}</span>
            <span className="bg-[#0D903A] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              {user.role === 'office_provider' ? 'Provider' : user.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-[1130px] mx-auto px-4 py-10">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-[20px] border border-[#E0DEF7] p-[30px] mb-8">
              <div className="mb-10 overflow-hidden rounded-[30px] h-[300px]">
                <Image src={office.image} alt={office.title} width={800} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#000929] mb-3">{office.title}</h2>
                <div className="flex items-center gap-[6px] text-lg">
                  <Image src="/assets/images/icons/location.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                  <p className="font-semibold">{office.location}</p>
                </div>
              </div>
              <hr className="border-[#F6F5FD] mb-6" />
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">About</h3>
                <p className="text-[#000929] opacity-70 leading-[28px]">{office.about}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">You Get What You Need Most</h3>
                <div className="grid grid-cols-2 gap-4">
                  {office.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image src="/assets/images/icons/verify.svg" className="w-[30px] h-[30px] flex-shrink-0" alt="icon" width={30} height={30} />
                      <p className="font-semibold text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-[20px] border border-[#E0DEF7] p-[30px] sticky top-[100px]">
              <div className="mb-8">
                <p className="text-sm text-[#000929] opacity-70 mb-2">Total harga</p>
                <p className="font-extrabold text-[32px] leading-[48px] text-[#0D903A]">
                  Rp {calculatePrice().toLocaleString('id-ID')}
                </p>
                <p className="font-semibold text-sm mt-2">Untuk {selectedDuration} hari</p>
              </div>
              <hr className="border-[#F6F5FD] mb-8" />
              <div className="mb-8">
                <label className="block font-bold text-lg mb-4">Pilih Durasi</label>
                <div className="grid grid-cols-2 gap-3">
                  {durationOptions.map((option) => (
                    <button
                      key={option.days}
                      onClick={() => setSelectedDuration(option.days)}
                      className={`p-3 rounded-[10px] border-2 font-semibold transition-all ${
                        selectedDuration === option.days
                          ? 'border-[#0D903A] bg-[#0D903A] text-white'
                          : 'border-[#E0DEF7] bg-white text-[#000929] hover:border-[#0D903A]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-[#F6F5FD] mb-8" />
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3">
                  <Image src="/assets/images/icons/verify.svg" className="w-[24px] h-[24px]" alt="icon" width={24} height={24} />
                  <p className="text-sm font-semibold">Konfirmasi instan</p>
                </div>
                <div className="flex items-center gap-3">
                  <Image src="/assets/images/icons/verify.svg" className="w-[24px] h-[24px]" alt="icon" width={24} height={24} />
                  <p className="text-sm font-semibold">Pembatalan fleksibel</p>
                </div>
                <div className="flex items-center gap-3">
                  <Image src="/assets/images/icons/verify.svg" className="w-[24px] h-[24px]" alt="icon" width={24} height={24} />
                  <p className="text-sm font-semibold">Support 24/7</p>
                </div>
              </div>
              <hr className="border-[#F6F5FD] mb-8" />
              <button
                onClick={handleBooking}
                disabled={isSubmitting}
                className="w-full rounded-full p-[16px_26px] bg-[#0D903A] text-white font-bold hover:bg-[#0B7A2F] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Image src="/assets/images/icons/slider-horizontal-white.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                    <span>Konfirmasi Booking</span>
                  </>
                )}
              </button>
              <p className="text-xs text-[#000929] opacity-60 text-center mt-4">
                Kamu bisa kelola booking dari dashboard kapan saja
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { officeSpaces } from '@/src/features/offices/data/officeSpaces.mock';

interface Booking {
  id: number;
  user_id: number;
  office_id: string;
  office_title: string;
  office_slug: string;
  price: number;
  duration: string;
  status: string;
  created_at: string;
}

export default function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const getOfficeData = (slug: string) =>
    officeSpaces.find((o) => o.slug === slug);

  const statusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-[#0D903A]';
      case 'pending':   return 'bg-[#FF852D]';
      case 'cancelled': return 'bg-[#FF2D2D]';
      default:          return 'bg-[#FF852D]';
    }
  };

  if (loadingBookings || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <h2 className="font-bold text-lg">My Bookings</h2>
        <p className="text-sm opacity-60 mt-1">Kelola semua pemesanan kantor Anda</p>
      </div>

      <section className="flex flex-col gap-[30px]">

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-[20px] border border-[#E0DEF7] p-[60px] gap-5 text-center">
            <Image src="/assets/images/icons/receipt-text-black.svg" width={48} height={48} alt="" className="opacity-30" />
            <p className="text-lg font-semibold text-[#000929] opacity-60">
              Kamu belum punya booking.
            </p>
            <Link
              href="/"
              className="flex items-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] text-white font-bold hover:bg-[#0B7A2F] transition-colors"
            >
              Cari Kantor Sekarang
            </Link>
          </div>
        ) : (
          bookings.map((booking) => {
            const office = getOfficeData(booking.office_slug);
            const bookedDate = new Date(booking.created_at).toLocaleDateString('en-US', {
              day: 'numeric', month: 'long', year: 'numeric',
            });

            return (
              <div key={booking.id} className="grid grid-cols-2 gap-[30px]">

                {/* Left Card — Office + Customer */}
                <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                  <div className="flex items-center gap-4">
                    <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden">
                      <img
                        src={office?.image ?? '/assets/images/thumbnails/thumbnail-details-4.png'}
                        className="w-full h-full object-cover"
                        alt={booking.office_title}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-xl leading-[30px]">{booking.office_title}</p>
                      <div className="flex items-center gap-[6px]">
                        <Image src="/assets/images/icons/location.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                        <p className="font-semibold">{office?.location ?? 'Indonesia'}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#F6F5FD]" />

                  <div className="flex flex-col gap-4">
                    <h2 className="font-bold">Customer Details</h2>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Full Name</h3>
                      <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                        <img src="/assets/images/icons/security-user-black.svg" className="w-6 h-6" alt="icon" />
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Tanggal Booking</h3>
                      <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                        <img src="/assets/images/icons/calendar-black.svg" className="w-6 h-6" alt="icon" />
                        <p className="font-semibold">{bookedDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Durasi</h3>
                      <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                        <img src="/assets/images/icons/clock.svg" className="w-6 h-6" alt="icon" />
                        <p className="font-semibold">{booking.duration}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#F6F5FD]" />

                  <div className="flex items-center gap-3">
                    <Image src="/assets/images/icons/shield-tick.svg" className="w-[30px] h-[30px]" alt="icon" width={30} height={30} />
                    <p className="font-semibold leading-[28px]">Privasi Anda aman bersama kami.</p>
                  </div>
                </div>

                {/* Right Card — Order Details */}
                <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                  <h2 className="font-bold">Order Details</h2>

                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Status Booking</p>
                      <p className={`rounded-full w-fit p-[6px_16px] ${statusStyle(booking.status)} font-bold text-sm leading-[21px] text-[#F7F7FD] uppercase`}>
                        {booking.status}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Booking ID</p>
                      <p className="font-bold">#{String(booking.id).padStart(6, '0')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Durasi</p>
                      <p className="font-bold">{booking.duration}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Total Amount</p>
                      <p className="font-bold text-[22px] leading-[33px] text-[#0D903A]">
                        Rp {Number(booking.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <hr className="border-[#F6F5FD]" />

                  <Link
                    href="/"
                    className="flex items-center justify-center w-full rounded-full border border-[#000929] p-[12px_20px] gap-3 bg-white font-semibold hover:bg-[#F7F7FD] transition-colors"
                  >
                    <Image src="/assets/images/icons/call-black.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
                    <span>Call Customer Service</span>
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
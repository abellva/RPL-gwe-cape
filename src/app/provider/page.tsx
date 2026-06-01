'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { StatCard } from '@/src/features/dashboard/components/StatCard';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';
import { dashboardService } from '@/src/features/dashboard/services/dashboard.service';
import { DashboardBooking } from '@/src/features/dashboard/types/dashboard.types';
import { officeSpaces } from '@/src/features/offices/data/officeSpaces.mock';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const myOffices = officeSpaces.filter((o) => String(o.providerId) === String(user?.id));
  const myOfficeIds = myOffices.map((o) => o.id);

  useEffect(() => {
    dashboardService.getAllBookings()
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setBookings(all.filter((b) => myOfficeIds.includes(b.office_id)));
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const revenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.price), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#FF852D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <h2 className="font-bold text-lg text-[#000929]">Selamat datang, {user?.name}</h2>
        <p className="text-sm text-[#000929] opacity-60 mt-1">Kelola kantor dan pemesanan dari panel provider ini.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Kantor Saya" value={myOffices.length} icon="🏢" accent="#FF852D" />
        <StatCard label="Total Booking" value={bookings.length} icon="📅" accent="#FF852D" />
        <StatCard label="Pending" value={pending} icon="⏳" accent="#FF852D" />
        <StatCard label="Pendapatan" value={`Rp ${revenue.toLocaleString('id-ID')}`} icon="💰" accent="#FF852D" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Link href="/provider/offices" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">🏢 Kelola Kantor</h3>
          <p className="text-sm opacity-60">Lihat dan kelola listing kantor Anda</p>
        </Link>
        <Link href="/provider/bookings" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">📅 Lihat Bookings</h3>
          <p className="text-sm opacity-60">Konfirmasi pemesanan dari customer</p>
        </Link>
        <Link href="/" className="p-6 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#FF852D] hover:shadow-md transition-all">
          <h3 className="font-semibold text-[#000929] mb-1">🌐 Lihat Website</h3>
          <p className="text-sm opacity-60">Preview halaman publik kantor Anda</p>
        </Link>
      </div>

      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-[#000929]">Booking Terbaru</h3>
          <Link href="/provider/bookings" className="text-sm font-semibold text-[#FF852D] hover:underline">Lihat semua</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm opacity-50 text-center py-8">Belum ada booking untuk kantor Anda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0DEF7] text-left opacity-60">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Kantor</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Harga</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-[#F7F7FD]">
                    <td className="py-3 font-semibold">#{String(b.id).padStart(4, '0')}</td>
                    <td className="py-3">{b.office_title}</td>
                    <td className="py-3">{b.user?.name ?? `User #${b.user_id}`}</td>
                    <td className="py-3">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                    <td className="py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

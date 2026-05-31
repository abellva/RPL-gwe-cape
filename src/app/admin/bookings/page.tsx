'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/src/features/dashboard/components/StatusBadge';
import { dashboardService } from '@/src/features/dashboard/services/dashboard.service';
import { DashboardBooking } from '@/src/features/dashboard/types/dashboard.types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchBookings = () => {
    dashboardService.getAllBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    await dashboardService.updateBookingStatus(id, status);
    fetchBookings();
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
      <h2 className="font-bold text-lg text-[#000929] mb-6">Semua Booking ({bookings.length})</h2>

      {bookings.length === 0 ? (
        <p className="text-sm opacity-50 text-center py-12">Belum ada booking.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0DEF7] text-left opacity-60">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Kantor</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Durasi</th>
                <th className="pb-3 font-medium">Harga</th>
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-[#F7F7FD]">
                  <td className="py-4 font-semibold">#{String(b.id).padStart(4, '0')}</td>
                  <td className="py-4">{b.office_title}</td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{b.user?.name ?? `User #${b.user_id}`}</p>
                      <p className="text-xs opacity-50">{b.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-4">{b.duration}</td>
                  <td className="py-4 font-semibold text-[#0D903A]">Rp {Number(b.price).toLocaleString('id-ID')}</td>
                  <td className="py-4 opacity-70">
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4"><StatusBadge status={b.status} /></td>
                  <td className="py-4">
                    <select
                      value={b.status}
                      disabled={updating === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="border border-[#E0DEF7] rounded-full px-3 py-1.5 text-sm bg-[#F7F7FD] focus:outline-none focus:border-[#0D903A]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

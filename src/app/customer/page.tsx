'use client';

import Link from 'next/link';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { ChatPanel } from '@/src/features/chat/components/ChatPanel';

export default function CustomerDashboard() {
  const { user } = useAuth();

  const quickLinks = [
    { icon: '📅', title: 'My Bookings', href: '/customer/bookings' },
    { icon: '💾', title: 'Wishlist', href: '/customer/wishlist' },
    { icon: '🏢', title: 'Cari Kantor', href: '/' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <h2 className="font-bold text-lg">Selamat datang, {user?.name ?? 'Customer'}</h2>
        <p className="text-sm opacity-60 mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="p-4 bg-white border border-[#E0DEF7] rounded-[20px] hover:border-[#0D903A] hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="font-semibold text-sm mt-2">{item.title}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">💬 Chat dengan Provider</h3>
            <p className="text-sm opacity-60 mt-1">Hubungi office provider tentang kantor yang ingin disewa</p>
          </div>
          <Link href="/customer/chat" className="text-sm font-semibold text-[#0D903A] hover:underline">
            Buka fullscreen
          </Link>
        </div>
        <ChatPanel mode="customer" />
      </div>
    </div>
  );
}

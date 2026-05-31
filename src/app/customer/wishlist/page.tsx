'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface WishlistItem {
  id: number;
  office_id: number;
  office_title: string;
  office_slug: string;
  office_image: string;
  office_price: number;
  office_location: string;
  created_at: Date;
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchWishlists = async () => {
      try {
        const res = await fetch(`/api/wishlists/user/${user.id}`);
        const data = await res.json();
        setWishlists(Array.isArray(data) ? data : []);
      } catch {
        console.error('Failed to fetch wishlists');
      } finally {
        setLoadingData(false);
      }
    };
    fetchWishlists();
  }, [user]);

  const handleRemove = async (id: number) => {
    try {
      await fetch(`/api/wishlists/${id}`, { method: 'DELETE' });
      setWishlists(wishlists.filter((w) => w.id !== id));
    } catch {
      console.error('Failed to remove wishlist');
    }
  };

  if (loadingData || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#0D903A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6">
        <h2 className="font-bold text-lg">My Wishlist</h2>
        <p className="text-sm opacity-60 mt-1">Kantor favorit yang Anda simpan</p>
      </div>

      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-white rounded-[20px] border border-[#E0DEF7]">
          <div className="text-3xl">💾</div>
          <p className="font-semibold">Wishlist kosong</p>
          <p className="text-sm opacity-50">Simpan kantor favorit dari halaman detail kantor</p>
          <Link href="/" className="mt-2 px-6 py-3 bg-[#0D903A] text-white font-semibold rounded-full hover:bg-[#0B7A2F] transition-colors">
            Cari Kantor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {wishlists.map((item) => (
            <div key={item.id} className="flex flex-col rounded-[20px] border border-[#E0DEF7] bg-white overflow-hidden">
              <div className="relative w-full h-[200px]">
                <Image src={item.office_image} alt={item.office_title} fill className="object-cover" />
              </div>
              <div className="flex flex-col p-5 gap-3">
                <h3 className="font-bold">{item.office_title}</h3>
                <p className="text-sm opacity-50">{item.office_location}</p>
                <p className="font-semibold text-[#0D903A]">Rp {item.office_price.toLocaleString('id-ID')}</p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/office/${item.office_slug}`} className="flex-1 text-center py-2 rounded-full bg-[#0D903A] text-white text-sm font-semibold hover:bg-[#0B7A2F] transition-colors">
                    Lihat Detail
                  </Link>
                  <button onClick={() => handleRemove(item.id)} className="px-4 py-2 rounded-full border border-[#FF2D2D] text-[#FF2D2D] text-sm font-semibold hover:bg-[#FF2D2D] hover:text-white transition-all">
                    Hapus
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

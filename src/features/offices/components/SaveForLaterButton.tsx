'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/src/features/auth/context/AuthContext';

interface Props {
  officeId: number;
  officeTitle: string;
  officeSlug: string;
  officeImage: string;
  officePrice: number;
  officeLocation: string;
}

export default function SaveForLaterButton({ officeId, officeTitle, officeSlug, officeImage, officePrice, officeLocation }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/wishlists/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          office_id: officeId,
          office_title: officeTitle,
          office_slug: officeSlug,
          office_image: officeImage,
          office_price: officePrice,
          office_location: officeLocation,
        }),
      });
      if (res.ok) {
        setSaved(true);
        window.location.href = '/customer/wishlist';
      }
    } catch {
      console.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      className={`flex items-center justify-center w-full rounded-full border p-[16px_26px] gap-3 font-semibold transition-all ${
        saved
          ? 'border-[#0D903A] text-[#0D903A] bg-[#f0faf0]'
          : 'border-[#000929] bg-white hover:bg-gray-50'
      }`}
    >
      <Image src="/assets/images/icons/save-add.svg" className="w-6 h-6" alt="icon" width={24} height={24} />
      <span>{saved ? 'Saved!' : loading ? 'Saving...' : 'Save for Later'}</span>
    </button>
  );
}
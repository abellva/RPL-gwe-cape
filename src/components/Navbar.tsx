'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/features/auth/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleRoleClick = () => {
  if (user?.role === 'admin') {
    router.push('/admin');
  } else if (user?.role === 'office_provider') {
    router.push('/provider');
  } else if (user?.role === 'user') {
    router.push('/customer');
  }
};

  return (
    <nav className="bg-white sticky top-0 z-0">
      <div className="flex items-center justify-between w-full max-w-[1130px] py-[22px] mx-auto">
        <Link href="/">
          <Image src="/assets/images/logos/logo.svg" alt="logo" width={150} height={75} />
        </Link>
        <ul className="flex items-center gap-[50px] w-fit">
          {!isHome && <li><Link href="/">Home</Link></li>}
          <li><Link href="/popular">Popular</Link></li>
          <li><Link href="/search-city">Search City</Link></li>
          {user && user.role === 'user' && <li><Link href="/customer/bookings">My Booking</Link></li>}
        </ul>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#000929]">{user.name}</span>
                <button
                  onClick={handleRoleClick}
                  className="text-xs bg-[#0D903A] text-white px-5 py-3 rounded-full capitalize hover:bg-[#0B7A2F] transition-colors cursor-pointer font-semibold"
                >
                  {user.role === 'office_provider' ? 'Provider' : user.role === 'user' ? 'Customer' : user.role}
                </button>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-[10px] rounded-full border border-[#FF2D2D] text-[#FF2D2D] py-3 px-5 hover:bg-[#FF2D2D] hover:text-white transition-all font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-[20px] rounded-full border border-[#000929] py-3 px-5 hover:bg-[#000929] hover:text-white transition-all font-semibold">
              {/* <Image src="/assets/images/icons/call.svg" className="w-6 h-6" alt="icon" width={24} height={24} /> */}
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
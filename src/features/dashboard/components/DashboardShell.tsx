'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { DashboardNavItem, DashboardTheme } from '../types/dashboard.types';

const themeConfig: Record<DashboardTheme, { accent: string; badge: string }> = {
  admin: { accent: '#0D903A', badge: 'Admin' },
  provider: { accent: '#FF852D', badge: 'Provider' },
  customer: { accent: '#0D903A', badge: 'Customer' },
};

interface DashboardShellProps {
  theme: DashboardTheme;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ theme, navItems, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const config = themeConfig[theme];

  return (
    <div className="min-h-screen bg-[#F7F7FD]">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#E0DEF7] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full max-w-[1130px] py-[22px] mx-auto px-4">
          <Link href="/">
            <Image src="/assets/images/logos/logo.svg" alt="logo" width={150} height={40} style={{ height: "auto" }} />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="font-medium text-[#000929] hover:text-[#0D903A] transition-colors">Home</Link>
            <span className="font-semibold text-[#000929]">{user?.name}</span>
            <span className="text-white text-xs font-semibold px-4 py-1.5 rounded-full" style={{ backgroundColor: config.accent }}>
              {config.badge}
            </span>
            <button
              onClick={logout}
              className="rounded-full border border-[#FF2D2D] text-[#FF2D2D] font-semibold py-2 px-5 hover:bg-[#FF2D2D] hover:text-white transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className="bg-white border-r border-[#E0DEF7] fixed left-0 z-40 h-[calc(100vh-81px)] top-[81px] overflow-hidden hover:overflow-y-auto"
        style={{ width: '260px' }}
      >
        <nav className="p-4 flex flex-col gap-1 h-full overflow-y-auto">
          {navItems.map((item) => {
            const basePath = theme === 'admin' ? '/admin' : theme === 'provider' ? '/provider' : '/customer';
            const isActive = pathname === item.href || (item.href !== basePath && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-[14px] font-medium transition-all text-sm"
                style={{
                  backgroundColor: isActive ? `${config.accent}12` : 'transparent',
                  color: isActive ? config.accent : '#000929',
                  borderLeft: isActive ? `3px solid ${config.accent}` : '3px solid transparent',
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={{ marginLeft: theme === 'customer' ? '260px' : '260px', paddingTop: '81px', paddingLeft: theme === 'customer' ? '0' : '32px', paddingRight: theme === 'customer' ? '0' : '32px' }} className="pb-8">
  {children}
</main>

    </div>
  );
}
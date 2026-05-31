'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { DashboardNavItem, DashboardTheme } from '../types/dashboard.types';

const themeConfig: Record<DashboardTheme, { accent: string; badge: string; label: string }> = {
  admin: { accent: '#0D903A', badge: 'Admin', label: 'Admin Panel' },
  provider: { accent: '#FF852D', badge: 'Provider', label: 'Provider Panel' },
  customer: { accent: '#0D903A', badge: 'Customer', label: 'Customer Panel' },
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
    <div className="min-h-screen bg-[#F7F7FD] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#E0DEF7] flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#E0DEF7]">
          <Link href="/">
            <Image src="/assets/images/logos/logo.svg" alt="logo" width={130} height={36} style={{ height: 'auto' }} />
          </Link>
          <p className="text-xs font-semibold mt-3 opacity-50 uppercase tracking-wider">{config.label}</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
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

        <div className="p-4 border-t border-[#E0DEF7]">
          <div className="px-4 py-3 mb-2">
            <p className="font-semibold text-sm text-[#000929] truncate">{user?.name}</p>
            <p className="text-xs text-[#000929] opacity-50 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-full border border-[#FF2D2D] text-[#FF2D2D] font-semibold py-2 px-4 text-sm hover:bg-[#FF2D2D] hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E0DEF7] px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-xl text-[#000929]">
              {navItems.find((n) => pathname === n.href || (n.href !== (theme === 'admin' ? '/admin' : theme === 'provider' ? '/provider' : '/customer') && pathname.startsWith(n.href)))?.label ?? 'Dashboard'}
            </h1>
          </div>
          <span
            className="text-white text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{ backgroundColor: config.accent }}
          >
            {config.badge}
          </span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

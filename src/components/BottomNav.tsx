'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/vocab', icon: BookOpen, label: '词汇本' },
  { href: '/profile', icon: User, label: '我的' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#1A1A1A]/5 px-6 py-2 flex justify-around items-center z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-95 ${
              isActive ? 'text-[#0F4C81]' : 'text-[#6B6B6B] hover:text-[#0F4C81]'
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

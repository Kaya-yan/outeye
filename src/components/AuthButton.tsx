'use client';

import { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem('outeye-login') === 'true');
  }, []);

  if (!mounted) return <span className="w-8 h-8 inline-block" />;

  const handleLogin = () => {
    localStorage.setItem('outeye-login', 'true');
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('outeye-login');
    window.location.reload();
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-sm">👤</div>
        <button onClick={handleLogout} className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#E63946] hover:bg-[#E63946]/10 transition-colors" title="退出登录">
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F4C81] text-white text-sm hover:bg-[#0F4C81]/90 active:scale-95 transition-all">
      <LogIn size={14} />
      <span>登录</span>
    </button>
  );
}

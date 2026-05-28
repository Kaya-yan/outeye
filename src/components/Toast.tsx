'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
let addToastFn: ((type: ToastType, message: string) => void) | null = null;

export function showToast(type: ToastType, message: string) {
  addToastFn?.(type, message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const icons = {
    success: <CheckCircle size={18} className="text-[#2A9D8F]" />,
    error: <XCircle size={18} className="text-[#E63946]" />,
    info: <Info size={18} className="text-[#0F4C81]" />,
  };

  const bgColors = {
    success: 'bg-[#2A9D8F]/10 border-[#2A9D8F]/20',
    error: 'bg-[#E63946]/10 border-[#E63946]/20',
    info: 'bg-[#0F4C81]/10 border-[#0F4C81]/20',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <span className="text-sm text-[#1A1A1A] flex-1">{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-[#6B6B6B] hover:text-[#1A1A1A]"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
